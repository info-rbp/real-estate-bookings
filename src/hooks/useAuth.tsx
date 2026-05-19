import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// Mock user and profile data
const mockUser = {
  id: 'mock-user-id',
  email: 'user@example.com',
};

const mockProfile = {
  id: 'mock-profile-id',
  user_id: 'mock-user-id',
  full_name: 'John Doe',
  email: 'user@example.com',
  phone: '123-456-7890',
  timezone: 'America/New_York',
  email_notifications: true,
  sms_notifications: false,
  two_factor_enabled: false,
  role: 'client',
};

interface AuthContextType {
  user: typeof mockUser | null;
  profile: typeof mockProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<typeof mockProfile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [profile, setProfile] = useState<typeof mockProfile | null>(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate session loading
    const session = localStorage.getItem('session');
    if (session) {
      setUser(mockUser);
      setProfile(mockProfile);
    }
    setLoading(false);
  }, []);

  async function signUp(email: string, password: string, fullName: string) {
    // Mock sign-up
    console.log('Signing up with', email, password, fullName);
    localStorage.setItem('session', 'true');
    setUser(mockUser);
    setProfile(mockProfile);
    return { error: null };
  }

  async function signIn(email: string, password: string) {
    // Mock sign-in
    console.log('Signing in with', email, password);
    localStorage.setItem('session', 'true');
    setUser(mockUser);
    setProfile(mockProfile);
    return { error: null };
  }

  async function signOut() {
    // Mock sign-out
    console.log('Signing out');
    localStorage.removeItem('session');
    setUser(null);
    setProfile(null);
  }

  async function updateProfile(updates: Partial<typeof mockProfile>) {
    // Mock profile update
    if (!user) return { error: 'Not authenticated' };
    console.log('Updating profile with', updates);
    setProfile(prev => (prev ? { ...prev, ...updates } : null));
    return { error: null };
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
