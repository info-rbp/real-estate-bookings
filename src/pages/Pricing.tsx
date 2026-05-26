import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';
import { ArrowRight, CheckCircle, Info } from 'lucide-react';

const standardPrices = [
  ['Property Condition Report', '$200 + GST', '$120 + GST', '90 minutes', 'Calendar booking', 'Custom quote for outside-area or complex scopes'],
  ['Routine Inspection', '$60 + GST', '$40 + GST', '30 minutes', 'Calendar booking', 'Custom quote for outside-area or non-standard reporting'],
  ['Exit Inspection', '$150 + GST', '$40 + GST', '60 minutes', 'Calendar booking', 'Custom quote for complex disputes or missing PCR references'],
  ['Open For Inspection', '$80 + GST', '$40 + GST', 'Variable', 'Scheduling review', 'Batch route review for 1 to 10 properties'],
  ['Insurance Claims Management', '$90 + GST', '$50 + GST', '60 minutes default', 'Review recommended', 'Custom quote for complex claims, safety issues or expanded scope'],
  ['Maintenance Requests', '$80 + GST', '$50 + GST', '60 minutes default', 'Review recommended', 'Urgent, complex or contractor-heavy work may need review'],
  ['Key Installation', '$150 + GST', '$70 + GST', '60 minutes', 'Calendar booking', 'Custom quote if key collection or installation is non-standard'],
];

const quoteTriggers = [
  'Property is outside the Perth and Peel standard service areas.',
  'Urgent, after-hours, unsafe, incomplete or complex attendance is requested.',
  'The job requires non-standard reporting, additional properties or extended coordination.',
  'Insurance or maintenance scope is unclear, high-risk or dependent on third-party approvals.',
];

const faqs = [
  {
    question: 'Who receives premium pricing?',
    answer:
      'Premium rates apply only to approved premium clients, subscription clients or agreed volume clients. Eligibility is confirmed by ProInspect before those rates are used.',
  },
  {
    question: 'Does the subscription include unlimited work?',
    answer:
      'No. Subscription support is based on agreed inclusions and approved premium rates. Anything outside the agreed scope may be charged at premium rates or quoted separately.',
  },
  {
    question: 'How are outside-area bookings handled?',
    answer:
      'Availability and standard pricing are assessed using suburb and postcode. Outside-area requests can still be submitted, but they may be held for review or custom quote.',
  },
  {
    question: 'What is the subscription onboarding offer?',
    answer:
      'Where retained in the agreement, the $180 + GST new property onboarding bundle is a subscription onboarding offer only. Conditions apply and it must be reconciled against the required PCR, key installation and access setup scope.',
  },
];

export default function PricingPage() {
  useEffect(() => {
    document.title = 'Pricing for Property Field Services | ProInspect';

    const description =
      'View ProInspect standard pricing, premium customer pricing and subscription support for property condition reports, routine inspections, exit inspections, OFI attendance, insurance claim support, maintenance requests and key installation.';
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute('content', description);
  }, []);

  return (
    <div className="bg-white">
      <PublicNav />
      <main className="isolate">
        <section className="bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              ProInspect Pricing
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Simple Pricing for Property Field Services
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              Standard rates cover ProInspect field services across Perth and Peel. Premium prices apply only to approved premium, subscription or agreed volume clients. Outside-area, urgent or complex work may require review or custom quote.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/85"
              >
                Book a Service
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/engage-us"
                className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
              >
                Request Premium Pricing
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Standard and Premium Rates
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Current Service Pricing
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Prices are shown excluding GST. Booking confirmation, service area matching and final scope checks happen through the client portal workflow.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    <tr>
                      <th scope="col" className="px-5 py-4">Service</th>
                      <th scope="col" className="px-5 py-4">Standard</th>
                      <th scope="col" className="px-5 py-4">Premium</th>
                      <th scope="col" className="px-5 py-4">Duration</th>
                      <th scope="col" className="px-5 py-4">Scheduling</th>
                      <th scope="col" className="px-5 py-4">Review trigger</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {standardPrices.map(([service, standard, premium, duration, scheduling, trigger]) => (
                      <tr key={service} className="align-top">
                        <th scope="row" className="px-5 py-4 font-semibold text-gray-900">{service}</th>
                        <td className="px-5 py-4 text-gray-700">{standard}</td>
                        <td className="px-5 py-4 text-gray-700">{premium}</td>
                        <td className="px-5 py-4 text-gray-700">{duration}</td>
                        <td className="px-5 py-4 text-gray-700">{scheduling}</td>
                        <td className="px-5 py-4 text-gray-600">{trigger}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-primary/5 p-6 text-sm leading-6 text-gray-700 ring-1 ring-primary/15">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                <p>
                  Premium pricing is not a public discount code. It is applied only where an approved client agreement, subscription arrangement or volume pricing arrangement exists.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="subscription" className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Subscription and Recurring Support
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Subscription Support for Approved Portfolios
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Subscription arrangements are designed for agencies or landlords who need recurring property field support across an agreed portfolio, using agreed inclusions and approved premium rates.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Indicative subscription model</h3>
                <ul className="mt-6 space-y-4 text-sm leading-6 text-gray-700">
                  <li className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 flex-none text-primary" />$5.00 + GST per week per approved property or room where agreed.</li>
                  <li className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 flex-none text-primary" />Agreed inclusions are set in the client arrangement rather than implied as unlimited work.</li>
                  <li className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 flex-none text-primary" />Approved premium rates apply for eligible services outside included support.</li>
                  <li className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 flex-none text-primary" />A $180 + GST new property onboarding bundle may apply only where retained as a subscription onboarding offer. Conditions apply.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Custom Quote Triggers</h2>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  ProInspect may hold a booking for review or quote when the request falls outside standard operating assumptions.
                </p>
                <ul className="mt-6 space-y-4 text-sm leading-6 text-gray-700">
                  {quoteTriggers.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Pricing FAQs</h2>
                <dl className="mt-6 space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.question}>
                      <dt className="font-semibold text-gray-900">{faq.question}</dt>
                      <dd className="mt-2 text-sm leading-6 text-gray-600">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gray-950 px-6 py-16 text-center shadow-2xl sm:px-16">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Book Property Field Support?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-200">
                Use the client portal for standard bookings, or contact ProInspect to discuss premium pricing, subscription support or custom quote requirements.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/login" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/85">
                  Book a Service
                </Link>
                <Link to="/engage-us" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100">
                  Contact ProInspect
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
