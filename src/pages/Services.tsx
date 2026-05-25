import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Home,
  Key,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';

type Service = {
  title: string;
  description: string;
  bestFor: string;
  bookingRequirements: string;
  scheduling?: string;
  icon: LucideIcon;
  ctaLabel: string;
  ctaLink: string;
};

const services: Service[] = [
  {
    title: 'Property Condition Report',
    description:
      'The service includes visiting the property, conducting a visual inspection, taking photographs, and preparing a standard Property Condition Report using the agreed system or template.',
    bestFor: 'New tenancies, onboarding, and property condition documentation.',
    bookingRequirements:
      'Access details, report template/system, and any special notes from the booker.',
    scheduling: 'Scheduling duration: 1.5 hours.',
    icon: ClipboardList,
    ctaLabel: 'Book this service',
    ctaLink: '/login',
  },
  {
    title: 'Routine Inspection',
    description:
      'The service includes visiting the property, conducting a visual inspection, taking photographs and notes, and preparing a routine inspection report.',
    bestFor: 'Periodic inspections during a tenancy.',
    bookingRequirements: 'Tenant/access details and any focus areas or known issues.',
    scheduling: 'Scheduling duration: 30 minutes.',
    icon: ClipboardCheck,
    ctaLabel: 'Book this service',
    ctaLink: '/login',
  },
  {
    title: 'Exit Inspection',
    description:
      'The service includes attending the property, conducting a visual inspection, taking photographs and notes, and preparing an exit inspection report.',
    bestFor: 'End-of-tenancy condition review.',
    bookingRequirements:
      'Vacate/access details, key status, and any cleaning or damage concerns.',
    scheduling: 'Scheduling duration: 1 hour.',
    icon: CheckSquare,
    ctaLabel: 'Book this service',
    ctaLink: '/login',
  },
  {
    title: 'Open For Inspection',
    description:
      'The service involves attending scheduled open homes for potential tenants and providing confirmation or notes of attendance as needed.',
    bestFor: 'Agencies managing multiple rental openings.',
    bookingRequirements:
      'Supports up to 10 properties per booking request. Each property requires its own access details.',
    scheduling: 'Submitted for scheduling/route review rather than instant confirmation.',
    icon: Home,
    ctaLabel: 'Book this service',
    ctaLink: '/login',
  },
  {
    title: 'Insurance Claims Management',
    description:
      'The service provides field support for insurance claims by attending relevant events, taking photographs, making observations, and collating claim support information where approved.',
    bestFor:
      'Claim support, attendance, photos, observations and evidence collation.',
    bookingRequirements:
      'Insurer, claim number, event details and scope information may be required.',
    scheduling: 'Complex or unclear scopes may require review or custom quote.',
    icon: FileText,
    ctaLabel: 'Book this service',
    ctaLink: '/login',
  },
  {
    title: 'Maintenance Requests',
    description:
      'The service entails coordinating property maintenance tasks, attending to the site, capturing photographic evidence, making observations, and supporting contractor engagement when approved.',
    bestFor:
      'Maintenance attendance, photos, issue observations and contractor coordination support.',
    bookingRequirements:
      'Issue details, urgency, access information and approval status.',
    scheduling: 'Urgent or complex requests may require review.',
    icon: Wrench,
    ctaLabel: 'Book this service',
    ctaLink: '/login',
  },
  {
    title: 'Key Installation',
    description:
      'The service involves collecting keys from a designated location, installing or placing a key safe or lockbox as directed, and providing photo confirmation where feasible.',
    bestFor: 'New property setup, access preparation and lockbox/key safe placement.',
    bookingRequirements:
      'Key collection address, collection contact details, installation instructions and preferred location.',
    scheduling: 'Scheduled once collection and placement instructions are confirmed.',
    icon: Key,
    ctaLabel: 'Book this service',
    ctaLink: '/login',
  },
];

const workflowSteps = [
  {
    step: '1',
    title: 'Select the service',
    description:
      'Choose the service that matches the property attendance, reporting or field support required.',
  },
  {
    step: '2',
    title: 'Provide property and access details',
    description:
      'Add the address, access instructions, contacts, templates, focus areas and any service-specific notes.',
  },
  {
    step: '3',
    title: 'Choose a time or submit for scheduling review',
    description:
      'Calendar-based services use appointment slots. Open For Inspection requests are reviewed for scheduling and route planning.',
  },
  {
    step: '4',
    title: 'Receive confirmation, notes, photos or report output',
    description:
      'ProInspect completes the authorised field task and returns the agreed confirmation, observations, images or report output.',
  },
];

export default function ServicesPage() {
  useEffect(() => {
    document.title = 'Property Inspection & Field Support Services | ProInspect';

    const description =
      'ProInspect provides property condition reports, routine inspections, exit inspections, open for inspection attendance, insurance claim support, maintenance request support and key installation services for real estate agencies and landlords.';
    let metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute('content', description);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      <main>
        <section className="relative isolate overflow-hidden bg-gray-950">
          <img
            src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&dpr=2"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 -z-10 bg-gray-950/75" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                ProInspect Services
              </p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Property Inspection & Field Support Services
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-100">
                ProInspect helps real estate agencies and private landlords book reliable
                property attendance services, from condition reports and routine
                inspections to open homes, maintenance support, insurance claim
                assistance and key installation.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Book a Service
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/engage-us"
                  className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Request Agency Access
                </Link>
              </div>
              <p className="mt-6 max-w-xl text-sm leading-6 text-gray-300">
                Designed for agencies, property managers, leasing teams and landlords who
                need dependable support on the ground.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Practical Attendance Support
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Field Support Built Around Real Property Workflows
                </h2>
              </div>
              <div className="space-y-6 text-lg leading-8 text-gray-600">
                <p>
                  ProInspect supports real estate teams with attendance-based tasks that
                  require property access, photographs, notes, reports or confirmation of
                  work completed on site.
                </p>
                <p>
                  We support the agency, landlord or authorised client by carrying out
                  agreed field instructions. ProInspect does not replace property
                  management judgement, statutory obligations, approval decisions or the
                  client communications that remain with your team.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Approved Catalogue
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Seven Bookable Services for Property Field Work
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Each service below matches the current ProInspect booking catalogue, with
                the operational details needed to submit a clear request.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    key={service.title}
                    className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold leading-7 text-gray-900">
                          {service.title}
                        </h3>
                        <p className="mt-3 text-base leading-7 text-gray-600">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-1 flex-col justify-between gap-6">
                      <dl className="space-y-4 border-t border-gray-200 pt-5 text-sm leading-6">
                        <div>
                          <dt className="font-semibold text-gray-900">Best for</dt>
                          <dd className="mt-1 text-gray-600">{service.bestFor}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-gray-900">
                            Booking requirements
                          </dt>
                          <dd className="mt-1 text-gray-600">
                            {service.bookingRequirements}
                          </dd>
                        </div>
                        {service.scheduling && (
                          <div>
                            <dt className="font-semibold text-gray-900">Scheduling</dt>
                            <dd className="mt-1 text-gray-600">{service.scheduling}</dd>
                          </div>
                        )}
                      </dl>
                      <Link
                        to={service.ctaLink}
                        className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        {service.ctaLabel}
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Booking Process
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Calendar-based services have appointment slots. Open For Inspection
                requests are reviewed for scheduling and route planning. Complex
                insurance, maintenance or outside-area requests may require review.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-900 text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-7 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-900 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Service Boundaries
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built to Support Your Team, Not Replace It
              </h2>
              <div className="mt-6 space-y-6 text-lg leading-8 text-gray-300">
                <p>
                  ProInspect provides field support, attendance, observations, photos,
                  notes and service outputs for authorised property work.
                </p>
                <p>
                  The agency, landlord or authorised client remains responsible for
                  statutory notices, owner instructions, tenant communication, approvals,
                  property management decisions and final actions.
                </p>
                <p>
                  ProInspect acts on authorised instructions provided through the booking
                  process.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Service Area and Pricing Notes
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-700">
                Service availability and pricing are assessed using the property suburb
                and postcode. Perth and Peel service areas use standard ProInspect rates.
                Outside-area, urgent, complex or non-standard requests may require a
                custom quote.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 rounded-lg bg-primary px-6 py-12 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to Book Property Field Support?
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-white/85">
                  Log in to book a service through the ProInspect portal, or contact us
                  to discuss agency access, premium pricing or recurring support.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Book a Service
                </Link>
                <Link
                  to="/engage-us"
                  className="inline-flex items-center justify-center rounded-md border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
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
