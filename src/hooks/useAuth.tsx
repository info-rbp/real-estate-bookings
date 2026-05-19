import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ID, Models, Permission, Query, Role } from 'appwrite'
import { account, appwriteConfig, databases, isAppwriteConfigured } from '../lib/appwrite'

export type AppUserRole = 'admin' | 'staff' | 'client' | 'client_admin' | 'client_user'

export interface AppProfile {
  $id: string
  appwriteUserId: string
  clientId: string | null
  full_name: string
  email: string
  phone: string | null
  timezone: string
  email_notifications: boolean
  sms_notifications: boolean
  two_factor_enabled: boolean
  role: AppUserRole
  avatar_url: string | null
}

interface AuthResult {
  error: string | null
  profile?: AppProfile | null
}

interface AuthContextType {
  user: Models.User<Models.Preferences> | null
  profile: AppProfile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>
  sendEmailVerification: () => Promise<{ error: string | null }>
  refreshProfile: () => Promise<AppProfile | null>
  updateProfile: (updates: Partial<AppProfile>) => Promise<{ error: string | null }>
  hasRole: (roles: AppUserRole | AppUserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getProfileDefaults(user: Models.User<Models.Preferences>): AppProfile {
  return {
    $id: user.$id,
    appwriteUserId: user.$id,
    clientId: null,
    full_name: user.name || user.email,
    email: user.email,
    phone: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Australia/Perth',
    email_notifications: true,
    sms_notifications: false,
    two_factor_enabled: false,
    role: 'client',
    avatar_url: null,
  }
}

async function fetchProfile(userId: string): Promise<AppProfile | null> {
  if (!appwriteConfig.databaseId || !appwriteConfig.usersCollectionId) {
    return null
  }

  try {
    const document = await databases.getDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.usersCollectionId,
      documentId: userId,
    })

    return document as unknown as AppProfile
  } catch {
    try {
      const response = await databases.listDocuments({
        databaseId: appwriteConfig.databaseId,
        collectionId: appwriteConfig.usersCollectionId,
        queries: [Query.equal('appwriteUserId', userId), Query.limit(1)],
      })

      return (response.documents[0] as unknown as AppProfile) || null
    } catch {
      return null
    }
  }
}

async function upsertProfile(user: Models.User<Models.Preferences>, overrides?: Partial<AppProfile>): Promise<AppProfile | null> {
  if (!appwriteConfig.databaseId || !appwriteConfig.usersCollectionId) {
    return getProfileDefaults(user)
  }

  const data = {
    ...getProfileDefaults(user),
    ...overrides,
    appwriteUserId: user.$id,
    email: overrides?.email || user.email,
    full_name: overrides?.full_name || user.name || user.email,
  }

  try {
    const updated = await databases.updateDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.usersCollectionId,
      documentId: user.$id,
      data,
    })

    return updated as unknown as AppProfile
  } catch {
    try {
      const created = await databases.createDocument({
        databaseId: appwriteConfig.databaseId,
        collectionId: appwriteConfig.usersCollectionId,
        documentId: user.$id,
        data,
        permissions: [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ],
      })

      return created as unknown as AppProfile
    } catch {
      return data
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [profile, setProfile] = useState<AppProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function refreshProfile() {
    if (!user) {
      setProfile(null)
      return null
    }

    const nextProfile = (await fetchProfile(user.$id)) || getProfileDefaults(user)
    setProfile(nextProfile)
    return nextProfile
  }

  useEffect(() => {
    let mounted = true

    async function bootstrapSession() {
      if (!isAppwriteConfigured) {
        if (mounted) {
          setLoading(false)
        }
        return
      }

      try {
        const currentUser = await account.get()
        const currentProfile = (await fetchProfile(currentUser.$id)) || getProfileDefaults(currentUser)

        if (!mounted) {
          return
        }

        setUser(currentUser)
        setProfile(currentProfile)
      } catch {
        if (!mounted) {
          return
        }

        setUser(null)
        setProfile(null)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    bootstrapSession()

    return () => {
      mounted = false
    }
  }, [])

  async function signUp(email: string, password: string, fullName: string): Promise<AuthResult> {
    if (!isAppwriteConfigured) {
      return { error: 'Appwrite is not configured. Add the required Vite environment variables first.' }
    }

    try {
      await account.create({
        userId: ID.unique(),
        email,
        password,
        name: fullName,
      })

      await account.createEmailPasswordSession({ email, password })

      const currentUser = await account.get()
      const nextProfile = await upsertProfile(currentUser, { full_name: fullName, role: 'client' })

      setUser(currentUser)
      setProfile(nextProfile)

      return { error: null, profile: nextProfile }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to create your account right now.' }
    }
  }

  async function signIn(email: string, password: string): Promise<AuthResult> {
    if (!isAppwriteConfigured) {
      return { error: 'Appwrite is not configured. Add the required Vite environment variables first.' }
    }

    try {
      await account.createEmailPasswordSession({ email, password })
      const currentUser = await account.get()
      const currentProfile = (await fetchProfile(currentUser.$id)) || (await upsertProfile(currentUser)) || getProfileDefaults(currentUser)

      setUser(currentUser)
      setProfile(currentProfile)

      return { error: null, profile: currentProfile }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to sign you in right now.' }
    }
  }

  async function signOut() {
    if (isAppwriteConfigured) {
      try {
        await account.deleteSession({ sessionId: 'current' })
      } catch {
        // Ignore logout cleanup failures and clear local state anyway.
      }
    }

    setUser(null)
    setProfile(null)
  }

  async function requestPasswordReset(email: string) {
    if (!isAppwriteConfigured) {
      return { error: 'Appwrite is not configured. Add the required Vite environment variables first.' }
    }

    try {
      await account.createRecovery({
        email,
        url: `${window.location.origin}/login`,
      })
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to send password reset instructions.' }
    }
  }

  async function sendEmailVerification() {
    if (!isAppwriteConfigured) {
      return { error: 'Appwrite is not configured. Add the required Vite environment variables first.' }
    }

    try {
      await account.createVerification({
        url: `${window.location.origin}/login`,
      })
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to send verification email.' }
    }
  }

  async function updateProfile(updates: Partial<AppProfile>) {
    if (!user) {
      return { error: 'Not authenticated.' }
    }

    if (!appwriteConfig.databaseId || !appwriteConfig.usersCollectionId) {
      setProfile((previous) => (previous ? { ...previous, ...updates } : null))
      return { error: null }
    }

    try {
      const updated = await databases.updateDocument({
        databaseId: appwriteConfig.databaseId,
        collectionId: appwriteConfig.usersCollectionId,
        documentId: user.$id,
        data: updates,
      })

      setProfile(updated as unknown as AppProfile)
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to save your profile changes.' }
    }
  }

  function hasRole(roles: AppUserRole | AppUserRole[]) {
    if (!profile) {
      return false
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    return allowedRoles.includes(profile.role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        requestPasswordReset,
        sendEmailVerification,
        refreshProfile,
        updateProfile,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
