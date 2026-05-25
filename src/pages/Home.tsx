import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';
import { ShieldCheck, Clock, Calendar, CheckCircle } from 'lucide-react';

import { MarketingHero } from '../components/shared/MarketingHero';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <PublicNav />

      <main className="flex-1 pt-0">
        {/* Hero */}
        <MarketingHero
          title="Reliable Field Support for Real Estate Agencies"
          subtitle="ProInspect provides on-demand property inspection and work order management to help your agency save time and enhance client satisfaction."
          ctaText="Book a Work Order"
          ctaLink="/login"
        />

        {/* How it Works */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-medium text-on-surface mb-4">Streamline Your Workflow in 3 Simple Steps</h2>
              <p className="text-lg text-on-surface-variant max-w-3xl mx-auto">Our process is designed for maximum efficiency, giving you back valuable time to focus on your clients.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: Calendar, title: '1. Issue a Work Order', desc: 'Submit a detailed service request via our portal—from condition reports to routine inspections.' },
                { icon: Clock, title: '2. Professional Attendance', desc: 'Our field professionals complete the work to the highest standard, with full access and safety compliance.' },
                { icon: CheckCircle, title: '3. Digital Reporting', desc: 'Receive professional reports directly in your preferred system, ready for tenant or landlord review.' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center p-8 terris-card border-none bg-surface-variant">
                  <div className="bg-primary text-on-primary w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-medium text-on-surface mb-3">{step.title}</h3>
                  <p className="text-base text-on-surface-variant">{step.desc}</p>
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
            <h2 className="text-4xl font-display font-medium text-on-primary mb-4">Ready to Enhance Your Agency's Efficiency?</h2>
            <p className="text-lg text-on-primary/80 mb-8 max-w-2xl mx-auto">Let ProInspect handle the fieldwork so you can focus on building client relationships and growing your business.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="terris-btn-primary bg-white text-primary hover:bg-surface-variant">
                Get Started
              </Link>
              <Link to="/about" className="terris-btn-outline border-white text-white hover:bg-white/10">
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