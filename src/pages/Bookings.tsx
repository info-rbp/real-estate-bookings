import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases, appwriteConfig } from '../lib/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../hooks/useAuth';
import { Calendar, Search, MoreVertical, CalendarDays, MapPin } from 'lucide-react';
import { StatusBadge } from '../components/shared/StatusBadge';

const statusFilters = ['All', 'Draft', 'Submitted', 'Pending', 'Accepted', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

export default function BookingsPage() {
  const { profile } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadWorkOrders() {
      if (!profile?.clientId) return;
      setLoading(true);
      setError('');

      try {
        const queries = [
          Query.equal('clientId', profile.clientId),
          Query.orderDesc('$createdAt'),
        ];

        const response = await databases.listDocuments(
          appwriteConfig.databaseId!,
          appwriteConfig.bookingsCollectionId!,
          queries
        );

        if (mounted) {
          setWorkOrders(response.documents);
        }
      } catch (err: any) {
        if (mounted) {
          setError('Failed to load Work Orders: ' + err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadWorkOrders();
    return () => { mounted = false; };
  }, [profile]);

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(wo => {
      const statusMatch = activeFilter === 'All' || 
        wo.status.toLowerCase().replace(/_/g, ' ') === activeFilter.toLowerCase();
      const searchMatch = wo.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wo.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wo.propertySuburb?.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [workOrders, activeFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <header className="mb-12">
        <h2 className="text-4xl font-display font-medium text-on-surface">Work Orders</h2>
        <p className="text-lg text-on-surface-variant mt-1">Manage and track your property service requests.</p>
      </header>

      <div className="bg-white p-4 rounded-2xl terris-card mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {statusFilters.map(filter => (
                <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    activeFilter === filter ? 'bg-primary text-on-primary' : 'bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant'
                }`}
                >
                {filter}
                </button>
            ))}
        </div>
        <div className="w-full md:w-auto flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search by WO#, address or suburb..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="terris-input pl-12"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-on-surface-variant">Loading Work Orders...</div>
      ) : error ? (
        <div className="p-8 bg-red-50 text-red-800 border border-red-100 rounded-2xl text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkOrders.length > 0 ? (
            filteredWorkOrders.map(wo => (
              <div key={wo.$id} className="terris-card flex flex-col overflow-hidden bg-white">
                  <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center text-primary">
                                  <Calendar size={24}/>
                              </div>
                              <div className="flex-1 min-w-0">
                                  <h3 className="font-display font-medium text-lg text-on-surface leading-tight truncate">{wo.workOrderNumber}</h3>
                                  <p className="text-sm text-on-surface-variant truncate">{wo.propertyAddress}</p>
                              </div>
                          </div>
                          <button className="text-on-surface-variant hover:text-primary transition-colors">
                              <MoreVertical size={20} />
                          </button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
                        <MapPin size={14} />
                        <span>{wo.propertySuburb}, {wo.propertyPostcode}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <div>
                              <p className="text-sm font-bold text-on-surface">{wo.requestedAttendanceDate ? new Date(wo.requestedAttendanceDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }) : 'Date TBD'}</p>
                              <p className="text-xs text-on-surface-variant">{wo.serviceType.replace(/_/g, ' ').toUpperCase()}</p>
                          </div>
                          <StatusBadge status={wo.status} />
                      </div>
                  </div>
                  <div className="bg-surface-variant/30 p-4 border-t border-outline-variant flex justify-between items-center">
                      <span className="text-sm font-bold text-primary">${(wo.totalPriceIncGst || 0).toFixed(2)}</span>
                      <Link to={`/dashboard/bookings/${wo.$id}`} className="text-secondary text-sm font-bold hover:underline">View Details</Link>
                  </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-outline-variant/50">
               <CalendarDays size={48} className="mx-auto text-on-surface-variant opacity-20 mb-4" />
              <h3 className="text-xl font-display font-medium text-on-surface">No Work Orders found</h3>
              <p className="text-on-surface-variant mt-2">Try adjusting your filters or <Link to="/book/service" className="text-secondary font-bold hover:underline">issue a new Work Order</Link>.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
