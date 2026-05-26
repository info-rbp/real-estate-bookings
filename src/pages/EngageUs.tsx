import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicNav from '../components/PublicNav'
import Footer from '../components/Footer'
import { Building, Mail, ShieldCheck } from 'lucide-react'
import { createLead } from '../lib/leads'

const audienceOptions = [
  'Real estate agency',
  'Property manager',
  'Private landlord',
  'Strata or facilities manager',
  'Insurance or claims contact',
  'Other',
]

const requestOptions = [
  'Client portal access',
  'Premium pricing or volume rates',
  'Subscription or recurring support',
  'One-off service enquiry',
  'Insurance claim support',
  'Maintenance attendance support',
  'General enquiry',
]

const initialForm = {
  firstName: '',
  lastName: '',
  agencyName: '',
  audienceType: '',
  requestType: '',
  email: '',
  phone: '',
  portfolioSize: '',
  message: '',
  consent: false,
}

export default function EngageUsPage() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    document.title = 'Contact ProInspect | Request Agency Access'

    const description = 'Contact ProInspect to request client portal access, discuss property field services, premium pricing, subscription support or one-off service requirements.'
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)
  }, [])

  function updateField<K extends keyof typeof initialForm>(field: K, value: (typeof initialForm)[K]) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.message.trim()) {
        throw new Error('Please complete your name, email, and message before submitting.')
      }

      if (!form.audienceType || !form.requestType) {
        throw new Error('Please select who you are and what you need help with.')
      }

      if (!form.consent) {
        throw new Error('Please confirm you have authority to provide these details and agree to the Privacy Policy.')
      }

      const enrichedMessage = [
        `Audience type: ${form.audienceType}`,
        `Request type: ${form.requestType}`,
        form.portfolioSize ? `Portfolio size: ${form.portfolioSize}` : undefined,
        '',
        form.message.trim(),
      ].filter(Boolean).join('\n')

      await createLead({
        firstName: form.firstName,
        lastName: form.lastName,
        agencyName: form.agencyName,
        email: form.email,
        phone: form.phone,
        message: enrichedMessage,
        source: 'request-access',
      })
      setForm(initialForm)
      setSuccessMessage('Thanks. Your request has been saved and the ProInspect team will follow up shortly.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save your request right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white">
      <PublicNav />
      <main className="isolate">
        <section className="bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Contact ProInspect</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">Request Agency Access or Service Support</h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              Tell us who you are, what support you need, and how ProInspect can help with property inspections, attendance, reporting, maintenance support, claims support or recurring field work.
            </p>
          </div>
        </section>

        <section className="relative px-6 py-20 lg:px-8">
          <div className="mx-auto grid max-w-lg gap-14 lg:max-w-7xl lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Send a Request</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Use this form for portal access, premium pricing, subscriptions, one-off service enquiries or custom booking requirements.
              </p>
              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                {successMessage && <div className="rounded-md bg-green-50 p-4 text-sm font-medium text-green-800">{successMessage}</div>}
                {errorMessage && <div className="rounded-md bg-red-50 p-4 text-sm font-medium text-red-800">{errorMessage}</div>}

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">First name</label>
                    <input required type="text" id="first-name" autoComplete="given-name" value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                    <input required type="text" id="last-name" autoComplete="family-name" value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div>
                  <label htmlFor="agency" className="block text-sm font-semibold leading-6 text-gray-900">Agency / organisation</label>
                  <input type="text" id="agency" autoComplete="organization" value={form.agencyName} onChange={(event) => updateField('agencyName', event.target.value)} className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="audience-type" className="block text-sm font-semibold leading-6 text-gray-900">I am a</label>
                    <select required id="audience-type" value={form.audienceType} onChange={(event) => updateField('audienceType', event.target.value)} className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6">
                      <option value="">Select one</option>
                      {audienceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="request-type" className="block text-sm font-semibold leading-6 text-gray-900">I need help with</label>
                    <select required id="request-type" value={form.requestType} onChange={(event) => updateField('requestType', event.target.value)} className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6">
                      <option value="">Select one</option>
                      {requestOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                    <input required type="email" id="email" autoComplete="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                  </div>
                  <div>
                    <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">Phone number</label>
                    <input type="tel" id="phone-number" autoComplete="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div>
                  <label htmlFor="portfolio-size" className="block text-sm font-semibold leading-6 text-gray-900">Approximate portfolio size</label>
                  <input type="text" id="portfolio-size" placeholder="Example: 80 managed properties" value={form.portfolioSize} onChange={(event) => updateField('portfolioSize', event.target.value)} className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Message</label>
                  <textarea required id="message" rows={5} value={form.message} onChange={(event) => updateField('message', event.target.value)} className="mt-2.5 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                </div>

                <label className="flex gap-3 text-sm leading-6 text-gray-600">
                  <input type="checkbox" checked={form.consent} onChange={(event) => updateField('consent', event.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span>I confirm I am authorised to provide these details and agree to ProInspect handling my information in line with the <Link to="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.</span>
                </label>

                <div className="flex justify-end">
                  <button type="submit" disabled={submitting} className="rounded-md bg-primary px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/80 disabled:opacity-60">{submitting ? 'Sending...' : 'Submit request'}</button>
                </div>
              </form>
            </div>

            <aside className="lg:pt-16">
              <div className="rounded-2xl bg-gray-50 p-8 ring-1 ring-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">How ProInspect can help</h3>
                <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
                  <div className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 flex-none text-primary" /><span>Approved client portal access for property inspection and field support bookings.</span></div>
                  <div className="flex gap-3"><Building className="mt-1 h-5 w-5 flex-none text-primary" /><span>Standard, premium, subscription and custom quote pathways for agencies and landlords.</span></div>
                  <div className="flex gap-3"><Mail className="mt-1 h-5 w-5 flex-none text-primary" /><span>Requests are triaged through the ProInspect lead workflow so the right person can follow up.</span></div>
                </div>
              </div>
              <Link to="/services" className="mt-8 block rounded-md border border-primary bg-primary/5 px-5 py-3 text-center text-sm font-semibold text-primary shadow-sm hover:bg-primary/10">View Services</Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
