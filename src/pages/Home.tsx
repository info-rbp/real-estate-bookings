import { Link } from 'react-router-dom'
import { RefreshCw, Bell, ChartBar as BarChart3, LayoutGrid, Clock, CircleCheck as CheckCircle } from 'lucide-react'
import PublicNav from '../components/PublicNav'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      <main className="flex-1 pt-0">
        {/* Hero */}
        <section className="relative overflow-hidden bg-surface-bright py-16 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-4 text-left">
              <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full w-fit text-sm font-semibold">Release v2.0 is out</span>
              <h1 className="text-5xl font-bold text-on-surface leading-tight tracking-tight">Seamless Bookings for Your Business.</h1>
              <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
                Manage schedules, track status, and sync with Google Calendar effortlessly. The all-in-one platform designed to scale your service-based business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link to="/login" className="bg-primary text-on-primary text-sm font-semibold px-8 py-3 rounded-xl soft-saas-shadow hover:opacity-90 transition-opacity text-center">
                  Get Started
                </Link>
                <button className="border border-outline text-primary text-sm font-semibold px-8 py-3 rounded-xl transition-all hover:bg-surface-container-low">
                  Book a Demo
                </button>
              </div>
            </div>
            <div className="bg-surface-container rounded-2xl overflow-hidden soft-saas-shadow aspect-video border border-outline-variant flex items-center justify-center">
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="SaaS Dashboard Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-on-surface mb-4">How it Works</h2>
              <p className="text-base text-on-surface-variant max-w-2xl mx-auto">Getting your booking system up and running is as simple as three steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: LayoutGrid, title: 'Choose Service', desc: 'Select the specific service or resource you want to offer for client scheduling.' },
                { icon: Clock, title: 'Pick Time', desc: 'Clients select their preferred slot from your real-time availability calendar.' },
                { icon: CheckCircle, title: 'Get Confirmation', desc: 'Instant notifications are sent to both parties, and the event is synced automatically.' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 bg-surface-container-low rounded-xl border border-transparent hover:border-outline-variant transition-all">
                  <div className="bg-primary text-on-primary w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-on-surface mb-2">{step.title}</h3>
                  <p className="text-sm text-on-surface-variant">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16 bg-surface-bright">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold text-on-surface mb-4">Core Features</h2>
                <p className="text-base text-on-surface-variant">Powerful tools designed for growing businesses.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant soft-saas-shadow flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="bg-secondary-container text-on-secondary-container w-12 h-12 rounded-lg flex items-center justify-center">
                    <RefreshCw size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-on-surface">Google Calendar Sync</h3>
                  <p className="text-sm text-on-surface-variant">Bidirectional synchronization ensures your personal and professional calendars never conflict.</p>
                </div>
                <div className="w-full md:w-1/2 bg-surface-container h-48 rounded-xl overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/3739263/pexels-photo-3739263.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Calendar Sync"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-4 bg-primary text-on-primary p-8 rounded-2xl soft-saas-shadow flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Bell size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">Real-time Status</h3>
                  <p className="text-sm opacity-90">Track every booking status from pending to completed. Get push notifications for every new appointment.</p>
                </div>
              </div>
              <div className="md:col-span-12 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant soft-saas-shadow flex flex-col lg:flex-row-reverse items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="bg-tertiary-container text-on-tertiary-container w-12 h-12 rounded-lg flex items-center justify-center">
                    <BarChart3 size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-on-surface">Admin Dashboard</h3>
                  <p className="text-base text-on-surface-variant">A comprehensive overview of your business performance with intuitive data visualizations.</p>
                </div>
                <div className="w-full lg:w-3/5 bg-surface-container rounded-xl overflow-hidden h-64">
                  <img
                    src="https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Analytics Dashboard"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-on-surface">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl font-bold text-surface-bright mb-4">Ready to streamline your workflow?</h2>
            <p className="text-lg text-outline-variant mb-8 max-w-xl mx-auto">Join over 5,000 businesses already using BookPro to manage their daily schedules.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="bg-primary text-on-primary text-sm font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
                Get Started Free
              </Link>
              <button className="border border-outline-variant text-surface-bright text-sm font-semibold px-8 py-3 rounded-xl transition-all">
                Talk to Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-on-surface border-t border-outline-variant w-full py-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 gap-6 w-full max-w-7xl mx-auto">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold text-surface-bright">BookPro</span>
            <p className="text-sm text-outline-variant">&copy; 2024 BookPro Inc. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-outline-variant hover:text-primary-fixed-dim transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-outline-variant hover:text-primary-fixed-dim transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-outline-variant hover:text-primary-fixed-dim transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
