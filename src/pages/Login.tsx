import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'
import Footer from '../components/Footer';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isLogin) {
      const { error } = await signIn(email, password)
      if (error) setError(error)
      else navigate('/dashboard')
    } else {
      if (!fullName.trim()) { setError('Full name is required'); setLoading(false); return }
      const { error } = await signUp(email, password, fullName)
      if (error) setError(error)
      else navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface border-b border-outline-variant shadow-sm">
        <nav className="flex justify-between items-center px-10 h-20 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-bold text-primary">BookPro</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/services" className="text-base text-on-surface-variant hover:text-primary transition-colors">Services</Link>
            <Link to="/about" className="text-base text-on-surface-variant hover:text-primary transition-colors">About</Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-16 bg-surface-container-lowest relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary-container/20 rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-[480px] bg-white rounded-xl soft-saas-shadow border border-outline-variant/30 relative z-10 flex flex-col">
          <div className="p-8 text-center">
            <div className="text-2xl font-extrabold text-primary mb-1">BookPro</div>
            <p className="text-sm text-on-surface-variant">Manage your world with ease.</p>
          </div>

          <div className="flex px-8 border-b border-outline-variant">
            <button
              onClick={() => { setIsLogin(true); setError('') }}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError('') }}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex.rivers@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-white"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-on-surface-variant">Password</label>
                {isLogin && <a href="#" className="text-xs text-primary hover:underline">Forgot Password?</a>}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-white pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                Remember Me
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login to Account' : 'Create Account'}
            </button>
          </form>

          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-on-surface-variant">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-primary text-sm font-semibold hover:underline ml-1">
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
