import PublicNav from '../components/PublicNav'
import { Users, Target, Award } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex-1">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-on-surface mb-4">About BookPro</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">We help real estate professionals streamline their booking operations and deliver exceptional service.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {[
            { icon: Users, title: '5,000+', desc: 'Businesses trust BookPro for their daily scheduling needs.' },
            { icon: Target, title: 'Our Mission', desc: 'To simplify property service management through intelligent automation.' },
            { icon: Award, title: 'Industry Leader', desc: 'Recognized as the top booking platform for real estate services.' },
          ].map((item, i) => (
            <div key={i} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant soft-saas-shadow text-center">
              <div className="bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">{item.title}</h3>
              <p className="text-sm text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant soft-saas-shadow max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-on-surface mb-4">Contact Us</h2>
          <p className="text-base text-on-surface-variant mb-6">Have questions? We'd love to hear from you.</p>
          <div className="space-y-2 text-sm text-on-surface-variant">
            <p>Email: support@bookpro.com</p>
            <p>Phone: +1 (555) 000-0000</p>
          </div>
        </div>
      </main>
      <footer className="bg-on-surface border-t border-outline-variant w-full py-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 gap-6 w-full max-w-7xl mx-auto">
          <span className="text-xl font-semibold text-surface-bright">BookPro</span>
          <p className="text-sm text-outline-variant">&copy; 2024 BookPro Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
