import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ID, Models, Query } from 'appwrite'
import { account, appwriteConfig, databases, functions, isAppwriteConfigured } from '../lib/appwrite'

export type AppUserRole = 'admin' | 'staff' | 'client_admin' | 'client_user' | 'pending'

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
  status: 'pending' | 'active' | 'disabled' | 'invited'
  avatar_url: string | null
}

type EditableProfileField = 'full_name' | 'phone' | 'timezone' | 'email_notifications' | 'sms_notifications' | 'avatar_url'
export type EditableProfileUpdates = Partial<Pick<AppProfile, EditableProfileField>>

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
  updateProfile: (updates: EditableProfileUpdates) => Promise<{ error: string | null }>
  hasRole: (roles: AppUserRole | AppUserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const safeProfileFields: EditableProfileField[] = ['full_name', 'phone', 'timezone', 'email_notifications', 'sms_notifications', 'avatar_url']
const validRoles: AppUserRole[] = ['admin', 'staff', 'client_admin', 'client_user', 'pending']

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
    role: 'pending',
    status: 'pending',
    avatar_url: null,
  }
}

function normalizeProfile(user: Models.User<Models.Preferences>, document?: Partial<AppProfile> | null): AppProfile {
  const defaults = getProfileDefaults(user)
  const role = document?.role && validRoles.includes(document.role) ? document.role : 'pending'

  return {
    ...defaults,
    ...document,
    $id: document?.$id || user.$id,
    appwriteUserId: document?.appwriteUserId || user.$id,
    clientId: document?.clientId || null,
    email: document?.email || user.email,
    full_name: document?.full_name || user.name || user.email,
    phone: document?.phone || null,
    timezone: document?.timezone || defaults.timezone,
    email_notifications: document?.email_notifications ?? true,
    sms_notifications: document?.sms_notifications ?? false,
    two_factor_enabled: document?.two_factor_enabled ?? false,
    role,
    status: document?.status || 'pending',
    avatar_url: document?.avatar_url || null,
  }
}

function sanitizeProfileUpdates(updates: EditableProfileUpdates): EditableProfileUpdates {
  return safeProfileFields.reduce<EditableProfileUpdates>((safeUpdates, field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      safeUpdates[field] = updates[field] as never
    }
    return safeUpdates
  }, {})
}

function parseProfileExecutionResponse(responseBody?: string): AppProfile | null {
  if (!responseBody) {
    return null
  }

  try {
    const parsed = JSON.parse(responseBody) as { profile?: AppProfile }
    return parsed.profile || null
  } catch {
    return null
  }
}

async function fetchProfile(user: Models.User<Models.Preferences>): Promise<AppProfile | null> {
  if (!appwriteConfig.databaseId || !appwriteConfig.usersCollectionId) {
    return null
  }

  try {
    const document = await databases.getDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.usersCollectionId,
      documentId: user.$id,
    })

    return normalizeProfile(user, document as unknown as Partial<AppProfile>)
  } catch {
    try {
      const response = await databases.listDocuments({
        databaseId: appwriteConfig.databaseId,
        collectionId: appwriteConfig.usersCollectionId,
        queries: [Query.equal('appwriteUserId', user.$id), Query.limit(1)],
      })

      return response.documents[0] ? normalizeProfile(user, response.documents[0] as unknown as Partial<AppProfile>) : null
    } catch {
      return null
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

    const nextProfile = (await fetchProfile(user)) || getProfileDefaults(user)
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
        const currentProfile = (await fetchProfile(currentUser)) || getProfileDefaults(currentUser)

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
      const nextProfile = (await fetchProfile(currentUser)) || getProfileDefaults(currentUser)

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
      const currentProfile = (await fetchProfile(currentUser)) || getProfileDefaults(currentUser)

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

  async function updateProfile(updates: EditableProfileUpdates) {
    if (!user) {
      return { error: 'Not authenticated.' }
    }

    const safeUpdates = sanitizeProfileUpdates(updates)

    if (Object.keys(safeUpdates).length === 0) {
      return { error: null }
    }

    if (!appwriteConfig.profileUpdateFunctionId) {
      return { error: 'Profile updates require the profile update Appwrite Function.' }
    }

    try {
      const execution = (await functions.createExecution({
        functionId: appwriteConfig.profileUpdateFunctionId,
        body: JSON.stringify(safeUpdates),
        async: false,
        method: 'POST',
      })) as unknown as { responseBody?: string; responseStatusCode?: number }

      if (execution.responseStatusCode && execution.responseStatusCode >= 400) {
        return { error: 'Unable to save your profile changes.' }
      }

      const updatedProfile = parseProfileExecutionResponse(execution.responseBody)
      setProfile((previous) => (updatedProfile ? normalizeProfile(user, updatedProfile) : previous ? { ...previous, ...safeUpdates } : null))
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
