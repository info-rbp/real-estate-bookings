import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function PublicNav() {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center px-6 md:px-10 h-20 w-full max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-primary">BookPro</Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/services" className="text-base text-on-surface-variant hover:text-primary transition-colors">Services</Link>
          <Link to="/pricing" className="text-base text-on-surface-variant hover:text-primary transition-colors">Pricing</Link>
          <Link to="/about" className="text-base text-on-surface-variant hover:text-primary transition-colors">About</Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Login</Link>
              <Link to="/login" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            </>
          )}
        </div>
        <button className="md:hidden p-2 text-on-surface-variant" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface-container-lowest px-6 py-4 space-y-3">
          <Link to="/services" className="block text-base text-on-surface-variant" onClick={() => setMobileOpen(false)}>Services</Link>
          {user ? (
            <Link to="/dashboard" className="block text-base text-primary font-semibold" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          ) : (
            <Link to="/login" className="block text-base text-primary font-semibold" onClick={() => setMobileOpen(false)}>Login / Sign Up</Link>
          )}
        </div>
      )}
    </header>
  )
}
