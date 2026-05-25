import type { BookingDetails, UpdateDetails } from './types'

interface OpenForInspectionBatchStepProps {
  details: BookingDetails
  updateDetails: UpdateDetails
}

export function OpenForInspectionBatchStep({ details, updateDetails }: OpenForInspectionBatchStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">Preferred Inspection Date</label>
        <input type="date" value={String(details.preferredInspectionDate || '')} onChange={(event) => updateDetails('preferredInspectionDate', event.target.value)} className="terris-input" />
      </div>
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">Booking Contact Name</label>
        <input value={String(details.bookingContactName || '')} onChange={(event) => updateDetails('bookingContactName', event.target.value)} className="terris-input" />
      </div>
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">Booking Contact Phone</label>
        <input type="tel" value={String(details.bookingContactPhone || '')} onChange={(event) => updateDetails('bookingContactPhone', event.target.value)} className="terris-input" />
      </div>
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">Booking Contact Email</label>
        <input type="email" value={String(details.bookingContactEmail || '')} onChange={(event) => updateDetails('bookingContactEmail', event.target.value)} className="terris-input" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-on-surface mb-2">General Instructions</label>
        <textarea value={String(details.generalInstructions || '')} onChange={(event) => updateDetails('generalInstructions', event.target.value)} className="terris-input min-h-[100px]" />
      </div>
    </div>
  )
}
