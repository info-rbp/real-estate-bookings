import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Building, Phone, Mail } from 'lucide-react';

export default function EngageUsPage() {
    return (
        <div className="bg-white">
            <PublicNav />
            <main className="isolate">
                {/* Hero Section */}
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

                {/* Contact Form and Info */}
                <div className="relative px-6 pb-20 lg:px-8">
                    <div className="mx-auto max-w-lg lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
                        <div className="lg:col-start-1">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Book a Consultation</h2>
                            <p className="mt-4 text-lg leading-8 text-gray-600">Complete the form below, and our agency support team will be in touch to schedule a consultation and discuss a tailored solution for your business.</p>
                            <form action="#" method="POST" className="mt-10 space-y-6">
                                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">First name</label>
                                        <div className="mt-2.5">
                                            <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                                        <div className="mt-2.5">
                                            <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="agency" className="block text-sm font-semibold leading-6 text-gray-900">Agency Name</label>
                                    <div className="mt-2.5">
                                        <input type="text" name="agency" id="agency" autoComplete="organization" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                                    <div className="mt-2.5">
                                        <input type="email" name="email" id="email" autoComplete="email" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">Phone number</label>
                                    <div className="mt-2.5">
                                        <input type="tel" name="phone-number" id="phone-number" autoComplete="tel" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Message</label>
                                    <div className="mt-2.5">
                                        <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Send message</button>
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
                                            <span className="text-base text-gray-600">+1 (555) 123-4567</span>
                                        </dd>
                                        <dt><span className="sr-only">Email</span></dt>
                                        <dd className="flex gap-3">
                                            <Mail className="h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                                            <span className="text-base text-gray-600">hello@bookpro.com</span>
                                        </dd>
                                        <dt><span className="sr-only">Address</span></dt>
                                        <dd className="flex gap-3">
                                            <Building className="h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                                            <span className="text-base text-gray-600">Level 1, 123 Real Estate St, Prop-Town, 54321</span>
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
    );
}
