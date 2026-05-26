import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Camera, ShieldCheck, Users, Workflow } from 'lucide-react'
import PublicNav from '../components/PublicNav'
import Footer from '../components/Footer'

const values = [
  {
    name: 'Reliable attendance',
    description: 'We show up with the right booking context, complete the authorised field task, and keep the workflow moving.',
    icon: ShieldCheck,
  },
  {
    name: 'Clear evidence',
    description: 'Photos, notes and observations are captured so agencies and landlords can act on clear operational records.',
    icon: Camera,
  },
  {
    name: 'Transparent communication',
    description: 'ProInspect supports the field workflow while the client keeps management decisions, approvals and tenant communication.',
    icon: Users,
  },
  {
    name: 'Workflow support',
    description: 'Bookings, access details, scheduling context and service outputs stay aligned with the operational flow, not loose email chains.',
    icon: Workflow,
  },
]

const boundaries = [
  'ProInspect attends, observes, photographs, reports and confirms the authorised field task.',
  'The client retains property management decisions, legal notices, tenant communication and approvals.',
  'Outside-area, urgent, unsafe or unclear requests may be reviewed before work is confirmed.',
]

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About ProInspect | Property Field Support for Agencies and Landlords'

    const description = 'Learn how ProInspect supports real estate agencies and landlords with reliable property attendance, reporting, workflow support and clear service boundaries.'
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)
  }, [])

  return (
    <div className="bg-white">
      <PublicNav />
      <main className="isolate">
        <section className="relative isolate overflow-hidden bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
          <img
            src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&dpr=2"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 -z-10 bg-gray-950/80" aria-hidden="true" />
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">About ProInspect</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">Reliable Property Field Support for Agencies and Landlords</h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              ProInspect helps property teams book field attendance, inspections, reporting support and access-related tasks without stretching internal staff across every on-site request.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">What We Do</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">An operational partner for property field work</h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-gray-600">
              <p>
                ProInspect supports real estate agencies, property managers and landlords with authorised property attendance, photographs, observations, reports and workflow coordination across the seven current service lines.
              </p>
              <p>
                The platform is built around practical property workflows: clear booking information, access details, service-specific instructions, pricing pathways and follow-up records that help the client team stay in control.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Service Boundaries</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Built to support your team, not replace it</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {boundaries.map((item) => (
                <div key={item} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm leading-7 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">How We Work</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Values aligned to field delivery</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                The work is practical, time-sensitive and detail-heavy. These are the principles the platform and service model are built around.
              </p>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {values.map((value) => (
                <article key={value.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <value.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-gray-900">{value.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-7xl rounded-3xl bg-primary px-6 py-14 text-white shadow-xl sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Need support for your portfolio?</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/90">
              Use the Request Access form for account approval, pricing discussions or recurring support enquiries, or review the service catalogue before booking.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/engage-us" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm hover:bg-gray-100">
                Request Agency Access
              </Link>
              <Link to="/services" className="rounded-md border border-white/60 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                View Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
