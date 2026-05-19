import { Link } from 'react-router-dom'
import PublicNav from '../components/PublicNav'
import { Check } from 'lucide-react'

const plans = [
  { name: 'Starter', price: 'Free', desc: 'For individual property owners', features: ['Up to 5 bookings/month', 'Email notifications', 'Basic dashboard', 'Standard support'], cta: 'Get Started' },
  { name: 'Professional', price: '$29', period: '/month', desc: 'For real estate agents', features: ['Unlimited bookings', 'Email & SMS notifications', 'Full dashboard & analytics', 'Priority support', 'Google Calendar sync', 'Custom branding'], cta: 'Start Free Trial', popular: true },
  { name: 'Enterprise', price: '$79', period: '/month', desc: 'For agencies & teams', features: ['Everything in Professional', 'Multi-user access', 'Admin dashboard', 'API access', 'Dedicated account manager', 'Custom integrations'], cta: 'Contact Sales' },
]

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex-1">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-on-surface mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">Choose the plan that fits your business. All plans include a 14-day free trial.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(plan => (
            <div key={plan.name} className={`bg-surface-container-lowest rounded-2xl p-8 border soft-saas-shadow flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'}`}>
              {plan.popular && <span className="bg-primary text-on-primary text-xs font-semibold px-3 py-1 rounded-full self-start mb-4">Most Popular</span>}
              <h3 className="text-xl font-bold text-on-surface">{plan.name}</h3>
              <p className="text-sm text-on-surface-variant mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-on-surface">{plan.price}</span>
                {plan.period && <span className="text-on-surface-variant">{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <Check size={16} className="text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className={`w-full py-3 rounded-lg text-sm font-semibold text-center transition-all ${
                plan.popular ? 'bg-primary text-on-primary hover:opacity-90' : 'border border-primary text-primary hover:bg-primary/5'
              }`}>{plan.cta}</Link>
            </div>
          ))}
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
