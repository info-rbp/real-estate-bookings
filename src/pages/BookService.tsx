import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Service } from '../types/database'
import {
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
  ClipboardList,
  MapPin,
  Users,
  Key,
  FileText,
  Calendar as CalendarIcon,
  Search
} from 'lucide-react'
import { listActiveServices } from '../lib/services'
import { classifyServiceArea } from '../lib/serviceAreas'
import { calculateWorkOrderPricing } from '../lib/rateCard'
import { functions, appwriteConfig } from '../lib/appwrite'
import { ExecutionMethod } from 'appwrite'
import { StatusBadge } from '../components/shared/StatusBadge'
import type { RentOnTimeServiceType, WorkOrderContact } from '../types/workOrders'

const steps = [
  { label: 'Service', icon: ClipboardList },
  { label: 'Property', icon: MapPin },
  { label: 'Contacts', icon: Users },
  { label: 'Access', icon: Key },
  { label: 'Reporting', icon: FileText },
  { label: 'Scheduling', icon: CalendarIcon },
  { label: 'Review', icon: CheckCircle },
]

export default function BookService() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // Form State
  const [propertyAddress, setPropertyAddress] = useState('')
  const [propertySuburb, setPropertySuburb] = useState('')
  const [propertyPostcode, setPropertyPostcode] = useState('')
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'townhouse' | 'commercial' | 'other'>('house')

  const [region, setRegion] = useState<string | null>(null)
  const [pricingClassification, setPricingClassification] = useState<any>('perth_peel')
  const [serviceAreaMatched, setServiceAreaMatched] = useState(false)

  const [contacts, setContacts] = useState<WorkOrderContact[]>([])

  const [accessMethod, setAccessMethod] = useState('lockbox')
  const [accessInstructions, setAccessInstructions] = useState('')
  const [lockboxCode, setLockboxCode] = useState('')
  const [alarmDetails, setAlarmDetails] = useState('')
  const [gateAccess, setGateAccess] = useState('')
  const [parkingDetails, setParkingDetails] = useState('')
  const [keyCollectionDetails, setKeyCollectionDetails] = useState('')
  const [authorityConfirmedBy, setAuthorityConfirmedBy] = useState('')

  const [knownSafetyRisks, setKnownSafetyRisks] = useState('')
  const [animalsAtProperty, setAnimalsAtProperty] = useState(false)
  const [hazards, setHazards] = useState('')
  const [accessLimitations, setAccessLimitations] = useState('')
  const [sensitiveCircumstances, setSensitiveCircumstances] = useState('')

  const [requiredTemplate, setRequiredTemplate] = useState('Standard')
  const [requiredSystem, setRequiredSystem] = useState('PropertyMe')
  const [uploadDestination, setUploadDestination] = useState('')
  const [specificPhotosRequired, setSpecificPhotosRequired] = useState('')
  const [specificNotesRequired, setSpecificNotesRequired] = useState('')
  const [specificQuestionsRequired, setSpecificQuestionsRequired] = useState('')
  const [reportingRequirements, setReportingRequirements] = useState('')

  const [requestedDate, setRequestedDate] = useState('')
  const [timingRestrictions, setTimingRestrictions] = useState('')
  const [requestedWindowStart, setRequestedWindowStart] = useState('09:00')
  const [requestedWindowEnd, setRequestedWindowEnd] = useState('17:00')
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [fetchingSlots, setFetchingSlots] = useState(false)
  const [hasLegalAuthority, setHasLegalAuthority] = useState(false)

  const [pricing, setPricing] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmedWO, setConfirmedWO] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listActiveServices().then(setServices).catch(err => setError(err.message))
  }, [])

  useEffect(() => {
    if (propertySuburb && propertyPostcode.length >= 4) {
      classifyServiceArea({ suburb: propertySuburb, postcode: propertyPostcode }).then(res => {
        setRegion(res.region)
        setPricingClassification(res.pricingClassification)
        setServiceAreaMatched(res.matched)
      })
    }
  }, [propertySuburb, propertyPostcode])

  useEffect(() => {
    if (selectedService && profile?.clientId) {
      calculateWorkOrderPricing({
        clientId: profile.clientId,
        serviceType: selectedService.id as RentOnTimeServiceType,
        pricingClassification: pricingClassification,
        urgentFlag: isUrgent()
      }).then(setPricing)
    }
  }, [selectedService, pricingClassification, requestedDate])

  useEffect(() => {
    if (currentStep === 6 && requestedDate) {
      fetchAvailability()
    }
  }, [currentStep, requestedDate])

  async function fetchAvailability() {
    setFetchingSlots(true)
    try {
      const res = await (functions as any).createExecution(
        'fetch-calendar-availability',
        JSON.stringify({ dateFrom: requestedDate, dateTo: requestedDate }),
        false,
        '/',
        ExecutionMethod.POST
      )
      const data = JSON.parse((res as any).responseBody)
      setAvailableSlots(data.slots || [])
    } catch (err) {
      console.error('Failed to fetch availability', err)
    } finally {
      setFetchingSlots(false)
    }
  }

  function isUrgent() {
    if (!requestedDate) return false
    const date = new Date(requestedDate)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    return diff < 24 * 60 * 60 * 1000
  }

  async function handleSubmit() {
    if (!profile || !selectedService || !pricing) return
    setSubmitting(true)
    setError('')

    try {
      const res = await (functions as any).createExecution(
        'create-work-order',
        JSON.stringify({
          serviceId: selectedService.id,
          serviceType: selectedService.id,
          propertyAddress,
          propertySuburb,
          propertyPostcode,
          propertyType,
          region,
          pricingClassification,
          serviceAreaMatched,
          outsideServiceArea: pricingClassification === 'outside_service_area',
          requestedAttendanceDate: requestedDate,
          requestedAttendanceWindowStart: requestedWindowStart,
          requestedAttendanceWindowEnd: requestedWindowEnd,
          accessMethod,
          accessInstructions,
          lockboxCode,
          alarmDetails,
          gateAccess,
          parkingDetails,
          keyCollectionDetails,
          knownSafetyRisks,
          animalsAtProperty,
          authorityConfirmedBy,
          hazards,
          accessLimitations,
          sensitiveCircumstances,
          requiredTemplate,
          requiredSystem,
          uploadDestination,
          specificPhotosRequired,
          specificNotesRequired,
          specificQuestionsRequired,
          reportingRequirements,
          timingRestrictions,
          hasLegalAuthority,
          contacts,
          basePriceExGst: pricing.basePriceExGst,
          totalPriceExGst: pricing.totalPriceExGst,
          totalPriceIncGst: pricing.totalPriceIncGst,
          gstAmount: pricing.gstAmount
        }),
        false,
        '/',
        ExecutionMethod.POST
      )

      const execution = res as any
      if (execution.responseStatusCode >= 400) {
        throw new Error('Failed to create Work Order')
      }

      setConfirmedWO(JSON.parse(execution.responseBody))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmedWO) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <div className="terris-card p-12 bg-white">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-display font-medium text-on-surface mb-3">Work Order Submitted</h2>
          <p className="text-lg text-on-surface-variant mb-2">Work Order Number: <span className="font-bold text-primary">{confirmedWO.workOrderNumber}</span></p>
          <div className="mb-8">
             <StatusBadge status={confirmedWO.status} />
          </div>
          <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
            Your request has been received. {confirmedWO.status === 'quote_required' ? 'An admin will review the details and provide a quote shortly.' : 'We will confirm acceptance and schedule attendance soon.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/dashboard/bookings')} className="terris-btn-primary">
              View My Work Orders
            </button>
            <button onClick={() => navigate('/dashboard')} className="terris-btn-outline">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center max-w-4xl mx-auto overflow-x-auto pb-4 gap-4">
          {steps.map((step, i) => (
            <div key={i} className={`flex flex-col items-center min-w-[80px] transition-all ${currentStep === i + 1 ? 'text-primary' : 'text-on-surface-variant opacity-50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${currentStep === i + 1 ? 'border-primary bg-primary/5' : 'border-outline'}`}>
                <step.icon size={20} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h1 className="text-4xl font-display font-medium text-on-surface mb-2">Select a Service</h1>
                <p className="text-on-surface-variant">Choose the property service you wish to request.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`terris-card p-6 cursor-pointer group relative ${selectedService?.id === service.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-display font-medium text-on-surface">{service.name}</h3>
                      {selectedService?.id === service.id && <CheckCircle size={20} className="text-primary" />}
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6">{service.description}</p>
                    <div className="text-sm font-bold text-primary">
                      {service.price_type === 'quote' ? 'Quote Required' : `$${service.price} ex GST`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-4xl font-display font-medium text-on-surface mb-2">Property Details</h2>
                <p className="text-on-surface-variant">Where should we attend?</p>
              </div>
              <div className="terris-card p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Street Address</label>
                    <input type="text" value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="123 Example Street" className="terris-input" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Suburb</label>
                      <input type="text" value={propertySuburb} onChange={e => setPropertySuburb(e.target.value)} placeholder="Perth" className="terris-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Postcode</label>
                      <input type="text" value={propertyPostcode} onChange={e => setPropertyPostcode(e.target.value)} placeholder="6000" className="terris-input" />
                    </div>
                  </div>
                </div>

                {region && (
                  <div className={`p-4 rounded-xl border flex items-center gap-4 ${pricingClassification === 'perth_peel' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <MapPin size={20} />
                    <div>
                      <p className="text-sm font-bold">Region: {region}</p>
                      <p className="text-xs">{pricingClassification === 'perth_peel' ? 'Perth and Peel rates apply.' : 'Other Region rates apply.'}</p>
                    </div>
                  </div>
                )}
                {!serviceAreaMatched && propertySuburb && propertyPostcode.length >= 4 && (
                   <div className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-800 flex items-center gap-4">
                     <AlertCircle size={20} />
                     <div>
                       <p className="text-sm font-bold">Outside Service Area</p>
                       <p className="text-xs">A custom quote will be required for this location.</p>
                     </div>
                   </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-4xl font-display font-medium text-on-surface mb-2">Contacts</h2>
                <p className="text-on-surface-variant">Who should we coordinate with?</p>
              </div>
              <div className="space-y-6">
                {contacts.map((contact, index) => (
                  <div key={index} className="terris-card p-6 bg-white relative">
                    <button
                      onClick={() => setContacts(contacts.filter((_, i) => i !== index))}
                      className="absolute top-4 right-4 text-on-surface-variant hover:text-red-600"
                    >
                      Remove
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Type</label>
                        <select
                          value={contact.contactType}
                          onChange={e => {
                            const newContacts = [...contacts]
                            newContacts[index].contactType = e.target.value as any
                            setContacts(newContacts)
                          }}
                          className="terris-input"
                        >
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
                        <input
                          type="text"
                          value={contact.name}
                          onChange={e => {
                            const newContacts = [...contacts]
                            newContacts[index].name = e.target.value
                            setContacts(newContacts)
                          }}
                          className="terris-input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Phone</label>
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={e => {
                            const newContacts = [...contacts]
                            newContacts[index].phone = e.target.value
                            setContacts(newContacts)
                          }}
                          className="terris-input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Email</label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={e => {
                            const newContacts = [...contacts]
                            newContacts[index].email = e.target.value
                            setContacts(newContacts)
                          }}
                          className="terris-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setContacts([...contacts, { contactType: 'tenant', name: '', phone: '', email: '' }])}
                  className="w-full py-4 border-2 border-dashed border-outline rounded-2xl text-on-surface-variant hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <Users size={20} />
                  Add Contact
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-4xl font-display font-medium text-on-surface mb-2">Access & Safety</h2>
                <p className="text-on-surface-variant">How do we enter the property safely?</p>
              </div>
              <div className="terris-card p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Access Method</label>
                    <select value={accessMethod} onChange={e => setAccessMethod(e.target.value)} className="terris-input">
                      <option value="lockbox">Lockbox</option>
                      <option value="keys_office">Keys at Office</option>
                      <option value="tenant_meet">Meet Tenant</option>
                      <option value="occupant_meet">Meet Occupant</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {accessMethod === 'lockbox' && (
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Lockbox Code</label>
                      <input type="text" value={lockboxCode} onChange={e => setLockboxCode(e.target.value)} className="terris-input" />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface mb-2">Access Instructions</label>
                    <textarea value={accessInstructions} onChange={e => setAccessInstructions(e.target.value)} className="terris-input min-h-[100px]" placeholder="Specific instructions for entry..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Alarm Details</label>
                    <input type="text" value={alarmDetails} onChange={e => setAlarmDetails(e.target.value)} className="terris-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Gate Access</label>
                    <input type="text" value={gateAccess} onChange={e => setGateAccess(e.target.value)} className="terris-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Parking Details</label>
                    <input type="text" value={parkingDetails} onChange={e => setParkingDetails(e.target.value)} className="terris-input" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface mb-2">Key Collection Details</label>
                    <input type="text" value={keyCollectionDetails} onChange={e => setKeyCollectionDetails(e.target.value)} className="terris-input" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface mb-2">Authority Confirmed By</label>
                    <input type="text" value={authorityConfirmedBy} onChange={e => setAuthorityConfirmedBy(e.target.value)} className="terris-input" placeholder="Name of person providing authority..." />
                  </div>
                </div>

                <div className="pt-8 border-t border-outline">
                  <h3 className="text-lg font-bold mb-4">Safety & Hazards</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={animalsAtProperty} onChange={e => setAnimalsAtProperty(e.target.checked)} className="w-5 h-5 rounded border-outline" />
                      <span className="text-sm font-medium">Animals at property</span>
                    </label>
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Known Safety Risks / Hazards</label>
                      <textarea value={knownSafetyRisks} onChange={e => setKnownSafetyRisks(e.target.value)} className="terris-input min-h-[80px]" placeholder="Dogs, construction, uneven floors..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-4xl font-display font-medium text-on-surface mb-2">Reporting Requirements</h2>
                <p className="text-on-surface-variant">What deliverables are required?</p>
              </div>
              <div className="terris-card p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Required System</label>
                    <select value={requiredSystem} onChange={e => setRequiredSystem(e.target.value)} className="terris-input">
                      <option value="PropertyMe">PropertyMe</option>
                      <option value="Inspect Express">Inspect Express</option>
                      <option value="Email">Email</option>
                      <option value="Google Drive">Google Drive</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Required Template</label>
                    <input type="text" value={requiredTemplate} onChange={e => setRequiredTemplate(e.target.value)} className="terris-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Upload Destination</label>
                    <input type="text" value={uploadDestination} onChange={e => setUploadDestination(e.target.value)} className="terris-input" placeholder="e.g. PropertyMe Portal" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Specific Photos Required</label>
                    <input type="text" value={specificPhotosRequired} onChange={e => setSpecificPhotosRequired(e.target.value)} className="terris-input" placeholder="Front, Back, Kitchen..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Specific Notes Required</label>
                    <input type="text" value={specificNotesRequired} onChange={e => setSpecificNotesRequired(e.target.value)} className="terris-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Specific Questions Required</label>
                    <input type="text" value={specificQuestionsRequired} onChange={e => setSpecificQuestionsRequired(e.target.value)} className="terris-input" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface mb-2">Specific Reporting Requirements</label>
                    <textarea value={reportingRequirements} onChange={e => setReportingRequirements(e.target.value)} className="terris-input min-h-[120px]" placeholder="Include specific requirements..." />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface mb-2">Supporting Files</label>
                    <div className="p-8 border-2 border-dashed border-outline rounded-xl text-center text-on-surface-variant">
                      <FileText size={40} className="mx-auto mb-2 opacity-20" />
                      <p>File upload integration pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-4xl font-display font-medium text-on-surface mb-2">Scheduling</h2>
                <p className="text-on-surface-variant">When should we attend?</p>
              </div>
              <div className="terris-card p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-on-surface mb-2">Requested Date</label>
                    <input type="date" value={requestedDate} onChange={e => setRequestedDate(e.target.value)} className="terris-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Window Start</label>
                    <input type="time" value={requestedWindowStart} onChange={e => setRequestedWindowStart(e.target.value)} className="terris-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Window End</label>
                    <input type="time" value={requestedWindowEnd} onChange={e => setRequestedWindowEnd(e.target.value)} className="terris-input" />
                  </div>
                </div>

                {requestedDate && (
                  <div className="pt-6 border-t border-outline">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <CalendarIcon size={16} className="text-primary" />
                      Available Slots (Google Calendar)
                    </h4>
                    {fetchingSlots ? (
                      <div className="py-4 text-center text-sm text-on-surface-variant italic">Checking availability...</div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {availableSlots.map((slot, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const start = slot.start.split('T')[1].substring(0, 5)
                              const end = slot.end.split('T')[1].substring(0, 5)
                              setRequestedWindowStart(start)
                              setRequestedWindowEnd(end)
                            }}
                            className={`p-3 text-xs font-bold rounded-xl border transition-all ${
                              requestedWindowStart === slot.start.split('T')[1].substring(0, 5)
                                ? 'bg-primary border-primary text-on-primary'
                                : 'border-outline hover:border-primary text-on-surface'
                            }`}
                          >
                            {slot.start.split('T')[1].substring(0, 5)} - {slot.end.split('T')[1].substring(0, 5)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-surface-variant/50 rounded-xl text-center text-xs text-on-surface-variant">
                        No real-time availability found. Falling back to manual window.
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Timing Restrictions</label>
                  <textarea value={timingRestrictions} onChange={e => setTimingRestrictions(e.target.value)} className="terris-input min-h-[80px]" placeholder="Only available after 2pm..." />
                </div>

                {isUrgent() && (
                  <div className="p-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-800 flex items-center gap-4">
                    <AlertCircle size={20} />
                    <div>
                      <p className="text-sm font-bold">Urgent Request</p>
                      <p className="text-xs">Requests with less than 24 hours notice may require admin review.</p>
                    </div>
                  </div>
                )}
                {pricingClassification === 'other_region' && (
                  <div className="p-4 rounded-xl border bg-blue-50 border-blue-200 text-blue-800 flex items-center gap-4">
                    <AlertCircle size={20} />
                    <div>
                      <p className="text-sm font-bold">Regional Batching Required</p>
                      <p className="text-xs">Other region requests require batch coordination (minimum 10-15 bookings).</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-4xl font-display font-medium text-on-surface mb-2">Review & Submit</h2>
                <p className="text-on-surface-variant">Please confirm the details below.</p>
              </div>

              <div className="terris-card p-8 space-y-8">
                <section>
                  <h3 className="text-lg font-bold border-b border-outline-variant pb-2 mb-4">Service & Property</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-on-surface-variant">Service:</span> {selectedService?.name}</div>
                    <div><span className="text-on-surface-variant">Region:</span> {region || 'Unknown'}</div>
                    <div className="col-span-2"><span className="text-on-surface-variant">Address:</span> {propertyAddress}, {propertySuburb} {propertyPostcode}</div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold border-b border-outline-variant pb-2 mb-4">Legal Confirmation</h3>
                  <label className="flex items-start gap-3 p-4 bg-surface-variant/50 rounded-xl cursor-pointer hover:bg-surface-variant transition-colors">
                    <input type="checkbox" checked={hasLegalAuthority} onChange={e => setHasLegalAuthority(e.target.checked)} className="mt-1 w-5 h-5 rounded border-outline text-primary focus:ring-primary" />
                    <span className="text-sm text-on-surface leading-snug">
                      I confirm Rent On Time has the legal right and authority to request attendance and provide access instructions for this property.
                    </span>
                  </label>
                </section>

                {error && <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">{error}</div>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex justify-between items-center">
            {currentStep > 1 ? (
              <button onClick={() => setCurrentStep(currentStep - 1)} className="terris-btn-outline px-10">Back</button>
            ) : <div />}

            {currentStep < 7 ? (
              <button
                onClick={() => {
                  if (currentStep === 1 && !selectedService) return
                  if (currentStep === 2 && !propertyAddress) return
                  setCurrentStep(currentStep + 1)
                }}
                disabled={(currentStep === 1 && !selectedService) || (currentStep === 2 && !propertyAddress)}
                className="terris-btn-primary px-10 disabled:opacity-50"
              >
                Next Step
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting || !hasLegalAuthority} className="terris-btn-primary px-10 disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Work Order'}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar / Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <div className="terris-card p-6 bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
              <h3 className="text-xl font-display font-medium text-on-surface mb-6">Pricing Summary</h3>
              {pricing ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Base Service Fee</span>
                    <span className="font-bold">${pricing.basePriceExGst.toFixed(2)}</span>
                  </div>
                  {pricing.accessIssueFeeExGst > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Access Issue Fee</span>
                      <span className="font-bold">${pricing.accessIssueFeeExGst.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-dashed border-outline flex justify-between items-center text-on-surface-variant text-sm">
                    <span>GST (10%)</span>
                    <span>${pricing.gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center text-primary">
                    <span className="text-lg font-bold">Total (Inc GST)</span>
                    <span className="text-2xl font-display font-medium">${pricing.totalPriceIncGst.toFixed(2)}</span>
                  </div>
                  {pricing.requiresQuote && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg flex gap-2 text-xs text-amber-800 border border-amber-200">
                      <AlertCircle size={14} className="shrink-0" />
                      <div>
                        {pricing.pricingNotes.map((note: string, i: number) => <p key={i}>{note}</p>)}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-on-surface-variant italic">Select a service to see pricing.</div>
              )}
            </div>

            <div className="bg-primary p-6 rounded-2xl text-on-primary">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={24} className="text-secondary" />
                <h4 className="font-bold">Service Guarantee</h4>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                Rent On Time ensures all Work Orders are completed by verified professionals in compliance with state regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
