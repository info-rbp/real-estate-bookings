import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { databases, appwriteConfig, functions } from '../../lib/appwrite'
import { Query } from 'appwrite'
import { ExecutionMethod } from 'appwrite'
import { FileText, Download, Check, AlertCircle, Calendar } from 'lucide-react'

export default function AdminInvoices() {
  const { profile } = useAuth()
  const [lines, setLines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInvoiceLines()
  }, [])

  async function fetchInvoiceLines() {
    setLoading(true)
    try {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.invoiceLinesCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      )
      setLines(res.documents)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateLines() {
    setGenerating(true)
    setError('')
    try {
      // For this demo/MVP, we'll trigger generation for all clients
      // In production, this would be triggered per client or in a batch.
      if (!appwriteConfig.generateInvoiceLinesFunctionId) {
        throw new Error('Invoice line generation is not configured. Contact support.')
      }
      if (!profile?.clientId) {
        throw new Error('Missing client context. Please refresh and try again.')
      }
      // TODO(security): Invoice generation must remain server-authoritative in Appwrite Functions.
      await functions.createExecution(
        appwriteConfig.generateInvoiceLinesFunctionId,
        JSON.stringify({ clientId: profile.clientId }),
        false,
        '/',
        ExecutionMethod.POST
      )
      await fetchInvoiceLines()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const exportToCSV = () => {
    if (lines.length === 0) return

    const headers = ['Work Order', 'Service Date', 'Property', 'Suburb', 'Region', 'Base Fee', 'Access Fee', 'GST', 'Total', 'Payment Cycle']
    const csvData = lines.map(line => [
      line.workOrderId,
      line.createdAt,
      line.propertyAddress,
      line.propertySuburb,
      line.region,
      line.unitPriceExGst,
      line.accessIssueFeeExGst || 0,
      line.gstAmount,
      line.totalIncGst,
      line.paymentCycleDate
    ])

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...csvData.map(row => row.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `invoices_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-on-surface">Invoice Management</h1>
          <p className="text-on-surface-variant">Generate invoice lines and export CSV for payments.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleGenerateLines}
            disabled={generating}
            className="terris-btn-primary flex items-center gap-2"
          >
            <Check size={18} />
            {generating ? 'Generating...' : 'Generate New Lines'}
          </button>
          <button
            onClick={exportToCSV}
            disabled={lines.length === 0}
            className="terris-btn-outline flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="terris-card bg-white overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-on-surface-variant">Loading invoice lines...</div>
        ) : lines.length === 0 ? (
          <div className="p-20 text-center text-on-surface-variant italic">No invoice lines generated yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline bg-surface-variant/30">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Description</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Property</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Payment Cycle</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Subtotal</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Total (Inc GST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {lines.map(line => (
                  <tr key={line.$id} className="hover:bg-surface-variant/20 transition-colors">
                    <td className="p-4">
                      <div className="text-sm font-bold text-on-surface">{line.description}</div>
                      <div className="text-xs text-on-surface-variant">{line.serviceType}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-on-surface">{line.propertyAddress}</div>
                      <div className="text-xs text-on-surface-variant">{line.region}</div>
                    </td>
                    <td className="p-4 text-sm text-on-surface">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-on-surface-variant" />
                        {new Date(line.paymentCycleDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-right text-sm font-medium text-on-surface">
                      ${line.subtotalExGst.toFixed(2)}
                    </td>
                    <td className="p-4 text-right text-sm font-bold text-primary">
                      ${line.totalIncGst.toFixed(2)}
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
