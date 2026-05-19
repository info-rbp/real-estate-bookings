import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { Booking, BookingStatus } from '../types/database'
import StatusBadge from '../components/StatusBadge'
import { Plus, Search, Download, Eye, CalendarSync, MoveVertical as MoreVertical, CalendarCheck, ClockAlert, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react'

const statusFilters = ['All', 'Upcoming', 'Pending', 'Completed', 'Cancelled'] as const

export default function Bookings() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!profile) return
    supabase.from('bookings').select('*, service:services(*)').eq('user_id', profile.id).order('booking_date', { ascending: false })
      .then(({ data }) => { if (data) setBookings(data as unknown as Booking[]) })
  }, [profile])

  const filtered = bookings.filter(b => {
    const matchFilter = activeFilter === 'All' ||
      (activeFilter === 'Upcoming' && ['confirmed', 'scheduled'].includes(b.status)) ||
      (activeFilter === 'Pending' && b.status === 'pending') ||
      (activeFilter === 'Completed' && b.status === 'completed') ||
      (activeFilter === 'Cancelled' && b.status === 'cancelled')
    const matchSearch = b.property_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.service?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    upcoming: bookings.filter(b => ['confirmed', 'scheduled'].includes(b.status)).length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-1">My Bookings</h2>
          <p className="text-base text-on-surface-variant">Manage and track your property service requests.</p>
        </div>
        <Link to="/book/service" className="bg-primary text-on-primary text-sm font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg hover:opacity-95 transition-opacity">
          <Plus size={18} />
          New Booking
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: CalendarCheck, label: 'Upcoming', value: stats.upcoming, color: 'text-primary' },
          { icon: ClockAlert, label: 'Pending', value: stats.pending, color: 'text-tertiary' },
          { icon: CheckCircle, label: 'Completed', value: stats.completed, color: 'text-success' },
          { icon: XCircle, label: 'Cancelled', value: stats.cancelled, color: 'text-error' },
        ].map((s, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl soft-saas-shadow flex items-center gap-4 border border-outline-variant/30">
            <div className={`w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-on-surface-variant">{s.label}</p>
              <p className="text-xl font-bold text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-xl soft-saas-shadow mb-6 border border-outline-variant/30 p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {statusFilters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >{f}</button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input
            type="text"
            placeholder="Filter by address or service..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-container outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl soft-saas-shadow border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant uppercase tracking-wider text-xs">
                <th className="px-6 py-4 font-semibold border-b border-outline-variant/30">Service &amp; Property</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant/30">Date &amp; Time</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant/30">Status</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                    No bookings found. <Link to="/book/service" className="text-primary font-semibold hover:underline">Create one now</Link>
                  </td>
                </tr>
              ) : (
                filtered.map(booking => (
                  <tr key={booking.id} className={`hover:bg-surface-bright/50 transition-colors ${booking.status === 'cancelled' ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                          <CalendarSync size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{booking.service?.name || 'Service'}</p>
                          <p className="text-xs text-on-surface-variant">{booking.property_address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-on-surface">{new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-xs text-on-surface-variant">{booking.booking_time?.substring(0, 5)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={booking.status as BookingStatus} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-on-surface-variant hover:text-primary transition-colors"><Eye size={18} /></button>
                        <button className="p-1 text-on-surface-variant hover:text-primary transition-colors"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">Showing {filtered.length} of {bookings.length} bookings</p>
          </div>
        )}
      </div>
    </div>
  )
}
