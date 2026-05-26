import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases, appwriteConfig } from '../lib/appwrite';
import { Query } from 'appwrite';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  Key,
  ShieldAlert,
  DollarSign,
  History
} from 'lucide-react';
import { StatusBadge } from '../components/shared/StatusBadge';
import { useAuth } from '../hooks/useAuth'

export default function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth()
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!bookingId) return;
      setLoading(true);
      try {
        const wo = await databases.getDocument(
          appwriteConfig.databaseId!,
          appwriteConfig.bookingsCollectionId!,
          bookingId
        );

        if (profile?.clientId && wo.clientId && wo.clientId !== profile.clientId && profile.role !== 'admin' && profile.role !== 'staff') {
          setError('You do not have permission to view this Work Order.');
          setLoading(false);
          return;
        }

        setWorkOrder(wo);

        const history = await databases.listDocuments(
          appwriteConfig.databaseId!,
          appwriteConfig.workOrderStatusHistoryCollectionId!,
          [Query.equal('workOrderId', bookingId), Query.orderDesc('$createdAt')]
        );
        setStatusHistory(history.documents);

        const woContacts = await databases.listDocuments(
          appwriteConfig.databaseId!,
          appwriteConfig.workOrderContactsCollectionId!,
          [Query.equal('workOrderId', bookingId)]
        );
        setContacts(woContacts.documents);

      } catch (err: any) {
        setError('Failed to load Work Order: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [bookingId, profile?.clientId, profile?.role]);

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-20 text-center text-on-surface-variant">Loading Work Order details...</div>;
  if (error) return <div className="max-w-7xl mx-auto px-6 py-20 text-center"><div className="p-8 bg-red-50 text-red-800 border border-red-100 rounded-2xl">{error}</div></div>;
  if (!workOrder) return <div className="max-w-7xl mx-auto px-6 py-20 text-center">Work Order not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Back to Work Orders</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="terris-card p-8 bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-display font-medium text-on-surface mb-2">{workOrder.workOrderNumber}</h1>
                <p className="text-on-surface-variant font-medium uppercase tracking-wider text-sm">{workOrder.serviceType.replace(/_/g, ' ')}</p>
              </div>
              <StatusBadge status={workOrder.status} />
            </div>
          </div>

          <div className="terris-card p-8 bg-white">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <MapPin className="text-primary" />
              <h2 className="text-2xl font-display font-medium">Property & Location</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Address</p>
                <p className="text-lg font-medium">{workOrder.propertyAddress}</p>
                <p className="text-on-surface-variant">{workOrder.propertySuburb}, {workOrder.propertyPostcode}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Region</p>
                <p className="text-lg font-medium">{workOrder.region || 'Perth and Peel'}</p>
                <p className="text-sm text-on-surface-variant capitalize">{workOrder.pricingClassification.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </div>

          <div className="terris-card p-8 bg-white">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <Users className="text-primary" />
              <h2 className="text-2xl font-display font-medium">Contacts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contacts.length > 0 ? contacts.map(contact => (
                <div key={contact.$id} className="p-4 rounded-xl bg-surface-variant/30 border border-outline-variant">
                  <p className="text-xs font-bold text-secondary uppercase mb-2">{contact.contactType.replace(/_/g, ' ')}</p>
                  <p className="font-bold text-on-surface">{contact.name}</p>
                  <p className="text-sm text-on-surface-variant">{contact.phone}</p>
                  <p className="text-sm text-on-surface-variant">{contact.email}</p>
                </div>
              )) : <p className="text-on-surface-variant italic">No contacts provided.</p>}
            </div>
          </div>

          <div className="terris-card p-8 bg-white">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <Key className="text-primary" />
              <h2 className="text-2xl font-display font-medium">Access & Safety</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Access Method</p>
                  <p className="font-medium capitalize">{workOrder.accessMethod.replace(/_/g, ' ')}</p>
                </div>
                {workOrder.lockboxCode && (
                   <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Lockbox Code</p>
                    <p className="font-mono bg-surface-variant px-2 py-1 rounded w-fit">{workOrder.lockboxCode}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Instructions</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{workOrder.accessInstructions || 'None provided.'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3">
                  <ShieldAlert className="text-red-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-red-800 uppercase mb-1">Safety & Hazards</p>
                    <p className="text-sm text-red-700">{workOrder.knownSafetyRisks || 'No known safety risks reported.'}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-variant/30 border border-outline-variant">
                   <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Legal Authority</p>
                   <p className="text-xs text-on-surface-variant">Confirmed by {workOrder.authorityConfirmedBy} at {new Date(workOrder.authorityConfirmedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="terris-card p-6 bg-white border-none shadow-lg">
             <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-secondary" />
              <h3 className="text-xl font-display font-medium">Schedule</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Requested Date</span>
                <span className="font-bold">{workOrder.requestedAttendanceDate ? new Date(workOrder.requestedAttendanceDate).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }) : 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Time Window</span>
                <span className="font-bold">{workOrder.requestedAttendanceWindowStart} - {workOrder.requestedAttendanceWindowEnd}</span>
              </div>
              {workOrder.scheduledStart && (
                 <div className="pt-4 mt-4 border-t border-outline-variant">
                   <p className="text-xs font-bold text-primary uppercase mb-2">Confirmed Attendance</p>
                   <div className="flex items-center gap-2 text-primary font-bold">
                     <Clock size={16} />
                     <span>{new Date(workOrder.scheduledStart).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
                   </div>
                 </div>
              )}
            </div>
          </div>

          <div className="terris-card p-6 bg-primary text-on-primary border-none shadow-lg">
             <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-secondary" />
              <h3 className="text-xl font-display font-medium">Financials</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm opacity-80">
                <span>Base Fee (Ex GST)</span>
                <span>${(workOrder.basePriceExGst || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm opacity-80">
                <span>GST (10%)</span>
                <span>${(workOrder.gstAmount || 0).toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-white/20 flex justify-between items-center">
                <span className="font-bold">Total (Inc GST)</span>
                <span className="text-2xl font-display font-medium text-secondary">${(workOrder.totalPriceIncGst || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="terris-card p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <History className="text-on-surface-variant" />
              <h3 className="text-xl font-display font-medium">History</h3>
            </div>
            <div className="space-y-6">
              {statusHistory.map((entry) => (
                <div key={entry.$id} className="relative pl-6 pb-6 border-l border-outline-variant last:pb-0">
                  <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-primary" />
                  <p className="text-xs font-bold text-primary uppercase mb-1">{entry.toStatus.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-on-surface-variant mb-1">{new Date(entry.$createdAt).toLocaleString()}</p>
                  <p className="text-xs text-on-surface-variant italic">{entry.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
