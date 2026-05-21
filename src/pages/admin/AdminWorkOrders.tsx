import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { databases, appwriteConfig } from '../../lib/appwrite'
import { Query } from 'appwrite'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { Search, Filter, Plus, ChevronRight, MapPin, Calendar, User } from 'lucide-react'

export default function AdminWorkOrders() {
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchWorkOrders()
  }, [statusFilter])

  async function fetchWorkOrders() {
    setLoading(true)
    try {
      const queries = [Query.orderDesc('$createdAt'), Query.limit(50)]
      if (statusFilter !== 'all') {
        queries.push(Query.equal('status', statusFilter))
      }

      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.bookingsCollectionId,
        queries
      )
      setWorkOrders(res.documents)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkOrders = workOrders.filter(wo =>
    wo.workOrderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    wo.propertyAddress?.toLowerCase().includes(search.toLowerCase()) ||
    wo.propertySuburb?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-on-surface">Manage Work Orders</h1>
          <p className="text-on-surface-variant">Review and update all property service requests.</p>
        </div>
        <div className="flex gap-2">
          <button className="terris-btn-outline flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input
            type="text"
            placeholder="Search by number, address or suburb..."
            className="terris-input pl-12"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="terris-input md:w-64"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="pending_acceptance">Pending Acceptance</option>
          <option value="accepted">Accepted</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="access_issue">Access Issue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="terris-card bg-white overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-on-surface-variant">Loading Work Orders...</div>
        ) : filteredWorkOrders.length === 0 ? (
          <div className="p-20 text-center text-on-surface-variant">No Work Orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline bg-surface-variant/30">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Work Order</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Property</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Total</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {filteredWorkOrders.map(wo => (
                  <tr key={wo.$id} className="hover:bg-surface-variant/20 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-on-surface">{wo.workOrderNumber}</div>
                      <div className="text-xs text-on-surface-variant">{wo.serviceType}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-on-surface truncate max-w-[200px]">{wo.propertyAddress}</div>
                      <div className="text-xs text-on-surface-variant">{wo.propertySuburb} {wo.propertyPostcode}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-on-surface">{wo.requestedAttendanceDate || 'Not set'}</div>
                      <div className="text-xs text-on-surface-variant">{wo.region}</div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={wo.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-bold text-on-surface">${(wo.totalPriceIncGst || 0).toFixed(2)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/dashboard/bookings/${wo.$id}`}
                        className="p-2 inline-block rounded-full hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
