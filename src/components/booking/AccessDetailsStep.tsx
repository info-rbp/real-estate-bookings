import type { SharedBookingState, UpdateDetails, UpdateSharedBookingState } from './types'

interface AccessDetailsStepProps {
  state: SharedBookingState
  update: UpdateSharedBookingState
  details: Record<string, unknown>
  updateDetails: UpdateDetails
  includeSafety?: boolean
}

export function AccessDetailsStep({ state, update, details, updateDetails, includeSafety = true }: AccessDetailsStepProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Access Method</label>
          <select value={state.accessMethod} onChange={(event) => update('accessMethod', event.target.value)} className="terris-input">
            <option value="lockbox">Lockbox</option>
            <option value="tenant">Tenant or occupant meet</option>
            <option value="agency">Keys at agency</option>
            <option value="concierge">Concierge or building manager</option>
            <option value="owner">Owner meet</option>
            <option value="other">Other</option>
          </select>
        </div>
        {state.accessMethod === 'lockbox' && (
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Lockbox Code</label>
            <input value={state.lockboxCode} onChange={(event) => update('lockboxCode', event.target.value)} className="terris-input" />
          </div>
        )}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-on-surface mb-2">Access Instructions</label>
          <textarea value={state.accessInstructions} onChange={(event) => update('accessInstructions', event.target.value)} className="terris-input min-h-[100px]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Parking Details</label>
          <input value={state.parkingDetails} onChange={(event) => update('parkingDetails', event.target.value)} className="terris-input" />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Key Collection Details</label>
          <input value={state.keyCollectionDetails} onChange={(event) => update('keyCollectionDetails', event.target.value)} className="terris-input" />
        </div>
      </div>
      {includeSafety && (
        <div className="pt-6 border-t border-outline grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Safety Risks</label>
            <textarea value={String(details.safetyRisks || details.knownSafetyRisks || '')} onChange={(event) => updateDetails('safetyRisks', event.target.value)} className="terris-input min-h-[90px]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Access Limitations</label>
            <textarea value={String(details.accessLimitations || '')} onChange={(event) => updateDetails('accessLimitations', event.target.value)} className="terris-input min-h-[90px]" />
          </div>
        </div>
      )}
    </>
  )
}
