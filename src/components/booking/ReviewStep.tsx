import type { ServiceBookingConfig } from '../../config/serviceBookingConfig'
import type { Service } from '../../types/database'
import type { BookingDetails, OfiProperty, SharedBookingState } from './types'

interface ReviewStepProps {
  service: Service
  config: ServiceBookingConfig
  state: SharedBookingState
  details: BookingDetails
  ofiProperties: OfiProperty[]
  errors: string[]
  onAuthorityChange: (confirmed: boolean) => void
}

export function ReviewStep({ service, config, state, details, ofiProperties, errors, onAuthorityChange }: ReviewStepProps) {
  const address = config.serviceType === 'open_for_inspection'
    ? `${ofiProperties.length} OFI ${ofiProperties.length === 1 ? 'property' : 'properties'}`
    : `${state.propertyAddress}, ${state.propertySuburb} ${state.propertyPostcode}`

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-bold border-b border-outline-variant pb-2 mb-4">Service & Property</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-on-surface-variant">Service:</span> {service.name}</div>
          <div><span className="text-on-surface-variant">Scheduling:</span> {config.adminSchedulingRequired ? 'Admin review' : config.calendarRequired ? 'Calendar slot required' : 'Preferred timing'}</div>
          <div><span className="text-on-surface-variant">Region:</span> {state.region || 'Pending lookup'}</div>
          <div><span className="text-on-surface-variant">Address:</span> {address}</div>
        </div>
      </section>
      {config.serviceType === 'open_for_inspection' && (
        <section>
          <h3 className="text-lg font-bold border-b border-outline-variant pb-2 mb-4">OFI Batch</h3>
          <div className="text-sm text-on-surface-variant">Admin will review the batch, route, and available appointment timing before confirmation.</div>
        </section>
      )}
      {details.urgencyLevel === 'urgent' || details.urgencyLevel === 'emergency' ? (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">Urgent maintenance requests are flagged for admin review.</div>
      ) : null}
      {details.ownerApprovalStatus && details.ownerApprovalStatus !== 'approved' && details.ownerApprovalStatus !== 'not_required' ? (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">Owner approval is not marked approved, so acceptance may be delayed.</div>
      ) : null}
      <section>
        <h3 className="text-lg font-bold border-b border-outline-variant pb-2 mb-4">Legal Confirmation</h3>
        <label className="flex items-start gap-3 p-4 bg-surface-variant/50 rounded-lg cursor-pointer hover:bg-surface-variant transition-colors">
          <input type="checkbox" checked={state.hasLegalAuthority} onChange={(event) => onAuthorityChange(event.target.checked)} className="mt-1 w-5 h-5 rounded border-outline text-primary focus:ring-primary" />
          <span className="text-sm text-on-surface leading-snug">I confirm Rent On Time has the legal right and authority to request attendance and receive access instructions for this property or batch.</span>
        </label>
      </section>
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg">
          <p className="font-bold mb-2">Please fix these items before submitting:</p>
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
