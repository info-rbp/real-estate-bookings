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
          title="Property Service Bookings and Work Orders, All in One Portal"
          subtitle="BookPro helps property managers, real estate agencies and private landlords request, schedule and track inspections, access tasks, open homes, maintenance support and reporting requirements from one structured platform."
          ctaText="Book a Service"
          ctaLink="/login"
          secondaryCtaText="View Services"
          secondaryCtaLink="/services"
        />

        {/* How it Works */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-medium text-on-surface mb-4">Manage Every Work Order From Request to Report</h2>
              <p className="text-lg text-on-surface-variant max-w-3xl mx-auto">Our platform provides structured service requests, upfront access and safety capture, and real-time status tracking until completion.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: Calendar, title: '1. Issue a Work Order', desc: 'Submit a detailed service request via our portal—from condition reports to routine inspections.' },
                { icon: Clock, title: '2. Professional Attendance', desc: 'Field professionals attend the property to complete the work with full access and safety compliance.' },
                { icon: CheckCircle, title: '3. Digital Reporting', desc: 'Receive professional reports and invoice-ready records directly in one place.' },
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

        {/* Built for Every Property Workflow */}
        <section className="py-24 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-display font-medium text-gray-900 mb-4">Built for Every Property Workflow</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">BookPro offers a comprehensive suite of services designed to support property professionals at every stage of the lifecycle.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Property Managers</h3>
                <p className="text-base text-gray-600 flex-grow">Coordinate routine inspections, exit inspections, access instructions, tenant contact details and reporting requirements from one organised portal.</p>
                <Link to="/services" className="text-primary font-semibold mt-6">View Services →</Link>
              </div>
              <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real Estate Agencies</h3>
                <p className="text-base text-gray-600 flex-grow">Add flexible field capacity across rent rolls, leasing activity, open homes and property support tasks without overloading your internal team.</p>
                <Link to="/services" className="text-primary font-semibold mt-6">View Services →</Link>
              </div>
              <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Private Landlords</h3>
                <p className="text-base text-gray-600 flex-grow">Request property services, track appointment status and keep inspection notes, photos and access information organised without needing agency systems.</p>
                <Link to="/services" className="text-primary font-semibold mt-6">View Services →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-4xl font-display font-medium text-on-primary mb-4">Ready to Enhance Your Property Capacity?</h2>
            <p className="text-lg text-on-primary/80 mb-8 max-w-2xl mx-auto">Join BookPro to streamline your inspections, Work Orders and property reporting today.</p>
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