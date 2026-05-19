import type { BookingStatus } from '../types/database'

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-surface-container-high text-on-surface-variant' },
  pending: { label: 'Pending', className: 'bg-warning-light text-warning' },
  confirmed: { label: 'Confirmed', className: 'bg-success-light text-success' },
  scheduled: { label: 'Scheduled', className: 'bg-primary-fixed text-primary' },
  in_progress: { label: 'In Progress', className: 'bg-primary-container text-on-primary-container' },
  completed: { label: 'Completed', className: 'bg-surface-container-high text-on-surface-variant' },
  cancelled: { label: 'Cancelled', className: 'bg-error-container text-error' },
  failed: { label: 'Failed', className: 'bg-error-container text-error' },
  invoiced: { label: 'Invoiced', className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
}

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}
