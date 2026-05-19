import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Booking } from '../types/database'
import { CalendarCheck, Clock, CheckCircle, XCircle, Bolt, Bell, CalendarDays, MoreVertical } from 'lucide-react'

const mockBookings: Booking[] = [
  {
    id: '1',
    user_id: 'mock-user-id',
    service_id: '1',
    service: { id: '1', name: 'Architectural Review', description: '...', price: 250, price_type: 'fixed', duration_minutes: 120, is_active: true, icon_name: 'architecture', category: 'Consultations', created_at: '2024-01-01T00:00:00.000Z' },
    property_address: '123 Main St',
    property_city: 'New York',
    property_postal_code: '10001',
    property_type: 'apartment',
    access_method: 'lockbox',
    access_instructions: 'Code is 1234',
    booking_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
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
    service: { id: '2', name: 'Interior Design Consultation', description: '...', price: 150, price_type: 'fixed', duration_minutes: 90, is_active: true, icon_name: 'brush', category: 'Consultations', created_at: '2024-01-01T00:00:00.000Z' },
    property_address: '456 Oak Ave',
    property_city: 'Brooklyn',
    property_postal_code: '11201',
    property_type: 'house',
    access_method: 'tenant',
    access_instructions: 'Tenant will be home.',
    booking_date: '2024-10-24',
    booking_time: '14:30',
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
    {
    id: '3',
    user_id: 'mock-user-id',
    service_id: '3',
    service: { id: '3', name: 'Site Inspection - Zone B', description: '...', price: 350, price_type: 'fixed', duration_minutes: 180, is_active: true, icon_name: 'construction', category: 'Inspections', created_at: '2024-01-01T00:00:00.000Z' },
    property_address: '789 Pine Ln',
    property_city: 'Queens',
    property_postal_code: '11354',
    property_type: 'commercial',
    access_method: 'concierge',
    access_instructions: 'Key available at front desk.',
    booking_date: '2024-10-26',
    booking_time: '09:00',
    duration_minutes: 180,
    status: 'confirmed',
    base_price: 350,
    travel_surcharge: 75,
    total_price: 425,
    notes: 'Full site access required.',
    created_at: '2024-07-29T11:00:00Z',
    updated_at: '2024-07-29T11:00:00Z',
    assigned_professional_id: null,
  },
];

export default function Dashboard() {
  const { profile } = useAuth()
  const [bookings] = useState<Booking[]>(mockBookings)
  const [stats, setStats] = useState({ upcoming: 14, pending: 6, completed: 128, cancelled: 3 })

  const upcomingBookings = bookings
    .filter(b => !['completed', 'cancelled', 'failed'].includes(b.status))
    .slice(0, 3)

  const formatBookingDate = (booking: Booking) => {
    const date = new Date(booking.booking_date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${booking.booking_time}`
    }
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${booking.booking_time}`
  }

  return (
    <div>
      {/* Header Section */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h2>
          <p className="text-base text-on-surface-variant mt-1">Here is what is happening with your projects today.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-surface-container-highest text-on-surface-variant p-3 rounded-lg hover:bg-surface-container-high transition-colors">
            <Bell size={20} />
          </button>
          <Link to="/book/service" className="bg-primary text-on-primary text-sm font-semibold px-5 py-3 rounded-lg flex items-center gap-2 soft-saas-shadow hover:opacity-90 active:scale-95">
            <Bolt size={18} />
            New Booking
          </Link>
        </div>
      </header>

      {/* Status Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: CalendarCheck, label: 'Upcoming Bookings', value: stats.upcoming, color: 'text-primary', bgColor: 'bg-primary-fixed', badge: '+12%' },
          { icon: Clock, label: 'Pending Requests', value: stats.pending, color: 'text-tertiary', bgColor: 'bg-tertiary-fixed', badge: 'Active' },
          { icon: CheckCircle, label: 'Completed', value: stats.completed, color: 'text-on-secondary-container', bgColor: 'bg-surface-container-highest', badge: 'Total' },
          { icon: XCircle, label: 'Cancelled', value: stats.cancelled, color: 'text-error', bgColor: 'bg-error-container', badge: '-2%' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/50 soft-saas-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className={`text-sm font-semibold ${stat.color}`}>{stat.badge}</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-1">{stat.label}</p>
            <h3 className="text-2xl font-semibold text-on-surface">{String(stat.value).padStart(2, '0')}</h3>
          </div>
        ))}
      </section>

      {/* Upcoming Bookings List */}
      <section>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 soft-saas-shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
            <h4 className="text-lg font-semibold text-on-surface">Upcoming Bookings</h4>
            <Link to="/dashboard/bookings" className="text-primary text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-outline-variant/50">
            {upcomingBookings.length > 0 ? upcomingBookings.map(booking => (
              <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-surface-bright transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                     <CalendarDays size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface">{booking.service?.name || 'Service'}</p>
                    <p className="text-sm text-on-surface-variant">{formatBookingDate(booking)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className={`px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
                    booking.status === 'confirmed' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                  }`}>
                     <span className={`w-2 h-2 rounded-full ${booking.status === 'confirmed' ? 'bg-primary' : 'bg-tertiary'}`}></span>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  <button className="text-outline hover:text-on-surface transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            )) : (
                 <div className="p-8 text-center text-on-surface-variant">
                    <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No upcoming bookings yet.</p>
                    <Link to="/book/service" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">Book a new service</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
