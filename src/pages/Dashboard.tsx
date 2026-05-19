import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Booking } from '../types/database'
import { CalendarCheck, ClockAlert, CircleCheck as CheckCircle, Circle as XCircle, Plus, Bolt, CalendarDays, Sparkles } from 'lucide-react'

// Mock data to replace Supabase calls
const mockBookings: Booking[] = [
  {
    id: '1',
    user_id: 'mock-user-id',
    service_id: '1',
    service: { id: '1', name: 'Standard Inspection', description: '...', price: 250, price_type: 'fixed', duration_minutes: 120, is_active: true, icon_name: 'assignment', category: 'Inspections', created_at: '2024-01-01T00:00:00.000Z' },
    property_address: '123 Main St',
    property_city: 'New York',
    property_postal_code: '10001',
    property_type: 'apartment',
    access_method: 'lockbox',
    access_instructions: 'Code is 1234',
    booking_date: '2024-08-15',
    booking_time: '10:00',
    duration_minutes: 120,
    status: 'confirmed',
    base_price: 250,
    travel_surcharge: 50,
    total_price: 300,
    notes: 'Please check the HVAC system.',
    created_at: '2024-07-28T10:00:00Z',
    updated_at: '2024-07-28T10:00:00Z',
    assigned_professional_id: null,
  },
  {
    id: '2',
    user_id: 'mock-user-id',
    service_id: '2',
    service: { id: '2', name: 'Pest & Termite Inspection', description: '...', price: 150, price_type: 'fixed', duration_minutes: 90, is_active: true, icon_name: 'shield_with_house', category: 'Inspections', created_at: '2024-01-01T00:00:00.000Z' },
    property_address: '456 Oak Ave',
    property_city: 'Brooklyn',
    property_postal_code: '11201',
    property_type: 'house',
    access_method: 'tenant',
    access_instructions: 'Tenant will be home.',
    booking_date: '2024-08-20',
    booking_time: '14:00',
    duration_minutes: 90,
    status: 'pending',
    base_price: 150,
    travel_surcharge: 50,
    total_price: 200,
    notes: 'Possible termite activity in the basement.',
    created_at: '2024-07-28T10:00:00Z',
    updated_at: '2024-07-28T10:00:00Z',
    assigned_professional_id: null,
  },
];

export default function Dashboard() {
  const { profile, user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState({ upcoming: 0, pending: 0, completed: 0, cancelled: 0 })

  useEffect(() => {
    if (!profile) return;

    // Replace Supabase call with mock data
    setBookings(mockBookings);
    setStats({
      upcoming: mockBookings.filter(b => ['confirmed', 'scheduled'].includes(b.status)).length,
      pending: mockBookings.filter(b => b.status === 'pending').length,
      completed: mockBookings.filter(b => b.status === 'completed').length,
      cancelled: mockBookings.filter(b => b.status === 'cancelled').length,
    });
  }, [profile])

  const upcomingBookings = bookings.filter(b => !['completed', 'cancelled', 'failed'].includes(b.status)).slice(0, 5)

  return (
    <div>
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h2>
          <p className="text-base text-on-surface-variant mt-1">Here is what is happening with your projects today.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/book/service" className="bg-primary text-on-primary text-sm font-semibold px-5 py-3 rounded-lg flex items-center gap-2 soft-saas-shadow hover:opacity-90 transition-opacity">
            <Bolt size={18} />
            New Booking
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: CalendarCheck, label: 'Upcoming Bookings', value: stats.upcoming, color: 'bg-primary-fixed text-primary', badge: '+12%', badgeColor: 'text-primary' },
          { icon: ClockAlert, label: 'Pending Requests', value: stats.pending, color: 'bg-tertiary-fixed text-tertiary', badge: 'Active', badgeColor: 'text-tertiary' },
          { icon: CheckCircle, label: 'Completed', value: stats.completed, color: 'bg-success-light text-success', badge: 'Total', badgeColor: 'text-on-surface-variant' },
          { icon: XCircle, label: 'Cancelled', value: stats.cancelled, color: 'bg-error-container text-error', badge: '-2%', badgeColor: 'text-error' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 soft-saas-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-semibold ${stat.badgeColor}`}>{stat.badge}</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-on-surface">{String(stat.value).padStart(2, '0')}</h3>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 soft-saas-shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h4 className="text-lg font-semibold text-on-surface">Upcoming Bookings</h4>
              <Link to="/dashboard/bookings" className="text-primary text-sm font-semibold hover:underline">View All</Link>
            </div>
            {upcomingBookings.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No upcoming bookings yet.</p>
                <Link to="/book/service" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">Book a service</Link>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/20">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-surface-bright transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <CalendarDays size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{booking.service?.name || 'Service'}</p>
                        <p className="text-xs text-on-surface-variant">{new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {booking.booking_time}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-success-light text-success' :
                      booking.status === 'pending' ? 'bg-warning-light text-warning' :
                      'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 soft-saas-shadow">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-on-surface">Schedule Preview</h4>
              <p className="text-xs text-primary font-medium">Today</p>
            </div>
            <div className="text-center py-4">
              <p className="text-sm text-on-surface-variant">No events today</p>
            </div>
          </div>

          <div className="bg-primary-container p-6 rounded-xl text-on-primary-container border border-primary/20 soft-saas-shadow">
            <Sparkles size={24} className="mb-3 text-on-primary-container" />
            <h5 className="text-lg font-semibold mb-1">Pro Tip: Recurring Bookings</h5>
            <p className="text-sm mb-4 opacity-90">Schedule weekly check-ins to save up to 15% on your monthly resource allocation.</p>
            <button className="bg-on-primary-container text-primary-container text-sm font-semibold px-4 py-2 rounded-lg w-full hover:opacity-90 transition-opacity">Learn More</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
