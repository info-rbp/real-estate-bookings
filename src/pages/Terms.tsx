import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import PublicNav from '../components/PublicNav'

const sections = [
  {
    title: '1. Using ProInspect',
    body: [
      'ProInspect provides property field support, inspection attendance, booking coordination and related reporting support for authorised clients, agencies, landlords and property professionals.',
      'You must only use the platform if you are authorised to request work for the property, client or agency account you are acting for. You are responsible for the accuracy of booking details, access instructions, contact details, safety notes and service requirements you submit.',
    ],
  },
  {
    title: '2. Bookings and service scope',
    body: [
      'A submitted booking is a request for service. ProInspect may accept, decline, request more information, schedule the work, or provide a quote depending on service area, access, availability, safety, urgency and scope.',
      'Services are limited to the attendance, observation, photography, coordination and reporting tasks described in the selected booking flow or agreed client arrangement. ProInspect does not assume responsibility for property management decisions, statutory notices, owner instructions, tenant communications, legal advice, insurance claim decisions or contractor approvals unless expressly agreed in writing.',
    ],
  },
  {
    title: '3. Access, safety and authority',
    body: [
      'You must provide lawful access instructions and confirm that ProInspect is authorised to attend the property. Unsafe, incomplete, unlawful or unclear access instructions may result in delay, cancellation, re-attendance fees or quote review.',
      'You must disclose known hazards, animals, access limitations, sensitive circumstances, tenant occupancy issues and any material risks that may affect attendance.',
    ],
  },
  {
    title: '4. Pricing, quotes and payment',
    body: [
      'Published prices are shown excluding GST unless stated otherwise. Standard rates apply only where the request falls inside the standard service area and service assumptions. Premium rates apply only to approved premium, subscription or agreed volume clients.',
      'Outside-area, urgent, complex, unsafe or unclear requests may require a custom quote before the work is confirmed. Any approved expenses, access issue fees, re-attendance fees or additional work may be added where applicable.',
    ],
  },
  {
    title: '5. Cancellations, changes and delays',
    body: [
      'You should notify ProInspect as soon as possible if a booking needs to be changed or cancelled. Late changes, failed access, missing keys, tenant refusal, unsafe conditions or incorrect booking information may affect scheduling and may result in additional charges.',
      'ProInspect may reschedule or decline a request where weather, safety, access, system outage, staffing availability or scope uncertainty prevents reasonable attendance.',
    ],
  },
  {
    title: '6. Reports, photos and outputs',
    body: [
      'Reports, photos, notes and other outputs are prepared from observations made during attendance and from information supplied by the client or authorised requester. They are operational records, not building, pest, valuation, legal or engineering reports unless expressly agreed in writing.',
      'You are responsible for reviewing outputs before relying on them for notices, disputes, claims, owner updates, tenant communications or other decisions.',
    ],
  },
  {
    title: '7. Platform accounts and security',
    body: [
      'You must keep account credentials secure and ensure only authorised users access the client portal. ProInspect may suspend access where account misuse, unauthorised access, payment issues or security concerns are identified.',
    ],
  },
  {
    title: '8. Privacy',
    body: [
      'Personal information and booking data are handled in accordance with the ProInspect Privacy Policy. By submitting a booking or contact request, you confirm that you are authorised to provide the information included in that request.',
    ],
  },
]

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service | ProInspect'

    const description = 'Read the ProInspect terms covering booking authority, service scope, pricing, cancellations, access issues, reports, GST and platform use.'
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
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">ProInspect</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-4 text-slate-600">Last updated: 26 May 2026</p>
        <p className="mt-6 text-base leading-8 text-slate-700">
          These terms apply to use of the ProInspect website, client portal, booking workflows and property field support services. Client-specific service agreements, written quotes or approved subscription arrangements may include additional terms. If there is an inconsistency, the signed or written client arrangement applies to the extent of that inconsistency.
        </p>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-slate-700">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-2xl bg-slate-50 p-6 text-sm leading-7 text-slate-700 ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Questions about these terms</h2>
          <p className="mt-2">
            Contact ProInspect through the <Link to="/engage-us" className="font-semibold text-primary hover:underline">Request Access form</Link>. For information about personal information handling, read the <Link to="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
