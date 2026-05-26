import { useEffect, useMemo, useState } from 'react'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import {
  AlertCircle,
  Calendar,
  ClipboardList,
  FileText,
  Layers,
  LayoutDashboard,
  Map,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Query } from 'appwrite'
import { useAuth } from '../hooks/useAuth'
import { appwriteConfig, databases } from '../lib/appwrite'

import AdminWorkOrders from './admin/AdminWorkOrders'
import AdminInvoices from './admin/AdminInvoices'
import AdminRegionalBatches from './admin/AdminRegionalBatches'
import AdminOpenInspections from './admin/AdminOpenInspections'
import AdminSettings from './admin/AdminSettings'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'work-orders', label: 'Work Orders', icon: ClipboardList, path: '/admin/dashboard/work-orders' },
    { id: 'invoices', label: 'Invoices', icon: FileText, path: '/admin/dashboard/invoices' },
    { id: 'regions', label: 'Regions & Batches', icon: Map, path: '/admin/dashboard/regions' },
    { id: 'inspections', label: 'OFI Planning', icon: Calendar, path: '/admin/dashboard/inspections' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/dashboard/settings' },
  ]

  const activeTab = tabs.find((tab) => location.pathname === tab.path)?.id || 'overview'

  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-on-surface-variant mb-6">You do not have permission to view the admin dashboard.</p>
        <button onClick={() => navigate('/dashboard')} className="terris-btn-primary">Return to Dashboard</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-64 shrink-0">
          <div className="terris-card bg-white p-2 sticky top-10">
            <div className="p-4 mb-4">
              <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Admin Portal</h2>
              <div className="mt-1 font-display font-medium text-lg truncate">{profile.full_name}</div>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    activeTab === tab.id
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<OverviewTab />} />
            <Route path="/work-orders" element={<AdminWorkOrders />} />
            <Route path="/invoices" element={<AdminInvoices />} />
            <Route path="/regions" element={<AdminRegionalBatches />} />
            <Route path="/inspections" element={<AdminOpenInspections />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="*" element={<div className="py-20 text-center text-on-surface-variant italic">Select an admin module from the navigation.</div>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function OverviewTab() {
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadOverview() {
      setLoading(true)
      setError('')

      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId!,
          appwriteConfig.bookingsCollectionId!,
          [Query.orderDesc('$createdAt'), Query.limit(100)],
        )

        if (mounted) {
          setWorkOrders(response.documents)
        }
      } catch (err: any) {
        if (mounted) {
          setError(`Failed to load admin overview: ${err.message}`)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadOverview()
    return () => {
      mounted = false
    }
  }, [])

  const stats = useMemo(() => {
    const pendingAcceptance = workOrders.filter((item) => ['pending', 'submitted', 'pending_acceptance', 'pending_scheduling', 'requires_information', 'quote_required'].includes(String(item.status))).length
    const scheduled = workOrders.filter((item) => ['scheduled', 'confirmed', 'accepted'].includes(String(item.status))).length
    const completed = workOrders.filter((item) => String(item.status) === 'completed').length
    const openRegional = workOrders.filter((item) => String(item.status) === 'awaiting_batch').length

    return [
      { label: 'Pending Acceptance', value: pendingAcceptance, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
      { label: 'Scheduled / Confirmed', value: scheduled, icon: Calendar, color: 'text-primary', bg: 'bg-primary/5' },
      { label: 'Completed', value: completed, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
      { label: 'Awaiting Batch', value: openRegional, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-50' },
    ]
  }, [workOrders])

  const recentActivity = useMemo(() => workOrders.slice(0, 4), [workOrders])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-display font-medium text-on-surface mb-2">Admin Overview</h1>
        <p className="text-on-surface-variant">Live snapshot of the current ProInspect operations dataset.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="terris-card bg-white p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-3 ${stat.bg} rounded-bl-3xl transition-transform group-hover:scale-110`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="text-3xl font-display font-medium text-on-surface">{loading ? '--' : stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="terris-card bg-white p-8">
          <h3 className="text-xl font-display font-medium mb-6 flex justify-between items-center">
            Recent Work Orders
            <Link to="/admin/dashboard/work-orders" className="text-xs text-primary font-bold hover:underline">View All</Link>
          </h3>
          <div className="space-y-6">
            {loading ? (
              <div className="text-sm text-on-surface-variant">Loading recent work orders...</div>
            ) : recentActivity.length > 0 ? recentActivity.map((item) => (
              <div key={item.$id} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
                  <ClipboardList size={18} className="text-on-surface-variant" />
                </div>
                <div>
                  <div className="text-sm text-on-surface leading-tight">
                    <span className="font-bold text-primary">{item.workOrderNumber}</span> is currently <span className="font-bold italic">{String(item.status).replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-xs text-on-surface-variant mt-1">{item.propertySuburb || item.propertyAddress}</div>
                </div>
              </div>
            )) : (
              <div className="text-sm text-on-surface-variant">No work orders available yet.</div>
            )}
          </div>
        </div>

        <div className="terris-card bg-white p-8">
          <h3 className="text-xl font-display font-medium mb-6 flex items-center gap-2">
            <Users size={18} className="text-on-surface-variant" />
            Operational note
          </h3>
          <div className="rounded-2xl bg-surface-variant/30 p-6 text-sm leading-7 text-on-surface-variant">
            This overview is intentionally read-only. Workflow mutations such as acceptance, scheduling, batching and invoice generation should continue to flow through the dedicated admin modules and Appwrite Functions.
          </div>
        </div>
      </div>
    </div>
  )
}
