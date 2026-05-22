import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Bell, Calendar, Home, LogOut, Settings, Plus, Bolt } from 'lucide-react'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/dashboard/bookings', label: 'Work Orders', icon: Calendar },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface-container">
      {/* Sidebar Navigation */}
      <nav className="h-screen w-64 fixed left-0 top-0 bg-surface-container border-r border-outline-variant flex flex-col py-8">
        <div className="px-4 mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">BookPro</Link>
        </div>
        <div className="flex items-center gap-4 px-4 mb-8">
          <img 
            alt="Client Profile Picture" 
            className="w-12 h-12 rounded-full object-cover" 
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name}&background=random`}
          />
          <div>
            <p className="text-sm font-semibold text-on-surface">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-on-surface-variant">Premium Client</p>
          </div>
        </div>
        <div className="flex-grow space-y-1 px-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg flex items-center gap-3 px-4 py-2 transition-all duration-200 ${
                location.pathname === link.to
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <link.icon size={20} />
              <span className="text-sm font-semibold">{link.label}</span>
            </Link>
          ))}
        </div>
        <div className="px-4 mt-auto">
          <Link to="/book/service" className="bg-primary text-on-primary text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 w-full hover:opacity-90 transition-opacity">
            <Bolt size={18} />
            New Booking
          </Link>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="ml-64 p-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
