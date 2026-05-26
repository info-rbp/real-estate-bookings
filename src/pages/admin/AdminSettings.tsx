import { Link } from 'react-router-dom'
import { Globe, KeyRound, Layers3, ShieldCheck } from 'lucide-react'

const sections = [
  {
    title: 'Brand and domain',
    icon: Globe,
    body: 'Update VITE_BRAND_* values and PUBLIC_SITE_URL for the active white-label deployment before publishing a new environment.',
  },
  {
    title: 'Appwrite function variables',
    icon: KeyRound,
    body: 'Booking email and Google Calendar behaviour depends on server-side variables configured on the create-work-order function, not frontend Vite variables.',
  },
  {
    title: 'Schema reconciliation',
    icon: Layers3,
    body: 'Run the baseline provisioning script first, then the launch schema script so booking metadata, log collections and the approved service catalogue stay aligned.',
  },
  {
    title: 'Permissions review',
    icon: ShieldCheck,
    body: 'Keep Appwrite collections deny-by-default and validate that client users cannot cross-read or mutate privileged operational records directly.',
  },
]

export default function AdminSettings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-display font-medium text-on-surface mb-2">Admin Settings</h1>
        <p className="text-on-surface-variant">Operational guidance for environment setup, schema reconciliation and deployment readiness.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <article key={section.title} className="terris-card bg-white p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <section.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-on-surface">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">{section.body}</p>
          </article>
        ))}
      </div>

      <div className="terris-card bg-white p-8 space-y-4">
        <h2 className="text-2xl font-display font-medium text-on-surface">Reference docs</h2>
        <div className="flex flex-col gap-3 text-sm">
          <a href="https://github.com/info-rbp/real-estate-bookings/blob/main/README.md" className="text-primary font-semibold hover:underline">README deployment guide</a>
          <a href="https://github.com/info-rbp/real-estate-bookings/blob/main/docs/appwrite/schema-and-permissions.md" className="text-primary font-semibold hover:underline">Appwrite schema and permissions</a>
          <a href="https://github.com/info-rbp/real-estate-bookings/blob/main/docs/deployment/live-smoke-test.md" className="text-primary font-semibold hover:underline">Live smoke test checklist</a>
          <a href="https://github.com/info-rbp/real-estate-bookings/blob/main/docs/production-hardening.md" className="text-primary font-semibold hover:underline">Production hardening plan</a>
        </div>
        <p className="text-sm text-on-surface-variant">
          Client-facing configuration belongs in the repository and deployment environments. Secrets, provider credentials and Google Calendar access belong in Appwrite or Cloudflare secret management, never in the browser bundle.
        </p>
        <Link to="/admin/dashboard/work-orders" className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-on-primary hover:opacity-90">
          Review work orders
        </Link>
      </div>
    </div>
  )
}
