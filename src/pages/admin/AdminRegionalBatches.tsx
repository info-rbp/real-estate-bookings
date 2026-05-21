import { useState, useEffect } from 'react'
import { databases, appwriteConfig } from '../../lib/appwrite'
import { Query } from 'appwrite'
import { Layers, MapPin, Plus, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminRegionalBatches() {
  const [batches, setBatches] = useState<any[]>([])
  const [eligibleWOs, setEligibleWOs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBatches()
    fetchEligibleWOs()
  }, [])

  async function fetchBatches() {
    try {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.regionalBatchesCollectionId,
        [Query.orderDesc('$createdAt')]
      )
      setBatches(res.documents)
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchEligibleWOs() {
    try {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.bookingsCollectionId,
        [
          Query.equal('pricingClassification', 'other_region'),
          Query.equal('status', 'awaiting_batch')
        ]
      )
      setEligibleWOs(res.documents)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-on-surface">Regional Batching</h1>
          <p className="text-on-surface-variant">Coordinate work orders for regional areas.</p>
        </div>
        <button className="terris-btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create New Batch
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xl font-display font-medium text-on-surface">Active Batches</h3>
          {batches.length === 0 ? (
            <div className="terris-card bg-white p-12 text-center text-on-surface-variant italic">
              No active regional batches found.
            </div>
          ) : (
            batches.map(batch => (
              <div key={batch.$id} className="terris-card bg-white p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-on-surface">{batch.region} - {batch.routeName}</div>
                    <div className="text-sm text-on-surface-variant">
                      {batch.acceptedBookingCount} / {batch.minimumAcceptedBookings} bookings
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="flex-1 md:w-48 bg-surface-variant rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (batch.acceptedBookingCount / batch.minimumAcceptedBookings) * 100)}%` }}
                      />
                   </div>
                   <button className="p-2 rounded-full hover:bg-surface-variant transition-colors">
                     <ChevronRight size={20} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xl font-display font-medium text-on-surface">Awaiting Batch</h3>
          <div className="terris-card bg-white p-6 space-y-4">
            {eligibleWOs.length === 0 ? (
              <div className="text-sm text-on-surface-variant italic">No work orders currently awaiting batch.</div>
            ) : (
              eligibleWOs.map(wo => (
                <div key={wo.$id} className="p-4 border border-outline rounded-xl hover:border-primary transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold text-primary">{wo.workOrderNumber}</div>
                    <AlertCircle size={14} className="text-amber-500" />
                  </div>
                  <div className="text-sm font-medium text-on-surface">{wo.propertySuburb}</div>
                  <div className="text-xs text-on-surface-variant">{wo.region}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
