import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import PublicNav from '../components/PublicNav'

const sections = [
  {
    title: 'Information we collect',
    body: [
      'ProInspect collects information needed to manage enquiries, account access, property field bookings, scheduling, attendance, reporting, billing and support. This may include names, agency details, email addresses, phone numbers, property addresses, access instructions, tenant or occupant contact details, booking notes, safety information, photos, report outputs, billing records and platform usage information.',
      'We collect information directly from you, from authorised agency or client users, from platform forms, from Appwrite authentication and database records, and from service providers used to operate the platform.',
    ],
  },
  {
    title: 'How we use information',
    body: [
      'We use information to respond to enquiries, assess account access requests, create and manage bookings, schedule property attendance, provide reports or service outputs, communicate with authorised contacts, manage quotes and billing, improve our services, maintain security and comply with legal or operational obligations.',
      'We may use booking details to coordinate with staff, contractors, agencies, landlords, tenants, occupants, insurers or other stakeholders where this is reasonably required to complete the requested service.',
    ],
  },
  {
    title: 'Disclosure and service providers',
    body: [
      'We may disclose information to authorised client account users, ProInspect staff, approved contractors, technology providers, payment processors, calendar/email providers and professional advisers where required for service delivery, administration, security, billing or compliance.',
      'We do not sell personal information. Some service providers may process information outside Australia, depending on the tools used to host, email, schedule, analyse or secure the platform.',
    ],
  },
  {
    title: 'Property access and sensitive booking notes',
    body: [
      'Booking forms may collect access codes, lockbox details, hazard notes, animals-at-property information and other sensitive operational details. Only provide information that is accurate, authorised and necessary for the requested attendance.',
      'We take reasonable steps to restrict access to these details to people who need them for booking, attendance, support, security or administration.',
    ],
  },
  {
    title: 'Storage, security and retention',
    body: [
      'We use reasonable technical and organisational measures to protect information, including account authentication, role-based access, audit records and restricted platform access where configured.',
      'We retain information for as long as reasonably required for service delivery, client records, billing, dispute handling, compliance, security and business administration, unless a longer period is required or permitted by law.',
    ],
  },
  {
    title: 'Access, correction and choices',
    body: [
      'You may request access to, or correction of, personal information held by ProInspect. We may need to verify your identity and authority before acting on a request.',
      'You can choose not to provide some information, but this may prevent ProInspect from responding to an enquiry, approving account access or completing a booking safely and accurately.',
    ],
  },
  {
    title: 'Cookies and platform data',
    body: [
      'The website and client portal may use cookies, local storage, analytics, authentication tokens or similar technologies to operate the service, maintain login sessions, improve usability and protect the platform.',
    ],
  },
]

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy | ProInspect'

    const description = 'Read how ProInspect collects, uses, stores and discloses lead, account, booking, access, image and calendar-related information.'
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
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-4 text-slate-600">Last updated: 26 May 2026</p>
        <p className="mt-6 text-base leading-8 text-slate-700">
          This Privacy Policy explains how ProInspect collects, uses, stores and discloses personal information through the website, client portal, booking workflows and property field support services.
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
          <h2 className="text-lg font-semibold text-slate-900">Contact and privacy requests</h2>
          <p className="mt-2">
            Contact ProInspect through the <Link to="/engage-us" className="font-semibold text-primary hover:underline">Request Access form</Link> for privacy access, correction or enquiry requests. Use of the platform is also subject to the <Link to="/terms" className="font-semibold text-primary hover:underline">Terms of Service</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
