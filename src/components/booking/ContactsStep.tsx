import { Users } from 'lucide-react'
import type { WorkOrderContact } from '../../types/workOrders'

interface ContactsStepProps {
  contacts: WorkOrderContact[]
  onChange: (contacts: WorkOrderContact[]) => void
}

export function ContactsStep({ contacts, onChange }: ContactsStepProps) {
  function updateContact(index: number, patch: Partial<WorkOrderContact>) {
    const next = [...contacts]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-6">
      {contacts.map((contact, index) => (
        <div key={index} className="border border-outline rounded-lg p-5 relative">
          <button type="button" onClick={() => onChange(contacts.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-sm text-on-surface-variant hover:text-red-600">
            Remove
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Type</label>
              <select value={contact.contactType} onChange={(event) => updateContact(index, { contactType: event.target.value as WorkOrderContact['contactType'] })} className="terris-input">
                <option value="tenant">Tenant</option>
                <option value="occupant">Occupant</option>
                <option value="landlord">Landlord</option>
                <option value="strata">Strata</option>
                <option value="contractor">Contractor</option>
                <option value="property_manager">Property Manager</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Full Name</label>
              <input value={contact.name} onChange={(event) => updateContact(index, { name: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Phone</label>
              <input type="tel" value={contact.phone} onChange={(event) => updateContact(index, { phone: event.target.value })} className="terris-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Email</label>
              <input type="email" value={contact.email} onChange={(event) => updateContact(index, { email: event.target.value })} className="terris-input" />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...contacts, { contactType: 'tenant', name: '', phone: '', email: '' }])} className="w-full py-4 border-2 border-dashed border-outline rounded-lg text-on-surface-variant hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
        <Users size={20} />
        Add Contact
      </button>
    </div>
  )
}
