interface NotesStepProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function NotesStep({ label, value, onChange }: NotesStepProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-on-surface mb-2">{label}</label>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="terris-input min-h-[180px]" placeholder="Add anything the Rent On Time team should know before reviewing this request." />
    </div>
  )
}
