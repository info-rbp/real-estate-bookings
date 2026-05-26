import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'appwrite'
import { Bell, Bolt, CalendarCheck, CalendarDays, CheckCircle, Clock, MoreVertical, XCircle } from 'lucide-react'
import { appwriteConfig, databases } from '../lib/appwrite'
import { useAuth } from '../hooks/useAuth'

function formatServiceLabel(value: string | undefined) {
  return String(value || 'service').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatBookingDate(booking: any) {
  const source = booking.scheduledStart || booking.requestedAttendanceDate
  if (!source) {
    return 'Scheduling to be confirmed'
  }

  const date = new Date(source)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}`
  }

  return date.toLocaleString('en-AU', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Dashboard() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadDashboard() {
      if (!profile?.clientId) {
        if (mounted) {
          setBookings([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId!,
          appwriteConfig.bookingsCollectionId!,
          [
            Query.equal('clientId', profile.clientId),
            Query.orderDesc('$createdAt'),
            Query.limit(100),
          ],
        )

        if (mounted) {
          setBookings(response.documents)
        }
      } catch (err: any) {
        if (mounted) {
          setError(`Failed to load dashboard data: ${err.message}`)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()
    return () => {
      mounted = false
    }
  }, [profile?.clientId])

  const stats = useMemo(() => {
    const upcoming = bookings.filter((booking) => !['completed', 'cancelled', 'failed', 'paid', 'invoiced'].includes(String(booking.status))).length
    const pending = bookings.filter((booking) => ['pending', 'submitted', 'pending_acceptance', 'pending_scheduling', 'requires_information', 'quote_required'].includes(String(booking.status))).length
    const completed = bookings.filter((booking) => String(booking.status) === 'completed').length
    const cancelled = bookings.filter((booking) => String(booking.status) === 'cancelled').length

    return { upcoming, pending, completed, cancelled }
  }, [bookings])

  const upcomingBookings = useMemo(
    () => bookings.filter((booking) => !['completed', 'cancelled', 'failed'].includes(String(booking.status))).slice(0, 3),
    [bookings],
  )

  return (
    <div>
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h2>
          <p className="text-base text-on-surface-variant mt-1">Here is what is happening with your work orders today.</p>
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

      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: CalendarCheck, label: 'Open Work Orders', value: stats.upcoming, color: 'text-primary', bgColor: 'bg-primary-fixed', badge: 'Live' },
          { icon: Clock, label: 'Pending Review', value: stats.pending, color: 'text-tertiary', bgColor: 'bg-tertiary-fixed', badge: 'Live' },
          { icon: CheckCircle, label: 'Completed', value: stats.completed, color: 'text-on-secondary-container', bgColor: 'bg-surface-container-highest', badge: 'Live' },
          { icon: XCircle, label: 'Cancelled', value: stats.cancelled, color: 'text-error', bgColor: 'bg-error-container', badge: 'Live' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/50 soft-saas-shadow">
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

      <section>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 soft-saas-shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
            <h4 className="text-lg font-semibold text-on-surface">Recent Work Orders</h4>
            <Link to="/dashboard/bookings" className="text-primary text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-outline-variant/50">
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant">Loading dashboard data...</div>
            ) : upcomingBookings.length > 0 ? upcomingBookings.map((booking) => (
              <div key={booking.$id} className="p-6 flex items-center justify-between hover:bg-surface-bright transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <CalendarDays size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface">{booking.workOrderNumber}</p>
                    <p className="text-sm text-on-surface-variant">{formatServiceLabel(booking.serviceType)} · {formatBookingDate(booking)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className={`px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${String(booking.status) === 'confirmed' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>
                    <span className={`w-2 h-2 rounded-full ${String(booking.status) === 'confirmed' ? 'bg-primary' : 'bg-tertiary'}`}></span>
                    {formatServiceLabel(booking.status)}
                  </span>
                  <button className="text-outline hover:text-on-surface transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-on-surface-variant">
                <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No work orders yet.</p>
                <Link to="/book/service" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">Book a new service</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
