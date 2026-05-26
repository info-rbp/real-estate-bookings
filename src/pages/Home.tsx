import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicNav from '../components/PublicNav'
import Footer from '../components/Footer'
import { ArrowRight, CalendarCheck, CheckCircle, ClipboardList, FileText, Home as HomeIcon, KeyRound, MapPin, ShieldCheck, Wrench } from 'lucide-react'

const services = [
  { title: 'Property Condition Reports', description: 'Visual attendance, photographs and a standard property condition report using the agreed system or template.', icon: ClipboardList },
  { title: 'Routine Inspections', description: 'Periodic property attendance with photographs, notes and routine inspection reporting support.', icon: CalendarCheck },
  { title: 'Exit Inspections', description: 'End-of-tenancy inspection attendance with condition observations, photos and report support.', icon: CheckCircle },
  { title: 'Open For Inspection', description: 'Open home attendance requests for up to 10 properties, reviewed for scheduling and route planning.', icon: HomeIcon },
  { title: 'Insurance Claims Management', description: 'Field support for claim-related attendance, observations, photographs and evidence collation where approved.', icon: FileText },
  { title: 'Maintenance Requests', description: 'Property attendance, issue observations, photos and approved contractor coordination support.', icon: Wrench },
  { title: 'Key Installation', description: 'Key collection and lockbox or key-safe installation with placement instructions and photo confirmation where feasible.', icon: KeyRound },
]

const workflow = [
  'Select the service that matches the property task.',
  'Provide property, access, safety and contact details.',
  'Choose a calendar slot or submit timing notes for review.',
  'Receive confirmation, photos, notes or report output.',
]

export default function Home() {
  useEffect(() => {
    document.title = 'Property Field Support, Booked On Demand | ProInspect'

    const description = 'ProInspect helps real estate agencies and landlords book property condition reports, routine inspections, exit inspections, open for inspection attendance, insurance claim support, maintenance requests and key installation services.'
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-gray-950">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.2),transparent_34%)]" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:py-32 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">ProInspect Field Services</p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">Property Field Support, Booked On Demand</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-200">
                ProInspect helps real estate agencies, property managers and landlords book reliable property attendance services without adding more field work to an already overloaded team. Because apparently property work does not do itself, no matter how many dashboards humans invent.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/login" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/85">
                  Book a Service
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
                <Link to="/engage-us" className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100">
                  Request Agency Access
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur">
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Built for authorised property work</h2>
                    <p className="text-sm text-gray-600">Access, safety, service area and booking details captured before attendance.</p>
                  </div>
                </div>
                <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-gray-50 p-4"><dt className="text-gray-500">Bookable services</dt><dd className="mt-1 text-2xl font-bold text-gray-900">7</dd></div>
                  <div className="rounded-xl bg-gray-50 p-4"><dt className="text-gray-500">OFI batch size</dt><dd className="mt-1 text-2xl font-bold text-gray-900">1-10</dd></div>
                  <div className="rounded-xl bg-gray-50 p-4"><dt className="text-gray-500">Standard region</dt><dd className="mt-1 text-2xl font-bold text-gray-900">Perth</dd></div>
                  <div className="rounded-xl bg-gray-50 p-4"><dt className="text-gray-500">Quote path</dt><dd className="mt-1 text-2xl font-bold text-gray-900">Yes</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Service Catalogue</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Seven Property Field Services</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Each service is designed for practical property attendance, evidence capture, reporting support or access-related field work.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <article key={service.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-gray-900">{service.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-600">{service.description}</p>
                  </article>
                )
              })}
            </div>

            <div className="mt-10 text-center">
              <Link to="/services" className="inline-flex items-center rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                View service details
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">A Simple Booking Workflow</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Calendar-based services use available appointment slots. Open For Inspection, urgent, outside-area and complex requests may be submitted for scheduling or quote review.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {workflow.map((item, index) => (
                <div key={item} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">{index + 1}</div>
                  <p className="mt-4 text-sm leading-7 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-3xl bg-primary px-6 py-14 text-center text-white shadow-xl sm:px-12">
              <MapPin className="mx-auto h-10 w-10" aria-hidden="true" />
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Perth and Peel Standard Service Area</h2>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/90">
                Standard pricing applies where the property matches the approved Perth and Peel service area. Outside-area, urgent, complex or unclear work can still be submitted but may require admin review or custom quote before confirmation.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link to="/pricing" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm hover:bg-gray-100">View Pricing</Link>
                <Link to="/engage-us" className="rounded-md border border-white/60 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Discuss Coverage</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
