import { FormEvent, useState } from 'react'
import PublicNav from '../components/PublicNav'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { Building, Phone, Mail } from 'lucide-react'
import { createLead } from '../lib/leads'

const initialForm = {
  firstName: '',
  lastName: '',
  agencyName: '',
  email: '',
  phone: '',
  message: '',
}

export default function EngageUsPage() {
    const [form, setForm] = useState(initialForm)
    const [submitting, setSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    function updateField(field: keyof typeof initialForm, value: string) {
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

            await createLead({ ...form, source: 'engage-us' })
            setForm(initialForm)
            setSuccessMessage('Thanks. Your consultation request has been saved and our team will follow up shortly.')
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
                <div className="relative pt-14">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>
                    <div className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Engage Our Services</h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">Ready to reduce your workload and improve your field service capacity? Let's talk. Contact us to discuss your agency's needs or book a consultation to get started.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative px-6 pb-20 lg:px-8">
                    <div className="mx-auto max-w-lg lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
                        <div className="lg:col-start-1">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Book a Consultation</h2>
                            <p className="mt-4 text-lg leading-8 text-gray-600">Complete the form below, and our agency support team will be in touch to schedule a consultation and discuss a tailored solution for your business.</p>
                            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                                {successMessage && <div className="rounded-md bg-green-50 p-4 text-sm font-medium text-green-800">{successMessage}</div>}
                                {errorMessage && <div className="rounded-md bg-red-50 p-4 text-sm font-medium text-red-800">{errorMessage}</div>}
                                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">First name</label>
                                        <div className="mt-2.5">
                                            <input required type="text" name="first-name" id="first-name" autoComplete="given-name" value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                                        <div className="mt-2.5">
                                            <input required type="text" name="last-name" id="last-name" autoComplete="family-name" value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="agency" className="block text-sm font-semibold leading-6 text-gray-900">Agency Name</label>
                                    <div className="mt-2.5">
                                        <input type="text" name="agency" id="agency" autoComplete="organization" value={form.agencyName} onChange={(event) => updateField('agencyName', event.target.value)} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                                    <div className="mt-2.5">
                                        <input required type="email" name="email" id="email" autoComplete="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">Phone number</label>
                                    <div className="mt-2.5">
                                        <input type="tel" name="phone-number" id="phone-number" autoComplete="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Message</label>
                                    <div className="mt-2.5">
                                        <textarea required name="message" id="message" rows={4} value={form.message} onChange={(event) => updateField('message', event.target.value)} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={submitting} className="rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60">{submitting ? 'Sending...' : 'Send message'}</button>
                                </div>
                            </form>
                        </div>
                        <div className="lg:col-start-2 lg:pt-16">
                             <div className="flex flex-col h-full justify-around">
                                <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-xl font-semibold text-gray-900">Other Ways to Reach Us</h3>
                                    <p className="mt-3 text-base text-gray-600">If you prefer, you can contact us directly using the details below.</p>
                                    <dl className="mt-8 space-y-6">
                                        <dt><span className="sr-only">Phone number</span></dt>
                                        <dd className="flex gap-3">
                                            <Phone className="h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                                            <span className="text-base text-gray-600">+61 8 0000 0000</span>
                                        </dd>
                                        <dt><span className="sr-only">Email</span></dt>
                                        <dd className="flex gap-3">
                                            <Mail className="h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                                            <span className="text-base text-gray-600">hello@bookpro.com.au</span>
                                        </dd>
                                        <dt><span className="sr-only">Address</span></dt>
                                        <dd className="flex gap-3">
                                            <Building className="h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                                            <span className="text-base text-gray-600">Perth, Western Australia</span>
                                        </dd>
                                    </dl>
                                </div>
                                <div className="mt-10 lg:mt-0">
                                    <Link to="/services" className="block w-full rounded-md border border-primary bg-primary/5 px-3.5 py-2.5 text-center text-sm font-semibold text-primary shadow-sm hover:bg-primary/10">View Our Services</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
