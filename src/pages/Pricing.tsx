import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Pay-Per-Booking',
    price: 'From $180',
    desc: 'For individual bookings and one-off tasks.',
    features: [
      'Property Condition Reports',
      'Exit Inspections',
      'Open for Inspection Attendance',
      'No ongoing commitment',
    ],
    cta: 'Book Now',
  },
  {
    name: 'Subscription',
    price: '$5/wk',
    period: 'per property',
    desc: 'Complete inspection support across your portfolio.',
    features: [
      'All Pay-Per-Booking services',
      'Quarterly Routine Inspections',
      'Maintenance Coordination',
      'New Property Onboarding ($180 fee)',
      'Predictable weekly cost',
    ],
    cta: 'Start a Consultation',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For large portfolios and custom requirements.',
    features: [
      'Everything in Subscription',
      'Volume pricing discounts',
      'Custom reporting integrations',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
  },
];

const individualServices = [
  { name: 'Property Condition Report', bestFor: 'Lease Starts', price: 'From $180', notes: 'Includes photos' },
  { name: 'Routine Inspection', bestFor: 'Mid-Lease', price: 'From $60', notes: 'Factual reporting' },
  { name: 'Exit Inspection', bestFor: 'Lease Ends', price: 'From $80', notes: 'Bond support' },
  { name: 'Open for Inspection', bestFor: 'Vacancies', price: 'From $60', notes: 'Per attendance' },
  { name: 'Key Safe Installation', bestFor: 'Access Control', price: '$120', notes: 'Inc. lockbox' },
  { name: 'Maintenance Support', bestFor: 'Repairs', price: 'From $60', notes: 'On-site attendance' },
  { name: 'Insurance Claim Support', bestFor: 'Claims', price: 'Quote Required', notes: 'Factual evidence' },
  { name: 'Dispute Evidence Support', bestFor: 'Disputes', price: 'Quote Required', notes: 'Factual evidence' },
  { name: 'Landlord Referral', bestFor: 'Growth', price: 'Arrangement', notes: 'Partner program' },
  { name: 'Custom Property Support', bestFor: 'Unique Tasks', price: 'Quote Required', notes: 'Tailored tasks' },
];

const faqs = [
    { question: 'Are these prices GST-inclusive?', answer: 'Unless otherwise stated, all indicative prices are GST-exclusive. Final invoices will include the applicable GST.' },
    { question: 'How does the subscription plan work?', answer: 'The subscription is a weekly fee charged per property under management. It gives your workflow access to a range of included inspection and field support services for that property.' },
    { question: 'Are there any lock-in contracts?', answer: 'No, our plans are flexible. You can adjust the properties covered as your portfolio changes. We focus on earning your business through reliable service, not long-term contracts.' },
    { question: 'What factors affect the final price?', answer: 'Final pricing may vary based on the property service area, urgency of the request, specific access requirements, and your individual client configuration.' },
]

export default function PricingPage() {
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
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl leading-tight">Simple, Flexible Pricing for Property Professionals</h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">Choose a plan that scales with your portfolio. From single bookings to full-portfolio subscriptions, get the field support you need, when you need it.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-12 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-12">
                   <h2 className="text-3xl font-bold text-gray-900">Platform Plans</h2>
                </div>
                <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3 mb-24">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ${plan.popular ? 'ring-primary' : 'ring-gray-900/10'}`}>
                            <div>
                                {plan.popular && <p className="absolute top-0 -translate-y-1/2 transform rounded-full bg-primary px-3 py-1 text-xs font-semibold tracking-wide uppercase text-white">Most Popular</p>}
                                <h3 className="text-xl font-bold leading-8 text-gray-900">{plan.name}</h3>
                                <p className="mt-1 text-sm leading-6 text-gray-600">{plan.desc}</p>
                                <div className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                                    {plan.period && <span className="text-sm font-semibold leading-6 text-gray-600">{plan.period}</span>}
                                </div>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link to="/login" className={`mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 ${plan.popular ? 'bg-primary text-white hover:bg-primary/80' : 'text-primary ring-1 ring-inset ring-primary hover:bg-primary/5'}`}>{plan.cta}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Individual Service Pricing */}
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Individual Service Pricing</h2>
                    <p className="mt-4 text-lg text-gray-600">Indicative base rates for on-demand Work Orders.</p>
                </div>
                <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-2xl">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Service</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Best For</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Indicative Price</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {individualServices.map((service) => (
                                <tr key={service.name}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{service.name}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.bestFor}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-semibold">{service.price}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-8 text-center text-xs text-gray-500">
                  * All prices are indicative and GST-exclusive. Final pricing may vary based on service area, urgency, access requirements, and reporting needs.
                </p>
            </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-gray-50 py-24 sm:py-32">
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

        {/* CTA Section */}
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative isolate overflow-hidden bg-primary px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
                    <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to Simplify Your Field Operations?</h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">Let's find the right solution for your property management workflow. Create an account to get started or enquiry to discuss your needs.</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/login" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get Started</Link>
                        <Link to="/engage-us" className="text-sm font-semibold leading-6 text-white">Enquire Now <span aria-hidden="true">→</span></Link>
                    </div>
                </div>
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
