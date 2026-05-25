import PublicNav from '../components/PublicNav';
import { Check, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const includedServices = [
    { name: 'Quarterly Routine Inspections', description: 'Stay on top of property condition, tenant care, and owner expectations with regular visual inspections and reports.' },
    { name: 'Open for Inspection Attendance', description: 'Maintain leasing momentum without personally attending every viewing. Perfect for multiple vacancies or limited staff.' },
    { name: 'Maintenance & Repair Coordination', description: 'We attend properties, capture photos, and support communication between your agency, owners, and contractors.' },
    { name: 'Entry & Exit Reporting Support', description: 'Get field support during key tenancy transitions to document property condition and ensure smoother handovers.' },
];

const pricingTiers = [
    { name: 'Weekly Property Subscription', price: '$5.00 + GST', unit: 'per week per property', description: 'Charged for each property managed under the ProInspect service arrangement.' },
    { name: 'Rooming Properties', price: '$5.00 + GST', unit: 'per week per room', description: 'Where a property is leased by room, the subscription applies to each room.' },
];

const faqs = [
    { question: 'How does the subscription work?', answer: 'The subscription is charged weekly for each property in the service arrangement. It gives your agency access to the agreed inspection and field support services for that property.' },
    { question: 'What happens if a property is leased by room?', answer: 'For rooming or co-living arrangements, the subscription applies per room rather than per whole property to reflect the separate tenancies.' },
    { question: 'Is there a setup fee for existing properties?', answer: 'No. Existing managed properties can be included in the subscription without any onboarding fee.' },
    { question: 'When does the onboarding fee apply?', answer: 'The onboarding fee applies only when your agency adds a new property to the portfolio and requires our onboarding support (PCR and key safe installation).' },
    { question: 'Does ProInspect perform the actual maintenance work?', answer: 'No. We assist with coordination, site attendance, and observations. Actual maintenance work, repairs, and trade services are quoted and completed by approved contractors.' },
    { question: 'Does ProInspect replace our property managers?', answer: 'No. Your agency remains responsible for all property management decisions and communications. We act as your field support partner to help your team operate more efficiently.' },
];

export default function SubscriptionPage() {
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
                            <div className="mx-auto max-w-3xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Subscription-Based Property Inspection Support</h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">Predictable weekly pricing for your managed properties. Get consistent support for routine inspections, maintenance coordination, and more, without the variable costs.</p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link to="/pricing" className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80">Book a Consultation</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Table Section */}
                <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Predictable Weekly Pricing</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">Our property-based subscription gives you a fixed weekly cost, ensuring important services are covered across your portfolio without needing to approve every task individually.</p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                        <div className="p-8 sm:p-10 lg:flex-auto">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Property Subscription Plan</h3>
                            <p className="mt-6 text-base leading-7 text-gray-600">The weekly subscription is designed to cover the key inspection and support services agencies commonly need throughout the management lifecycle.</p>
                            <div className="mt-10 flex items-center gap-x-4">
                                <h4 className="flex-none text-sm font-semibold leading-6 text-primary">What’s included</h4>
                                <div className="h-px flex-auto bg-gray-100"></div>
                            </div>
                            <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                                {includedServices.map((service) => (
                                    <li key={service.name} className="flex gap-x-3">
                                        <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                        {service.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                                <div className="mx-auto max-w-xs px-8">
                                    {pricingTiers.map(tier => (
                                        <div key={tier.name} className="mb-6">
                                            <p className="text-base font-semibold text-gray-600">{tier.name}</p>
                                            <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price}</span>
                                                <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">{tier.unit}</span>
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-gray-500">{tier.description}</p>
                                        </div>
                                    ))}
                                    <Link to="/pricing" className="mt-6 block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/80">Get started</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Onboarding Section */}
                <div className="bg-gray-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                             <h2 className="text-base font-semibold leading-7 text-primary">A Simple Start for Every New Management</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">New Property Onboarding</p>
                            <p className="mt-6 text-lg leading-8 text-gray-600">When your agency brings on a new management, ProInspect can assist with the practical onboarding tasks required to get the property ready for your team.</p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                            <div className="p-8 sm:p-10 lg:flex-auto">
                                <p className="text-base leading-7 text-gray-600">The New Property Onboarding Fee is a once-off charge of <span className="font-bold text-gray-900">$180 + GST</span> that applies when a new property is added to the service arrangement.</p>
                                <div className="mt-10 flex items-center gap-x-4">
                                    <h4 className="flex-none text-sm font-semibold leading-6 text-primary">Onboarding includes</h4>
                                    <div className="h-px flex-auto bg-gray-100"></div>
                                </div>
                                <ul role="list" className="mt-8 space-y-4 text-sm leading-6 text-gray-600">
                                    <li className="flex gap-x-3">
                                        <PlusCircle className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                        <div><span className="font-semibold">Property Condition Report:</span> A visual inspection of the property with photos and condition notes prepared using your agreed process.</div>
                                    </li>
                                     <li className="flex gap-x-3">
                                        <PlusCircle className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                        <div><span className="font-semibold">Key Safe Installation:</span> Collection of keys, installation of a key safe or lockbox, and photo confirmation.</div>
                                    </li>
                                </ul>
                            </div>
                             <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                                <div className="rounded-2xl h-full bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://images.pexels.com/photos/5847901/pexels-photo-5847901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently Asked Questions</h2>
                            <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
                                {faqs.map((faq) => (
                                    <div key={faq.question} className="pt-8">
                                        <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="bg-gray-900" aria-labelledby="footer-heading">
                <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                    <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
                        <p className="text-xs leading-5 text-gray-400">&copy; 2024 ProInspect Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
