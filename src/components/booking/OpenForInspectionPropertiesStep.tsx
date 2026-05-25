import type { OfiProperty } from './types'

interface OpenForInspectionPropertiesStepProps {
  properties: OfiProperty[]
  onChange: (properties: OfiProperty[]) => void
}

const emptyProperty = (): OfiProperty => ({
  propertyAddress: '',
  propertySuburb: '',
  propertyPostcode: '',
  accessMethod: 'lockbox',
  accessInstructions: '',
  preferredOpenDurationMinutes: 30,
})

export function OpenForInspectionPropertiesStep({ properties, onChange }: OpenForInspectionPropertiesStepProps) {
  function updateProperty(index: number, patch: Partial<OfiProperty>) {
    const next = [...properties]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-surface-variant/50 text-sm text-on-surface-variant">
        Add 1 to 10 properties. Calendar slots are not selected here; admin will review route and timing before confirmation.
      </div>
      {properties.map((property, index) => (
        <div key={index} className="border border-outline rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Property {index + 1}</h3>
            {properties.length > 1 && <button type="button" onClick={() => onChange(properties.filter((_, i) => i !== index))} className="text-sm text-red-600">Remove</button>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-on-surface mb-2">Address</label>
              <input value={property.propertyAddress} onChange={(event) => updateProperty(index, { propertyAddress: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Suburb</label>
              <input value={property.propertySuburb} onChange={(event) => updateProperty(index, { propertySuburb: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Postcode</label>
              <input value={property.propertyPostcode} onChange={(event) => updateProperty(index, { propertyPostcode: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Listing URL</label>
              <input value={property.listingUrl || ''} onChange={(event) => updateProperty(index, { listingUrl: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Preferred Open Date</label>
              <input type="date" value={property.preferredOpenDate || ''} onChange={(event) => updateProperty(index, { preferredOpenDate: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Start Time</label>
              <input type="time" value={property.preferredOpenStartTime || ''} onChange={(event) => updateProperty(index, { preferredOpenStartTime: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Duration Minutes</label>
              <input type="number" min="1" value={property.preferredOpenDurationMinutes ?? ''} onChange={(event) => updateProperty(index, { preferredOpenDurationMinutes: event.target.value ? Number(event.target.value) : '' })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Access Method</label>
              <select value={property.accessMethod} onChange={(event) => updateProperty(index, { accessMethod: event.target.value })} className="terris-input">
                <option value="lockbox">Lockbox</option>
                <option value="tenant">Tenant or occupant meet</option>
                <option value="agency">Keys at agency</option>
                <option value="concierge">Concierge or building manager</option>
                <option value="owner">Owner meet</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Lockbox Code</label>
              <input value={property.lockboxCode || ''} onChange={(event) => updateProperty(index, { lockboxCode: event.target.value })} className="terris-input" />
            </div>
            <label className="flex items-center gap-3 mt-8">
              <input type="checkbox" checked={Boolean(property.tenantOccupied)} onChange={(event) => updateProperty(index, { tenantOccupied: event.target.checked })} className="w-5 h-5" />
              <span className="text-sm font-medium">Tenant occupied</span>
            </label>
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-on-surface mb-2">Access Instructions</label>
              <textarea value={property.accessInstructions} onChange={(event) => updateProperty(index, { accessInstructions: event.target.value })} className="terris-input min-h-[90px]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Key Collection Details</label>
              <input value={property.keyCollectionDetails || ''} onChange={(event) => updateProperty(index, { keyCollectionDetails: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Parking Details</label>
              <input value={property.parkingDetails || ''} onChange={(event) => updateProperty(index, { parkingDetails: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Tenant Contact Phone</label>
              <input value={property.tenantContactPhone || ''} onChange={(event) => updateProperty(index, { tenantContactPhone: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Tenant Contact Name</label>
              <input value={property.tenantContactName || ''} onChange={(event) => updateProperty(index, { tenantContactName: event.target.value })} className="terris-input" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-on-surface mb-2">Notes</label>
              <input value={property.notes || ''} onChange={(event) => updateProperty(index, { notes: event.target.value })} className="terris-input" />
            </div>
          </div>
        </div>
      ))}
      <button type="button" disabled={properties.length >= 10} onClick={() => onChange([...properties, emptyProperty()])} className="w-full py-4 border-2 border-dashed border-outline rounded-lg text-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-50">
        Add Property
      </button>
    </div>
  )
}

export { emptyProperty as createEmptyOfiProperty }
