import PublicNav from '../components/PublicNav';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, TrendingUp, Phone, LifeBuoy, Newspaper } from 'lucide-react';

const values = [
    { name: 'Reliability', description: 'We provide dependable, consistent support that agencies can count on, ensuring tasks are completed professionally and on time.', icon: ShieldCheck },
    { name: 'Partnership', description: 'We work as an extension of your team, providing the field support you need while you maintain control of the client relationship.', icon: Users },
    { name: 'Efficiency', description: 'Our services are designed to streamline your operations, reduce internal workloads, and free up your team to focus on high-value tasks.', icon: TrendingUp },
];

const team = [
    { name: 'Alex Morgan', role: 'Founder & CEO', imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80' },
    { name: 'Samantha Lane', role: 'Head of Operations', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80' },
    { name: 'David Chen', role: 'Agency Partnerships Lead', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80' },
];

const footerLinks = [
  { name: 'Contact', href: '#', icon: Phone },
  { name: 'Support', href: '#', icon: LifeBuoy },
  { name: 'Media', href: '#', icon: Newspaper },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      <PublicNav />
      <main className="isolate">
        {/* Hero */}
        <div className="relative isolate -z-10">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-2xl py-24 sm:py-32">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Your On-Demand Field Support Team</h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">BookPro was founded to give real estate agencies a reliable partner for property inspections and on-site tasks. We provide the extra capacity you need, without the overhead of expanding your in-house team.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
                <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
                    <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                        <p className="text-xl leading-8 text-gray-600">To provide real estate agencies with seamless, reliable, and efficient field support services, enabling them to focus on core property management activities and growth.</p>
                        <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                            <p>We understand the daily pressures faced by property managers. Balancing inspections, tenant requests, owner communications, and business growth is a constant challenge. BookPro was created to alleviate that pressure by offering a professional, on-demand extension to your team.</p>
                            <p className="mt-10">Our services are designed to integrate smoothly with your existing workflows. Whether you need support for a single inspection or across your entire portfolio, we provide the same high level of professionalism and attention to detail, ensuring your agency's reputation is enhanced with every task we complete.</p>
                        </div>
                    </div>
                    <div className="lg:flex lg:flex-auto lg:justify-center">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" alt="" className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"/>
                    </div>
                </div>
            </div>
        </div>

        {/* Values section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">We are committed to providing a service that not only meets but exceeds the expectations of our agency partners. Our values guide every inspection, report, and interaction.</p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name}>
                <dt className="font-semibold text-gray-900 flex items-center gap-2"><value.icon className="h-5 w-5 text-primary"/>{value.name}</dt>
                <dd className="mt-1 text-gray-600">{value.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Team section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet Our Leadership</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">Our leadership team combines decades of experience in real estate, technology, and service delivery to ensure BookPro remains the leading field support partner for agencies.</p>
            </div>
            <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {team.map((person) => (
                    <li key={person.name}>
                        <img className="mx-auto h-24 w-24 rounded-full" src={person.imageUrl} alt="" />
                        <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                        <p className="text-sm leading-6 text-gray-600">{person.role}</p>
                    </li>
                ))}
            </ul>
        </div>

        {/* CTA section */}
        <div className="relative isolate mt-32 px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ready to Enhance Your Agency's Capacity?</h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">Discover how BookPro can help you scale your property management operations with our flexible, on-demand field support.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link to="/pricing" className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">View Pricing</Link>
                    <Link to="/services" className="text-sm font-semibold leading-6 text-gray-900">Our Services <span aria-hidden="true">→</span></Link>
                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-gray-400">&copy; 2024 BookPro Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
