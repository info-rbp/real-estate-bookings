import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'
import Footer from '../components/Footer'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const { requestPasswordReset, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)

    if (isLogin) {
      const result = await signIn(email, password)

      if (result.error) {
        setError(result.error)
      } else if (result.profile?.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    } else {
      if (!fullName.trim()) {
        setError('Full name is required')
        setLoading(false)
        return
      }

      const result = await signUp(email, password, fullName)

      if (result.error) {
        setError(result.error)
      } else {
        setNotice('Your account was created. Check your email if verification is enabled in Appwrite.')
        navigate('/dashboard')
      }
    }

    setLoading(false)
  }

  async function handlePasswordReset() {
    setError('')
    setNotice('')

    if (!email.trim()) {
      setError('Enter your email address first so we know where to send the reset link.')
      return
    }

    setLoading(true)
    const result = await requestPasswordReset(email)

    if (result.error) {
      setError(result.error)
    } else {
      setNotice('Password reset instructions have been sent if the account exists.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="bg-white border-b border-outline-variant shadow-sm">
        <nav className="flex justify-between items-center px-10 h-20 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-display font-medium text-primary">Rent On Time</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/services" className="text-base text-on-surface-variant hover:text-primary transition-colors">Services</Link>
            <Link to="/about" className="text-base text-on-surface-variant hover:text-primary transition-colors">About</Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none bg-surface-variant">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-[480px] bg-white rounded-2xl terris-card relative z-10 flex flex-col overflow-hidden">
          <div className="p-8 text-center bg-surface-variant/30">
            <div className="text-3xl font-display font-medium text-primary mb-1">Rent On Time</div>
            <p className="text-sm text-on-surface-variant">Work Order Platform</p>
          </div>

          <div className="flex border-b border-outline-variant">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
                setNotice('')
              }}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${isLogin ? 'text-primary bg-white border-b-2 border-primary' : 'text-on-surface-variant bg-surface-variant/20 hover:text-primary'}`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
                setNotice('')
              }}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${!isLogin ? 'text-primary bg-white border-b-2 border-primary' : 'text-on-surface-variant bg-surface-variant/20 hover:text-primary'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-800 border border-red-100 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            {notice && (
              <div className="bg-green-50 text-green-800 border border-green-100 px-4 py-3 rounded-xl text-sm">{notice}</div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="terris-input"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivers@example.com"
                required
                className="terris-input"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-on-surface-variant">Password</label>
                {isLogin && (
                  <button type="button" onClick={handlePasswordReset} className="text-xs text-secondary font-semibold hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="terris-input pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-outline text-primary focus:ring-primary" />
                <span>Remember Me</span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="terris-btn-primary w-full mt-2"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login to Portal' : 'Create Account'}
            </button>
          </form>

          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-on-surface-variant">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setNotice('')
                }}
                className="text-secondary text-sm font-bold hover:underline ml-1"
              >
                {isLogin ? 'Register now' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
