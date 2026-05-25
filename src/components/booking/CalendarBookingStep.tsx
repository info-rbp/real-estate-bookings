import { useEffect, useState } from 'react'
import { ExecutionMethod } from 'appwrite'
import { Calendar as CalendarIcon, CircleAlert as AlertCircle } from 'lucide-react'
import { appwriteConfig, functions } from '../../lib/appwrite'
import type { SharedBookingState, UpdateSharedBookingState } from './types'

interface CalendarSlot {
  start: string
  end: string
}

interface CalendarBookingStepProps {
  serviceType: string
  durationMinutes: number | null
  calendarRequired: boolean
  calendarRecommended: boolean
  state: SharedBookingState
  update: UpdateSharedBookingState
}

export function CalendarBookingStep({ serviceType, durationMinutes, calendarRequired, calendarRecommended, state, update }: CalendarBookingStepProps) {
  const [dateFrom, setDateFrom] = useState(state.requestedDate || new Date().toISOString().slice(0, 10))
  const [dateTo, setDateTo] = useState(state.requestedDate || new Date().toISOString().slice(0, 10))
  const [slots, setSlots] = useState<CalendarSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [fallback, setFallback] = useState('')

  useEffect(() => {
    if (!dateFrom || !dateTo || !durationMinutes) return
    let cancelled = false

    async function fetchSlots() {
      setLoading(true)
      setFallback('')
      try {
        if (!appwriteConfig.fetchCalendarAvailabilityFunctionId) {
          throw new Error('Calendar availability is not configured.')
        }
        const response = await functions.createExecution(
          appwriteConfig.fetchCalendarAvailabilityFunctionId,
          JSON.stringify({ dateFrom, dateTo, durationMinutes, serviceType }),
          false,
          '/',
          ExecutionMethod.POST,
        )
        const body = JSON.parse((response as { responseBody?: string }).responseBody || '{}')
        if (!cancelled) {
          setSlots(Array.isArray(body.slots) ? body.slots : [])
          if (!body.slots?.length) setFallback('No appointment slots are currently available. Please add preferred timing notes and submit for review.')
        }
      } catch {
        if (!cancelled) {
          setSlots([])
          setFallback('No appointment slots are currently available. Please add preferred timing notes and submit for review.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSlots()
    return () => {
      cancelled = true
    }
  }, [dateFrom, dateTo, durationMinutes, serviceType])

  function selectSlot(slot: CalendarSlot) {
    update('calendarEventStart', slot.start)
    update('calendarEventEnd', slot.end)
    update('requestedDate', slot.start.slice(0, 10))
    update('requestedWindowStart', slot.start.split('T')[1]?.slice(0, 5) || '')
    update('requestedWindowEnd', slot.end.split('T')[1]?.slice(0, 5) || '')
  }

  return (
    <>
      <div className="p-4 rounded-lg bg-surface-variant/50 text-sm text-on-surface-variant">
        {calendarRequired ? `This service requires a ${durationMinutes} minute calendar appointment before submission.` : calendarRecommended ? `A ${durationMinutes} minute appointment is recommended, but you can submit preferred timing notes for review.` : 'Calendar selection is not required for this service.'}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Date From</label>
          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="terris-input" />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Date To</label>
          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="terris-input" />
        </div>
      </div>
      <div className="pt-4 border-t border-outline">
        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
          <CalendarIcon size={16} className="text-primary" />
          Available Slots
        </h4>
        {loading ? (
          <div className="py-4 text-center text-sm text-on-surface-variant italic">Checking availability...</div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {slots.map((slot) => (
              <button key={`${slot.start}-${slot.end}`} type="button" onClick={() => selectSlot(slot)} className={`p-3 text-xs font-bold rounded-lg border transition-all ${state.calendarEventStart === slot.start ? 'bg-primary border-primary text-on-primary' : 'border-outline hover:border-primary text-on-surface'}`}>
                {slot.start.split('T')[1]?.slice(0, 5)} - {slot.end.split('T')[1]?.slice(0, 5)}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex gap-3">
            <AlertCircle size={18} className="shrink-0" />
            {fallback || 'No appointment slots are currently available. Please add preferred timing notes and submit for review.'}
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">Preferred Timing Notes</label>
        <textarea value={state.bookerNotes} onChange={(event) => update('bookerNotes', event.target.value)} className="terris-input min-h-[90px]" />
      </div>
    </>
  )
}
