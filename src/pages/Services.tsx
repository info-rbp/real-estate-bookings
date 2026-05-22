import { Link } from "react-router-dom";
import { useEffect } from 'react';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';
import { ArrowRight, ClipboardList, ClipboardCheck, CheckSquare, Home, Key, Wrench, FileText, Users, Award, Settings2 } from 'lucide-react';

const services = [
  { icon: ClipboardList, title: 'Property Condition Reports', description: 'We attend the property, complete a visual inspection, capture photographs and prepare a Property Condition Report using the agreed template, platform or reporting process.' },
  { icon: ClipboardCheck, title: 'Routine Inspections', description: 'We assist with scheduled routine inspections by attending the property, taking photos and notes, and preparing a clear routine inspection report for your agency.' },
  { icon: CheckSquare, title: 'Exit Inspections', description: 'We support end-of-tenancy inspections by attending the property, documenting its condition, capturing photographs and preparing exit inspection notes or reports as required.' },
  { icon: Home, title: 'Open for Inspection Attendance', description: 'We attend scheduled rental viewings and open homes on behalf of your agency, helping maintain leasing momentum when your internal team is unavailable or managing multiple vacancies.' },
  { icon: Key, title: 'Key Safe and Lockbox Installation', description: 'We assist with key collection, key safe placement, lockbox installation and access setup, with photo confirmation provided where practical.' },
  { icon: Wrench, title: 'Maintenance Request Support', description: 'We provide on-site support for maintenance matters by attending properties, capturing photographic evidence, making observations and assisting with contractor coordination where approved.' },
  { icon: FileText, title: 'Insurance Claim Support', description: 'We assist with property attendance for insurance-related matters by capturing photographs, recording observations and providing practical, factual claim support information.' },
  { icon: Users, title: 'Dispute Evidence Support', description: 'Capture inspection notes, photographs and property condition information to support factual review of disputes, claims or condition-related issues. No legal or tenancy advice provided.' },
  { icon: Award, title: 'Landlord and Agency Referral Support', description: 'Through our agency relationships and property attendance work, we help identify and refer property owners who require professional management services.' },
  { icon: Settings2, title: 'Custom Property Support', description: 'Need support outside a standard inspection? BookPro can work with your team to design practical solutions based on your portfolio and operational needs.' },
];

const benefits = [
    { title: 'Reduce Internal Workload', description: 'Free up your property managers from routine fieldwork so they can focus on client service, leasing, arrears, renewals and portfolio management.' },
    { title: 'Improve Inspection Coverage', description: 'Get practical support across routine inspections, exit inspections, open homes and property access tasks.' },
    { title: 'Support Growing Rent Rolls', description: 'Add flexible field capacity as your agency grows, without immediately increasing permanent staffing costs.' },
    { title: 'Clear Property Information', description: 'Receive photos, notes and reports through the agreed process so your team has the information needed to manage each property confidently.' },
];

const howItWorks = [
    { step: 1, title: 'Submit a Booking', description: 'Your agency submits the inspection, open home or property support request through the agreed booking process.' },
    { step: 2, title: 'We Attend the Property', description: 'BookPro attends the property at the scheduled time and completes the agreed field task.' },
    { step: 3, title: 'We Capture the Details', description: 'Photos, notes, observations and attendance details are collected in line with the service requested.' },
    { step: 4, title: 'Your Team Receives the Report', description: 'We provide the agreed report, confirmation or supporting information so your agency can continue managing the property.' },
]

export default function ServicesPage() {

    useEffect(() => {
        document.title = 'Property Inspection Services for Real Estate Agencies | BookPro';
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'BookPro provides property inspection and field support services for real estate agencies, including routine inspections, PCRs, exit inspections, open homes, key safe installation, maintenance support and insurance claim assistance.');
        }
    }, []);

  return (
    <div className="bg-white">
      <PublicNav />

      {/* Hero Section */}
      <main className="isolate">
        <div className="relative pt-14">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
          <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Property Inspection & Field Support for Real Estate Agencies</h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">BookPro helps real estate agencies manage inspections, open homes, key access, maintenance coordination and on-site property tasks with reliable field support across their managed portfolio.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link to="/login" className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Get Started</Link>
                  <a href="#services" className="text-sm font-semibold leading-6 text-gray-900">View Our Services <span aria-hidden="true">→</span></a>
                </div>
                <p className="mt-6 text-xs leading-5 text-gray-500">Designed for property managers, leasing teams and growing rent rolls that need dependable support on the ground.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Intro Section */}
        <div className="overflow-hidden bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    <div className="lg:pr-8 lg:pt-4">
                        <div className="lg:max-w-lg">
                            <h2 className="text-base font-semibold leading-7 text-primary">Practical Support</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Practical Support for Property Professionals</p>
                            <p className="mt-6 text-lg leading-8 text-gray-600">Managing properties takes more than office-based administration. Properties need to be inspected, photographed, opened for viewings, checked at lease transitions and supported when maintenance issues arise.</p>
                            <p className="mt-8 text-lg leading-8 text-gray-600">BookPro provides outsourced property inspection and field support services for property managers, real estate agencies and private landlords that need extra capacity.</p>
                             <p className="mt-8 text-lg leading-8 text-gray-600">We work alongside your workflow to complete agreed on-site tasks, capture clear information and provide practical reporting support so you can stay focused on your portfolio growth.</p>
                        </div>
                    </div>
                    <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Professional team working in an office" className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width={2432} height={1442} />
                </div>
            </div>
        </div>

        {/* Services Overview Section */}
        <div id="services" className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">Our Services</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">BookPro supports agencies with the key inspection and property attendance services required across the management lifecycle.</p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {services.map((service) => (
                  <div key={service.title} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                      <service.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                      {service.title}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{service.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Why Agencies Use BookPro Section */}
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Why Professionals Choose BookPro</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">BookPro is built for property professionals that need dependable inspection capacity, better field coverage and less pressure on internal workflows.</p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-8">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10">
                            <div>
                                <h3 className="text-lg font-semibold leading-8 text-gray-900">{benefit.title}</h3>
                                <p className="mt-4 text-base leading-7 text-gray-600">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">How It Works</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How BookPro Works With Your Agency</p>
                </div>
                <div className="mx-auto mt-16 flow-root sm:mt-20">
                    <div className="-m-4 flex flex-wrap justify-between">
                        {howItWorks.map((item) => (
                             <div key={item.step} className="flex w-full flex-col items-center p-4 text-center md:w-1/2 lg:w-1/4">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">{item.step}</div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                                <p className="text-base text-gray-600">{item.description}</p>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Service Boundaries Section */}
        <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Factual Support for Property Decisions</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">BookPro provides property service coordination, field attendance and factual reporting support. Property management decisions remain with the agency, property manager or landlord.</p>
                <p className="mt-6 text-lg leading-8 text-gray-600">Our role is to provide reliable on-site support, photographic evidence and property condition information. We do not provide legal, tenancy or insurance advice, nor do we represent clients at tribunals or prepare statutory notices.</p>
            </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-primary">
            <div className="relative h-56 bg-indigo-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
                 <img className="h-full w-full object-cover" src="https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                 <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary to-primary/50 mix-blend-multiply"></div>
            </div>
            <div className="relative mx-auto max-w-md px-6 py-12 sm:py-20 md:py-28 lg:px-8 lg:py-32 lg:max-w-7xl lg:pl-1/2">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Need Reliable Property Inspection Support?</h2>
                <p className="mt-6 text-lg leading-8 text-gray-100">BookPro helps property managers, real estate agencies and private landlords complete inspection work, open homes, and property attendance requirements.</p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link to="/login" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get Started</Link>
                  <Link to="/engage-us" className="text-sm font-semibold leading-6 text-white">Enquire Now <span aria-hidden="true">→</span></Link>
                </div>
            </div>
        </div>
      </main>

      <Footer />

    </div>
  );
}
