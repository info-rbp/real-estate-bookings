import type { ReactNode } from 'react'

interface BookingStepShellProps {
  title: string
  description: string
  children: ReactNode
  notice?: ReactNode
}

export function BookingStepShell({ title, description, children, notice }: BookingStepShellProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-4xl font-display font-medium text-on-surface mb-2">{title}</h2>
        <p className="text-on-surface-variant">{description}</p>
      </div>
      {notice}
      <div className="terris-card p-8 space-y-6 bg-white">{children}</div>
    </div>
  )
}
