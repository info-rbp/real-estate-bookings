import { Link, useParams } from 'react-router-dom'

export default function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface-container-lowest rounded-xl soft-saas-shadow border border-outline-variant/30 p-8 space-y-4">
        <p className="text-sm text-on-surface-variant">Booking reference</p>
        <h2 className="text-3xl font-bold text-on-surface">{bookingId || 'Unknown booking'}</h2>
        <p className="text-base text-on-surface-variant">
          This page is now route-safe and ready for the Appwrite-backed booking detail implementation.
        </p>
        <div className="flex gap-4 pt-2">
          <Link to="/dashboard/bookings" className="bg-primary text-on-primary text-sm font-semibold px-5 py-3 rounded-lg">
            Back to bookings
          </Link>
          <Link to="/engage-us" className="border border-outline-variant text-on-surface text-sm font-semibold px-5 py-3 rounded-lg">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}
