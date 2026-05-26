import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { brand } from '../config/brand'

export default function PublicNav() {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { to: '/services', label: 'Services' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/engage-us', label: 'Contact / Request Access' },
  ]

  return (
    <header className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center px-6 md:px-10 h-20 w-full max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-primary">{brand.name}</Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="text-base text-on-surface-variant hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Login</Link>
              <Link to="/engage-us" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Request Access
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
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="block text-base text-on-surface-variant" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-outline-variant/50">
            {user ? (
              <Link to="/dashboard" className="block text-base text-primary font-semibold" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            ) : (
              <div className="space-y-3">
                <Link to="/login" className="block text-base text-on-surface-variant" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/engage-us" className="block text-base text-primary font-semibold" onClick={() => setMobileOpen(false)}>Request Access</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
