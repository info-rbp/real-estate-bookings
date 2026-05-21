import { useState, useEffect } from 'react'
import { databases, appwriteConfig } from '../../lib/appwrite'
import { Query } from 'appwrite'
import { Calendar, Clock, Plus, ChevronRight, CheckCircle, Search } from 'lucide-react'

export default function AdminOpenInspections() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  async function fetchPlans() {
    try {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.openInspectionPlansCollectionId,
        [Query.orderDesc('$createdAt')]
      )
      setPlans(res.documents)
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
          <h1 className="text-3xl font-display font-medium text-on-surface">OFI Planning</h1>
          <p className="text-on-surface-variant">Weekly Open for Inspection schedules and attendance.</p>
        </div>
        <button className="terris-btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create Weekly Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="terris-card bg-white p-6">
            <h3 className="text-lg font-bold mb-4">Upcoming Plans</h3>
            <div className="space-y-3">
              {plans.length === 0 ? (
                <div className="text-sm text-on-surface-variant italic">No plans found.</div>
              ) : (
                plans.map(plan => (
                  <div key={plan.$id} className="p-4 border border-outline rounded-xl hover:border-primary transition-all cursor-pointer group">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-bold text-on-surface">Week of {new Date(plan.weekCommencing).toLocaleDateString()}</div>
                        <div className="text-xs text-on-surface-variant">{plan.status}</div>
                      </div>
                      <ChevronRight size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="terris-card bg-white p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-display font-medium text-on-surface">Weekly Cutoff Reminder</h3>
                <p className="text-sm text-on-surface-variant">Plans must be finalized by Wednesday 10:00 AM Perth time.</p>
              </div>
            </div>

            <div className="p-20 text-center border-2 border-dashed border-outline rounded-2xl">
              <Calendar size={48} className="mx-auto mb-4 text-on-surface-variant opacity-20" />
              <h4 className="font-bold text-on-surface mb-2">Select a plan to view details</h4>
              <p className="text-sm text-on-surface-variant">View properties, optimize routes, and record attendance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
