interface Step {
  label: string
  completed?: boolean
}

export default function ProgressBar({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-primary">Step {currentStep} of {steps.length}</span>
        <span className="text-sm text-on-surface-variant">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
      </div>
      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-3">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i < currentStep ? 'bg-primary text-on-primary' :
              i === currentStep - 1 ? 'bg-primary text-on-primary' :
              'bg-surface-container-high text-on-surface-variant'
            }`}>
              {i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${
              i < currentStep ? 'text-primary' : 'text-on-surface-variant'
            }`}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
