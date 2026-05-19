import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
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

const faqs = [
    { question: 'How does the subscription plan work?', answer: 'The subscription is a weekly fee charged per property under management. It gives your agency access to a range of included inspection and field support services for that property.' },
    { question: 'Are there any lock-in contracts?', answer: 'No, our subscription plans are flexible. You can adjust the properties covered as your rent roll changes. We focus on earning your business through reliable service, not long-term contracts.' },
    { question: 'What is the New Property Onboarding fee?', answer: 'This is a once-off fee of $180 + GST for new properties added to your portfolio. It covers a comprehensive Property Condition Report and key safe installation to get the management started correctly.' },
    { question: 'Can I mix and match plans?', answer: 'Yes. You can have some properties on a subscription plan while using our Pay-Per-Booking service for other one-off tasks as needed. We tailor the solution to your agency\'s requirements.' },
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
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Simple, Flexible Pricing for Agencies</h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">Choose a plan that scales with your rent roll. From single bookings to full-portfolio subscriptions, get the field support you need, when you need it.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-12 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
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
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">Let's find the right solution for your agency. Book a no-obligation consultation to discuss your specific needs.</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a href="#" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Book a Consultation</a>
                        <Link to="/services" className="text-sm font-semibold leading-6 text-white">Learn more <span aria-hidden="true">→</span></Link>
                    </div>
                </div>
            </div>
        </div>

      </main>
      <footer className="bg-gray-900" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-gray-400">&copy; 2024 BookPro Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
