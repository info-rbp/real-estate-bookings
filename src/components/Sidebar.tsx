import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LayoutDashboard, CalendarDays, Settings, LogOut, Plus } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/bookings', label: 'Work Orders', icon: CalendarDays },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const location = useLocation()

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container border-r border-outline-variant flex flex-col py-8 z-50">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold text-primary">BookPro</h1>
      </div>

      <div className="flex items-center gap-4 px-6 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-lg font-bold">
          {profile?.full_name?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface">{profile?.full_name || 'User'}</p>
          <p className="text-xs text-on-surface-variant capitalize">{profile?.role || 'Client'}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(item => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 mt-auto space-y-3">
        <Link
          to="/book/service"
          className="w-full bg-primary text-on-primary text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
            New Work Order
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
