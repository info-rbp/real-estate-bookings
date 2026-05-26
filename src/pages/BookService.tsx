import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExecutionMethod } from 'appwrite'
import { Calendar as CalendarIcon, CircleAlert as AlertCircle, CircleCheck as CheckCircle, ClipboardList, FileText, Key, MapPin, Search, Users } from 'lucide-react'
import { AccessDetailsStep } from '../components/booking/AccessDetailsStep'
import { BookingStepShell } from '../components/booking/BookingStepShell'
import { CalendarBookingStep } from '../components/booking/CalendarBookingStep'
import { ContactsStep } from '../components/booking/ContactsStep'
import { NotesStep } from '../components/booking/NotesStep'
import { OpenForInspectionBatchStep } from '../components/booking/OpenForInspectionBatchStep'
import { OpenForInspectionPropertiesStep, createEmptyOfiProperty } from '../components/booking/OpenForInspectionPropertiesStep'
import { PropertyDetailsStep } from '../components/booking/PropertyDetailsStep'
import { ReviewStep } from '../components/booking/ReviewStep'
import { ServiceSpecificDetailsStep } from '../components/booking/ServiceSpecificDetailsStep'
import type { BookingDetails, OfiProperty, SharedBookingState } from '../components/booking/types'
import { getServiceBookingConfig, isSupportedBookingServiceType, type BookingStepId } from '../config/serviceBookingConfig'
import { appwriteConfig, functions } from '../lib/appwrite'
import { calculateWorkOrderPricing } from '../lib/rateCard'
import { classifyServiceArea } from '../lib/serviceAreas'
import { listActiveServices } from '../lib/services'
import { StatusBadge } from '../components/shared/StatusBadge'
import { useAuth } from '../hooks/useAuth'
import type { Service } from '../types/database'
import type { PricingClassification, RentOnTimeServiceType } from '../types/workOrders'

const stepIcons: Partial<Record<BookingStepId | 'service', typeof ClipboardList>> = {
  service: ClipboardList,
  property: MapPin,
  access: Key,
  contacts: Users,
  calendar_booking: CalendarIcon,
  notes: FileText,
  review: CheckCircle,
  ofi_batch_details: ClipboardList,
  ofi_properties: MapPin,
  attendee_capture: Users,
}

const stepLabels: Record<BookingStepId, string> = {
  property: 'Property',
  property_condition_report_details: 'PCR Details',
  routine_inspection_details: 'Inspection Details',
  exit_inspection_details: 'Exit Details',
  access: 'Access',
  contacts: 'Contacts',
  calendar_booking: 'Calendar',
  notes: 'Notes',
  review: 'Review',
  ofi_batch_details: 'Batch',
  ofi_properties: 'Properties',
  attendee_capture: 'Attendees',
  key_collection: 'Key Collection',
  installation_details: 'Installation',
  maintenance_details: 'Maintenance',
  contractor_approval: 'Approval',
  scheduling: 'Timing',
  claim_details: 'Claim',
  claim_scope: 'Scope',
  stakeholders: 'Stakeholders',
  access_safety: 'Access',
  documents: 'Documents',
}

const initialSharedState: SharedBookingState = {
  propertyAddress: '',
  propertySuburb: '',
  propertyPostcode: '',
  propertyType: 'house',
  region: null,
  pricingClassification: 'perth_peel',
  serviceAreaMatched: false,
  accessMethod: 'lockbox',
  accessInstructions: '',
  lockboxCode: '',
  keyCollectionDetails: '',
  parkingDetails: '',
  requestedDate: '',
  requestedWindowStart: '09:00',
  requestedWindowEnd: '17:00',
  calendarEventStart: '',
  calendarEventEnd: '',
  bookerNotes: '',
  hasLegalAuthority: false,
  contacts: [{ contactType: 'property_manager', name: '', phone: '', email: '' }],
}

export default function BookService() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [state, setState] = useState<SharedBookingState>(initialSharedState)
  const [details, setDetails] = useState<BookingDetails>({ requiredSystem: 'PropertyMe', requiredTemplate: 'Standard', attendeeCaptureMethod: 'none' })
  const [ofiProperties, setOfiProperties] = useState<OfiProperty[]>([createEmptyOfiProperty()])
  const [pricing, setPricing] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmedWO, setConfirmedWO] = useState<any>(null)
  const [error, setError] = useState('')

  const config = selectedService ? getServiceBookingConfig(selectedService.id) : null
  const flowSteps = useMemo(() => (config ? (['service', ...config.steps] as Array<'service' | BookingStepId>) : (['service'] as Array<'service' | BookingStepId>)), [config])
  const activeStep = flowSteps[currentStep]
  const missingCalendarSlot = Boolean(config?.calendarRequired && (!state.calendarEventStart || !state.calendarEventEnd))
  const hasCalendarFallbackNotes = Boolean(missingCalendarSlot && state.bookerNotes.trim())

  useEffect(() => {
    listActiveServices().then(setServices).catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    if (state.propertySuburb && state.propertyPostcode.length >= 4) {
      classifyServiceArea({ suburb: state.propertySuburb, postcode: state.propertyPostcode }).then((res) => {
        setState((prev) => ({
          ...prev,
          region: res.region,
          pricingClassification: res.pricingClassification as PricingClassification,
          serviceAreaMatched: res.matched,
        }))
      })
    }
  }, [state.propertySuburb, state.propertyPostcode])

  useEffect(() => {
    if (selectedService && profile?.clientId && config) {
      calculateWorkOrderPricing({
        clientId: profile.clientId,
        serviceType: selectedService.id as RentOnTimeServiceType,
        pricingClassification: state.pricingClassification,
        urgentFlag: details.urgencyLevel === 'urgent' || details.urgencyLevel === 'emergency',
        outsideServiceArea: state.pricingClassification === 'outside_service_area',
      }).then(setPricing)
    }
  }, [selectedService, profile?.clientId, state.pricingClassification, details.urgencyLevel, config])

  function update<K extends keyof SharedBookingState>(key: K, value: SharedBookingState[K]) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  function updateDetails(key: string, value: string | boolean | number | null | undefined) {
    setDetails((prev) => ({ ...prev, [key]: value }))
  }

  function readField(field: string) {
    if (field === 'primaryContactName') return state.contacts[0]?.name
    if (field === 'primaryContactPhone') return state.contacts[0]?.phone
    if (field === 'primaryContactEmail') return state.contacts[0]?.email
    if (field in state) return state[field as keyof SharedBookingState]
    return details[field]
  }

  function validateAll() {
    if (!selectedService || !config) return ['Select a supported service.']
    const missing = config.requiredFields.filter((field) => {
      const value = readField(field)
      return typeof value === 'boolean' ? value !== true : value === undefined || value === null || String(value).trim() === ''
    })
    const errors = missing.map((field) => `${field.replace(/([A-Z])/g, ' $1')} is required.`)

    if (config.serviceType === 'open_for_inspection') {
      if (ofiProperties.length < 1) errors.push('At least 1 OFI property is required.')
      if (ofiProperties.length > config.maxProperties) errors.push('No more than 10 OFI properties can be submitted.')
      ofiProperties.forEach((property, index) => {
        if (!property.propertyAddress || !property.propertySuburb || !property.propertyPostcode || !property.accessMethod || !property.accessInstructions) {
          errors.push(`OFI property ${index + 1} needs address, suburb, postcode, access method, and access instructions.`)
        }
      })
    }

    if (missingCalendarSlot && !hasCalendarFallbackNotes) {
      errors.push('Select a calendar slot, or add timing notes so this can be submitted for scheduling review.')
    }

    return errors
  }

  function validateCurrentStep() {
    if (!config) return selectedService ? [] : ['Select a service.']
    if (activeStep === 'service') return selectedService ? [] : ['Select a service.']
    if (activeStep === 'review') return validateAll()
    const stepFields: Partial<Record<BookingStepId, string[]>> = {
      property: ['propertyAddress', 'propertySuburb', 'propertyPostcode', 'propertyType'],
      access: ['accessMethod', 'accessInstructions'],
      contacts: config.requiredFields.filter((field) => field.startsWith('primaryContact')),
      calendar_booking: [],
      ofi_batch_details: ['preferredInspectionDate', 'bookingContactName', 'bookingContactPhone', 'bookingContactEmail'],
      ofi_properties: [],
      key_collection: ['keyCollectionAddress', 'keyCollectionSuburb', 'keyCollectionPostcode', 'keyCollectionContactName', 'keyCollectionContactPhone', 'keyCollectionContactEmail', 'keyCollectionInstructions'],
      installation_details: ['deviceType', 'deviceSuppliedBy', 'installationLocation', 'photoConfirmationRequired'],
      maintenance_details: ['maintenanceCategory', 'issueDescription', 'urgencyLevel', 'tenantImpact'],
      contractor_approval: ['ownerApprovalStatus'],
      claim_details: ['claimNumber', 'insurerName', 'eventType', 'eventDate'],
      claim_scope: ['damageAreas', 'requiredPhotos', 'requiredObservations'],
      access_safety: ['accessMethod', 'accessInstructions'],
    }
    if (activeStep === 'ofi_properties') return validateAll().filter((item) => item.includes('OFI property') || item.includes('OFI properties'))
    return (stepFields[activeStep as BookingStepId] || []).filter((field) => {
      const value = readField(field)
      return typeof value === 'boolean' ? value !== true : value === undefined || value === null || String(value).trim() === ''
    }).map((field) => `${field.replace(/([A-Z])/g, ' $1')} is required.`)
  }

  const validationErrors = activeStep === 'review' ? validateAll() : []

  async function handleSubmit() {
    if (!profile || !selectedService || !pricing || !config) return
    const errors = validateAll()
    if (errors.length > 0) {
      setError(errors[0])
      return
    }
    setSubmitting(true)
    setError('')

    const isOfi = config.serviceType === 'open_for_inspection'
    const submitForReviewDueToNoCalendarSlots = Boolean(missingCalendarSlot && state.bookerNotes.trim())
    const bookingServiceDetails = {
      ...details,
      bookerNotes: state.bookerNotes,
      lockboxCode: state.lockboxCode,
      keyCollectionDetails: state.keyCollectionDetails,
      parkingDetails: state.parkingDetails,
    }

    try {
      if (!appwriteConfig.createWorkOrderFunctionId) throw new Error('Work order submission is not configured. Contact support.')
      const res = await functions.createExecution(
        appwriteConfig.createWorkOrderFunctionId,
        JSON.stringify({
          serviceId: selectedService.id,
          serviceType: selectedService.id,
          propertyAddress: isOfi ? 'Open For Inspection Batch' : state.propertyAddress,
          propertySuburb: isOfi ? ofiProperties[0]?.propertySuburb || 'Batch' : state.propertySuburb,
          propertyPostcode: isOfi ? ofiProperties[0]?.propertyPostcode || '0000' : state.propertyPostcode,
          propertyType: state.propertyType,
          region: state.region,
          pricingClassification: state.pricingClassification,
          serviceAreaMatched: state.serviceAreaMatched,
          outsideServiceArea: state.pricingClassification === 'outside_service_area',
          requestedAttendanceDate: state.requestedDate || details.preferredDate || details.preferredInspectionDate || null,
          requestedAttendanceWindowStart: state.requestedWindowStart || details.preferredWindowStart || null,
          requestedAttendanceWindowEnd: state.requestedWindowEnd || details.preferredWindowEnd || null,
          calendarEventStart: state.calendarEventStart || null,
          calendarEventEnd: state.calendarEventEnd || null,
          accessMethod: isOfi ? 'other' : state.accessMethod,
          accessInstructions: isOfi ? 'See OFI property records.' : state.accessInstructions,
          authorityConfirmedBy: profile.full_name,
          hasLegalAuthority: state.hasLegalAuthority,
          basePriceExGst: pricing.basePriceExGst,
          totalPriceExGst: pricing.totalPriceExGst,
          totalPriceIncGst: pricing.totalPriceIncGst,
          gstAmount: pricing.gstAmount,
          contacts: state.contacts,
          bookingServiceDetails,
          ofiProperties: isOfi ? ofiProperties : [],
          bookerNotes: state.bookerNotes,
          adminSchedulingRequired: config.adminSchedulingRequired,
          adminReviewRecommended: config.adminReviewRecommended || details.urgencyLevel === 'urgent' || details.urgencyLevel === 'emergency',
          calendarRequired: config.calendarRequired,
          calendarRecommended: config.calendarRecommended,
          durationMinutes: config.durationMinutes,
          submitForReviewDueToNoCalendarSlots,
        }),
        false,
        '/',
        ExecutionMethod.POST,
      )
      const execution = res as { responseStatusCode?: number; responseBody?: string }
      if ((execution.responseStatusCode ?? 500) >= 400) throw new Error('Failed to create Work Order')
      if (!execution.responseBody) throw new Error('Work order submission returned an empty response.')
      setConfirmedWO(JSON.parse(execution.responseBody))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function renderStep() {
    if (activeStep === 'service') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-4xl font-display font-medium text-on-surface mb-2">Select a Service</h1>
            <p className="text-on-surface-variant">Choose the ProInspect service you wish to request.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.filter((service) => isSupportedBookingServiceType(service.id)).map((service) => (
              <button key={service.id} type="button" onClick={() => { setSelectedService(service); setCurrentStep(0) }} className={`terris-card p-6 cursor-pointer group relative text-left ${selectedService?.id === service.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-display font-medium text-on-surface">{service.name}</h3>
                  {selectedService?.id === service.id && <CheckCircle size={20} className="text-primary" />}
                </div>
                <p className="text-sm text-on-surface-variant mb-6">{service.description}</p>
                <div className="text-sm font-bold text-primary">{service.price_type === 'quote' ? 'Quote Required' : `$${service.price} ex GST`}</div>
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (!config || !selectedService) return null
    const title = stepLabels[activeStep as BookingStepId]
    const notice = config.adminSchedulingRequired ? <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">This service is submitted for admin scheduling review. No Google Calendar slot is selected at submission.</div> : config.calendarRequired ? <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">Select a confirmed calendar slot. If no slots are available, continue and add timing notes so the request can be submitted for scheduling review.</div> : config.calendarRecommended ? <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">Calendar booking is recommended. Preferred timing notes can be submitted for review.</div> : undefined

    if (activeStep === 'property') return <BookingStepShell title={title} description="Where should we attend?" notice={notice}><PropertyDetailsStep state={state} update={update} /></BookingStepShell>
    if (activeStep === 'access' || activeStep === 'access_safety') return <BookingStepShell title={title} description="How should we access the property safely?" notice={notice}><AccessDetailsStep state={state} update={update} details={details} updateDetails={updateDetails} /></BookingStepShell>
    if (activeStep === 'contacts') return <BookingStepShell title={title} description="Who should we coordinate with?"><ContactsStep contacts={state.contacts} onChange={(contacts) => update('contacts', contacts)} /></BookingStepShell>
    if (activeStep === 'calendar_booking') return <BookingStepShell title={title} description="Choose an available appointment slot, or continue to add timing notes for review." notice={notice}><CalendarBookingStep serviceType={config.serviceType} durationMinutes={config.durationMinutes} calendarRequired={config.calendarRequired} calendarRecommended={config.calendarRecommended} state={state} update={update} /></BookingStepShell>
    if (activeStep === 'scheduling') return <BookingStepShell title={title} description="Add preferred timing for admin review." notice={notice}><PreferredScheduling details={details} updateDetails={updateDetails} /></BookingStepShell>
    if (activeStep === 'notes') return <BookingStepShell title={title} description={missingCalendarSlot ? 'No calendar slot selected. Add preferred timing notes so ProInspect can review scheduling.' : 'Add anything else the team should know.'}><NotesStep label={missingCalendarSlot ? 'Preferred timing notes / no-slot fallback details' : config.notesLabel} value={state.bookerNotes} onChange={(value) => update('bookerNotes', value)} /></BookingStepShell>
    if (activeStep === 'review') return <BookingStepShell title="Review & Submit" description="Please confirm the details below.">{missingCalendarSlot && hasCalendarFallbackNotes && <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">This request will be submitted for scheduling review because no confirmed calendar slot has been selected.</div>}<ReviewStep service={selectedService} config={config} state={state} details={details} ofiProperties={ofiProperties} errors={validationErrors} onAuthorityChange={(confirmed) => update('hasLegalAuthority', confirmed)} />{error && <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg">{error}</div>}</BookingStepShell>
    if (activeStep === 'ofi_batch_details') return <BookingStepShell title={title} description="Set batch-level OFI instructions." notice={notice}><OpenForInspectionBatchStep details={details} updateDetails={updateDetails} /></BookingStepShell>
    if (activeStep === 'ofi_properties') return <BookingStepShell title={title} description="Add each OFI property in this batch." notice={notice}><OpenForInspectionPropertiesStep properties={ofiProperties} onChange={setOfiProperties} /></BookingStepShell>

    return <BookingStepShell title={title} description="Provide the details required for this service." notice={notice}><ServiceSpecificDetailsStep stepId={activeStep as BookingStepId} details={details} updateDetails={updateDetails} /></BookingStepShell>
  }

  if (confirmedWO) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <div className="terris-card p-12 bg-white">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-green-600"><CheckCircle size={40} /></div>
          <h2 className="text-3xl font-display font-medium text-on-surface mb-3">Work Order Submitted</h2>
          <p className="text-lg text-on-surface-variant mb-2">Work Order Number: <span className="font-bold text-primary">{confirmedWO.workOrderNumber}</span></p>
          <div className="mb-8"><StatusBadge status={confirmedWO.status} /></div>
          <p className="text-on-surface-variant mb-8 max-w-md mx-auto">{confirmedWO.status === 'quote_required' ? 'An admin will review the details and provide a quote shortly.' : confirmedWO.status === 'pending_scheduling' ? 'Your request has been received for scheduling review.' : 'Your request has been received for acceptance and scheduling.'}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/dashboard/bookings')} className="terris-btn-primary">View My Work Orders</button>
            <button onClick={() => navigate('/dashboard')} className="terris-btn-outline">Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  const currentErrors = validateCurrentStep()
  const canContinue = currentErrors.length === 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-12">
        <div className="flex justify-between items-center max-w-5xl mx-auto overflow-x-auto pb-4 gap-4">
          {flowSteps.map((step, index) => {
            const Icon = stepIcons[step] || ClipboardList
            return (
              <div key={`${step}-${index}`} className={`flex flex-col items-center min-w-[86px] transition-all ${currentStep === index ? 'text-primary' : 'text-on-surface-variant opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${currentStep === index ? 'border-primary bg-primary/5' : 'border-outline'}`}><Icon size={20} /></div>
                <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{step === 'service' ? 'Service' : stepLabels[step]}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {renderStep()}
          <div className="mt-10 flex justify-between items-center">
            {currentStep > 0 ? <button onClick={() => setCurrentStep(currentStep - 1)} className="terris-btn-outline px-10">Back</button> : <div />}
            {currentStep < flowSteps.length - 1 ? (
              <button onClick={() => canContinue && setCurrentStep(currentStep + 1)} disabled={!canContinue} className="terris-btn-primary px-10 disabled:opacity-50">Next Step</button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting || validationErrors.length > 0} className="terris-btn-primary px-10 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Work Order'}</button>
            )}
          </div>
          {!canContinue && activeStep !== 'review' && <div className="mt-4 text-sm text-red-700">{currentErrors[0]}</div>}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <div className="terris-card p-6 bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
              <h3 className="text-xl font-display font-medium text-on-surface mb-6">Pricing Summary</h3>
              {pricing ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Base Service Fee</span><span className="font-bold">${pricing.basePriceExGst.toFixed(2)}</span></div>
                  <div className="pt-4 border-t border-dashed border-outline flex justify-between items-center text-on-surface-variant text-sm"><span>GST (10%)</span><span>${pricing.gstAmount.toFixed(2)}</span></div>
                  <div className="pt-2 flex justify-between items-center text-primary"><span className="text-lg font-bold">Total (Inc GST)</span><span className="text-2xl font-display font-medium">${pricing.totalPriceIncGst.toFixed(2)}</span></div>
                  {pricing.requiresQuote && <div className="mt-4 p-3 bg-amber-50 rounded-lg flex gap-2 text-xs text-amber-800 border border-amber-200"><AlertCircle size={14} className="shrink-0" /><div>{pricing.pricingNotes.map((note: string, i: number) => <p key={i}>{note}</p>)}</div></div>}
                </div>
              ) : <div className="text-sm text-on-surface-variant italic">Select a service to see pricing.</div>}
            </div>
            {config && <div className="bg-primary p-6 rounded-lg text-on-primary"><div className="flex items-center gap-3 mb-4"><Search size={24} className="text-secondary" /><h4 className="font-bold">{config.label}</h4></div><p className="text-xs opacity-80 leading-relaxed">{config.calendarRequired ? `${config.durationMinutes} minute calendar booking required, unless submitted for scheduling review with notes.` : config.adminSchedulingRequired ? 'Admin will review scheduling and route planning.' : config.calendarRecommended ? 'Calendar booking is optional and recommended.' : 'Submitted for standard review.'}</p></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

function PreferredScheduling({ details, updateDetails }: { details: BookingDetails; updateDetails: (key: string, value: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">Preferred Date</label>
        <input type="date" value={String(details.preferredDate || '')} onChange={(event) => updateDetails('preferredDate', event.target.value)} className="terris-input" />
      </div>
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">Window Start</label>
        <input type="time" value={String(details.preferredWindowStart || '')} onChange={(event) => updateDetails('preferredWindowStart', event.target.value)} className="terris-input" />
      </div>
      <div>
        <label className="block text-sm font-bold text-on-surface mb-2">Window End</label>
        <input type="time" value={String(details.preferredWindowEnd || '')} onChange={(event) => updateDetails('preferredWindowEnd', event.target.value)} className="terris-input" />
      </div>
    </div>
  )
}
