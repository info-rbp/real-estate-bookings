import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';
import { ShieldCheck, Clock, Calendar, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />

      <main className="flex-1 pt-0">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-50 py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 text-left">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight tracking-tight">Reliable Field Support for Real Estate Agencies</h1>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                BookPro provides on-demand property inspection and field services to help your agency save time, reduce workload, and enhance client satisfaction. Focus on what you do best—we’ll handle the rest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link to="/engage-us" className="bg-primary text-white text-sm font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-primary/80 transition-all text-center">
                  Book a Consultation
                </Link>
                <Link to="/pricing" className="border border-outline text-primary text-sm font-semibold px-8 py-3 rounded-xl transition-all hover:bg-primary/5">
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="bg-surface-container rounded-2xl overflow-hidden shadow-lg aspect-video border border-outline-variant flex items-center justify-center">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Professional Team Collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Streamline Your Workflow in 3 Simple Steps</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">Our process is designed for maximum efficiency, giving you back valuable time to focus on your clients.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: Calendar, title: '1. Place Your Booking', desc: 'Select the service you need—from condition reports to routine inspections—via our simple online portal.' },
                { icon: Clock, title: '2. We Complete the Work', desc: 'Our experienced field professionals complete the task to the highest standard, keeping you informed along the way.' },
                { icon: CheckCircle, title: '3. Receive Your Report', desc: 'Get detailed, timely reports delivered directly to your inbox, ready to be shared with your clients.' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-transparent hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-base text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Services */}
        <section className="py-24 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Partner in Property Management</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">We offer a comprehensive suite of services designed to support real estate agencies at every stage of the tenancy lifecycle.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 bg-white p-10 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">Property Condition Reports</h3>
                  <p className="text-base text-gray-600">Detailed, unbiased reports with high-quality photos to accurately document property condition at the start of a tenancy.</p>
                  <Link to="/services" className="text-primary font-semibold">Learn more →</Link>
                </div>
                <div className="w-full md:w-1/3 bg-gray-100 h-48 rounded-xl overflow-hidden">
                  <img src="https://images.pexels.com/photos/534247/pexels-photo-534247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Property Report" className="w-full h-full object-cover"/>
                </div>
              </div>
              <div className="md:col-span-5 bg-primary text-white p-10 rounded-2xl shadow-lg flex flex-col justify-between">
                <div className="space-y-4">
                  <ShieldCheck size={32} />
                  <h3 className="text-2xl font-semibold">Routine & Exit Inspections</h3>
                  <p className="text-base opacity-90">Ensure properties are being maintained and manage tenancy handovers smoothly with our professional inspection services.</p>
                  <Link to="/services" className="text-white font-semibold underline">Explore all services</Link>
                </div>
              </div>
              <div className="md:col-span-12 bg-white p-10 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row-reverse items-center gap-8">
                <div className="flex-1 space-y-4">
                   <h3 className="text-2xl font-semibold text-gray-900">A Full Suite of Support Services</h3>
                  <p className="text-base text-gray-600">From attending viewings to coordinating maintenance and providing 3D virtual tours, we offer a wide range of services to give your team the capacity it needs to grow.</p>
                  <Link to="/services" className="text-primary font-semibold">Discover how we can help →</Link>
                </div>
                <div className="w-full lg:w-2/5 bg-gray-100 rounded-xl overflow-hidden h-64">
                  <img src="https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Virtual Tour Creation" className="w-full h-full object-cover"/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Enhance Your Agency's Efficiency?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Let BookPro handle the fieldwork so you can focus on building client relationships and growing your business.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/engage-us" className="bg-white text-primary text-sm font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all">
                Book a Free Consultation
              </Link>
              <Link to="/about" className="border border-white/50 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all hover:bg-white/10">
                About Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}