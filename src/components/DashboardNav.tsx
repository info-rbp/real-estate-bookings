import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Bell, Circle as HelpCircle } from 'lucide-react'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center px-10 py-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search services or bookings..."
              className="w-full bg-surface-container-low rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <HelpCircle size={20} />
            </button>
          </div>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
        <footer className="bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center px-10 py-4">
          <p className="text-xs text-on-surface-variant">&copy; 2024 BookPro Real Estate Services. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Contact Support</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
