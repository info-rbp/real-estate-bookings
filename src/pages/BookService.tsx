import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { Service } from '../types/database'
import ProgressBar from '../components/ProgressBar'
import { CircleCheck as CheckCircle } from 'lucide-react'

const steps = [
  { label: 'Services' },
  { label: 'Details' },
  { label: 'Schedule' },
  { label: 'Confirm' },
]

export default function BookService() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [propertyAddress, setPropertyAddress] = useState('')
  const [propertyCity, setPropertyCity] = useState('')
  const [propertyPostalCode, setPropertyPostalCode] = useState('')
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'townhouse'>('apartment')
  const [accessMethod, setAccessMethod] = useState<'lockbox' | 'tenant' | 'agency'>('lockbox')
  const [accessInstructions, setAccessInstructions] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('09:00')
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    supabase.from('services').select('*').eq('is_active', true).order('name')
      .then(({ data }) => { if (data) setServices(data as Service[]) })
  }, [])

  const travelSurcharge = 50
  const basePrice = selectedService?.price_type === 'quote' ? 0 : (selectedService?.price || 0)
  const totalPrice = basePrice + travelSurcharge

  async function handleConfirm() {
    if (!profile || !selectedService) return
    setSubmitting(true)
    const { error } = await supabase.from('bookings').insert({
      user_id: profile.id,
      service_id: selectedService.id,
      property_address: propertyAddress,
      property_city: propertyCity,
      property_postal_code: propertyPostalCode,
      property_type: propertyType,
      access_method: accessMethod,
      access_instructions: accessInstructions,
      booking_date: bookingDate,
      booking_time: bookingTime,
      duration_minutes: selectedService.duration_minutes,
      status: 'pending',
      base_price: basePrice,
      travel_surcharge: travelSurcharge,
      total_price: totalPrice,
    })
    setSubmitting(false)
    if (!error) setConfirmed(true)
  }

  if (confirmed) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="bg-surface-container-lowest rounded-2xl soft-saas-shadow border border-outline-variant/30 p-12">
          <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-success" />
          </div>
          <h2 className="text-3xl font-bold text-on-surface mb-3">Booking Confirmed!</h2>
          <p className="text-base text-on-surface-variant mb-8">Your {selectedService?.name} has been booked successfully. You will receive a confirmation email shortly.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/dashboard/bookings')} className="bg-primary text-on-primary text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              View My Bookings
            </button>
            <button onClick={() => navigate('/dashboard')} className="border border-outline-variant text-on-surface-variant text-sm font-semibold px-6 py-3 rounded-lg hover:bg-surface-container-high transition-colors">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProgressBar steps={steps} currentStep={currentStep} />

      {/* Step 1: Service Selection */}
      {currentStep === 1 && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-on-surface mb-2">Select a Service</h1>
            <p className="text-base text-on-surface-variant">Choose the inspection or management service required for your property.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {services.map(service => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`md:col-span-6 cursor-pointer bg-surface-container-lowest border rounded-xl p-6 soft-saas-shadow transition-all hover:border-primary active:scale-[0.98] ${
                  selectedService?.id === service.id ? 'border-primary bg-surface-container' : 'border-outline-variant'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-on-surface">{service.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedService?.id === service.id ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {service.price_type === 'quote' ? 'Quote Based' : service.price_type === 'hourly' ? `$${service.price}/hr` : `$${service.price}`}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">Select Service</span>
                  {selectedService?.id === service.id && <CheckCircle size={20} className="text-primary" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Property Details */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <div className="bg-surface-container-lowest soft-saas-shadow rounded-xl p-6 border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-outline-variant">
                <h2 className="text-lg font-semibold text-on-surface">Property Location</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-on-surface-variant mb-1 block">Street Address</label>
                  <input type="text" value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="123 Real Estate Ave, Suite 4B"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-bright text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-on-surface-variant mb-1 block">City</label>
                    <input type="text" value={propertyCity} onChange={e => setPropertyCity(e.target.value)} placeholder="New York"
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-bright text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-on-surface-variant mb-1 block">Postal Code</label>
                    <input type="text" value={propertyPostalCode} onChange={e => setPropertyPostalCode(e.target.value)} placeholder="10001"
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-bright text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface-variant mb-2 block">Property Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['apartment', 'house', 'townhouse'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setPropertyType(type)}
                        className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all text-sm font-medium ${
                          propertyType === type ? 'border-primary bg-surface-container-low text-primary' : 'border-outline-variant hover:bg-surface-container-lowest'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="bg-surface-container-lowest soft-saas-shadow rounded-xl p-6 border border-outline-variant/30 h-full">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-outline-variant">
                <h2 className="text-lg font-semibold text-on-surface">Access Method</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-on-surface-variant mb-2 block">How will the agent enter?</label>
                  <div className="space-y-2">
                    {[
                      { value: 'lockbox' as const, label: 'Lockbox / Key Safe', desc: 'Code required for entry' },
                      { value: 'tenant' as const, label: 'Meet Tenant / Owner', desc: 'Contact details required' },
                      { value: 'agency' as const, label: 'Collect Keys at Agency', desc: 'Pick up from office' },
                    ].map(method => (
                      <div
                        key={method.value}
                        onClick={() => setAccessMethod(method.value)}
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          accessMethod === method.value ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-surface-bright hover:border-primary'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          accessMethod === method.value ? 'border-primary' : 'border-outline-variant'
                        }`}>
                          {accessMethod === method.value && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-on-surface">{method.label}</p>
                          <p className="text-xs text-on-surface-variant">{method.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface-variant mb-1 block">Instructions &amp; Codes</label>
                  <textarea
                    value={accessInstructions}
                    onChange={e => setAccessInstructions(e.target.value)}
                    placeholder="e.g. Lockbox code is 1234. Please leave keys on the kitchen counter when finished."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-bright resize-none text-sm"
                  />
                </div>
                <div className="bg-surface-container p-4 rounded-lg flex items-start gap-3 border border-primary/10">
                  <p className="text-xs text-on-surface-variant leading-tight">These details are shared only with the assigned professional 2 hours before the booking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Scheduling */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-6 rounded-xl soft-saas-shadow border border-outline-variant">
              <h2 className="text-lg font-semibold text-on-surface mb-4">Select a Date</h2>
              <input
                type="date"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-bright text-sm"
              />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl soft-saas-shadow border border-outline-variant">
              <h3 className="text-sm font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Available Slots</h3>
              {bookingDate && <p className="text-sm text-on-surface-variant mb-4">{new Date(bookingDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>}
              <div className="grid grid-cols-2 gap-3">
                {['09:00', '10:30', '13:00', '14:30', '16:00'].map(time => (
                  <button
                    key={time}
                    onClick={() => setBookingTime(time)}
                    className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all text-center ${
                      bookingTime === time
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'border border-outline-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    {formatTime(time)}
                  </button>
                ))}
              </div>
            </div>
            {selectedService && (
              <div className="bg-primary-container p-6 rounded-xl border border-primary/20">
                <h4 className="text-sm font-semibold text-on-primary-container mb-3">Appointment Summary</h4>
                <div className="space-y-2">
                  {bookingDate && (
                    <p className="text-sm text-on-primary-container">{new Date(bookingDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  )}
                  <p className="text-sm text-on-primary-container">{formatTime(bookingTime)} - {formatTime(addHours(bookingTime, selectedService.duration_minutes / 60))} ({selectedService.duration_minutes}m)</p>
                  <p className="text-sm text-on-primary-container">{selectedService.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Review & Confirm */}
      {currentStep === 4 && selectedService && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-surface-container-lowest soft-saas-shadow rounded-xl p-6 border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-outline-variant">
                <h2 className="text-lg font-semibold text-on-surface">Service Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1">Selected Service</p>
                  <p className="text-base font-bold text-on-surface">{selectedService.name}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{selectedService.description.substring(0, 100)}...</p>
                </div>
              </div>
            </section>
            <section className="bg-surface-container-lowest soft-saas-shadow rounded-xl p-6 border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-outline-variant">
                <h2 className="text-lg font-semibold text-on-surface">Property &amp; Schedule</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Property Address</p>
                  <p className="text-base font-bold text-on-surface">{propertyAddress}</p>
                  <p className="text-sm text-on-surface-variant">{propertyCity}, {propertyPostalCode}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Scheduled Time</p>
                  {bookingDate && (
                    <p className="text-base font-bold text-on-surface">
                      {new Date(bookingDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  <p className="text-sm font-bold text-on-surface">{formatTime(bookingTime)} - {formatTime(addHours(bookingTime, selectedService.duration_minutes / 60))}</p>
                </div>
              </div>
            </section>
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <section className="bg-surface-container-lowest soft-saas-shadow rounded-xl p-6 border border-outline-variant/30 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                <h2 className="text-lg font-semibold text-on-surface mb-5">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="text-sm">Base Service Fee</span>
                    <span className="text-sm font-bold text-on-surface">${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="text-sm">Travel Surcharge</span>
                    <span className="text-sm font-bold text-on-surface">${travelSurcharge.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-dashed border-outline-variant flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Price</span>
                    <span className="text-lg font-semibold text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="w-full bg-primary text-on-primary text-sm font-bold py-3 px-4 rounded-lg hover:opacity-90 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </div>
                <p className="mt-4 text-center text-xs text-on-surface-variant italic">
                  By confirming, you agree to our <a href="#" className="text-primary underline">Terms of Service</a>.
                </p>
              </section>
              <div className="bg-surface-container-high rounded-xl p-4 flex items-start gap-3">
                <p className="text-sm font-semibold text-on-surface">Secure Booking</p>
                <p className="text-xs text-on-surface-variant">Your booking is protected by our professional service guarantee.</p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-2 px-6 py-3 border border-outline-variant text-on-surface-variant text-sm font-semibold rounded-lg hover:bg-surface-container-high transition-colors"
          >
            Back
          </button>
        ) : <div />}

        {currentStep < 4 && (
          <div className="flex gap-4">
            <button className="px-6 py-3 border border-primary text-primary text-sm font-semibold rounded-lg hover:bg-primary/5 transition-all">
              Save Draft
            </button>
            <button
              onClick={() => {
                if (currentStep === 1 && !selectedService) return
                if (currentStep === 2 && !propertyAddress) return
                if (currentStep === 3 && !bookingDate) return
                setCurrentStep(currentStep + 1)
              }}
              disabled={
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && !propertyAddress) ||
                (currentStep === 3 && !bookingDate)
              }
              className="px-8 py-3 bg-primary text-on-primary text-sm font-semibold rounded-lg shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              Next Step
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function formatTime(time: string): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function addHours(time: string, hours: number): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const newH = h + Math.floor(hours)
  return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
