import { CircleAlert as AlertCircle, MapPin } from 'lucide-react'
import type { SharedBookingState, UpdateSharedBookingState } from './types'

interface PropertyDetailsStepProps {
  state: SharedBookingState
  update: UpdateSharedBookingState
}

export function PropertyDetailsStep({ state, update }: PropertyDetailsStepProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">Street Address</label>
        <input value={state.propertyAddress} onChange={(event) => update('propertyAddress', event.target.value)} className="terris-input" placeholder="123 Example Street" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Suburb</label>
          <input value={state.propertySuburb} onChange={(event) => update('propertySuburb', event.target.value)} className="terris-input" placeholder="Ashby" />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Postcode</label>
          <input value={state.propertyPostcode} onChange={(event) => update('propertyPostcode', event.target.value)} className="terris-input" placeholder="6065" />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Property Type</label>
          <select value={state.propertyType} onChange={(event) => update('propertyType', event.target.value as SharedBookingState['propertyType'])} className="terris-input">
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="townhouse">Townhouse</option>
            <option value="commercial">Commercial</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      {state.region && (
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${state.pricingClassification === 'perth_peel' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          <MapPin size={20} />
          <div>
            <p className="text-sm font-bold">Region: {state.region}</p>
            <p className="text-xs">{state.pricingClassification === 'perth_peel' ? 'Perth and Peel rates apply.' : 'Regional or quote review may apply.'}</p>
          </div>
        </div>
      )}
      {!state.serviceAreaMatched && state.propertySuburb && state.propertyPostcode.length >= 4 && (
        <div className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-800 flex items-center gap-4">
          <AlertCircle size={20} />
          <div>
            <p className="text-sm font-bold">Outside Service Area</p>
            <p className="text-xs">A custom quote will be required for this location.</p>
          </div>
        </div>
      )}
    </>
  )
}
