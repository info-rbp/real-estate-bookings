import Footer from '../components/Footer'
import PublicNav from '../components/PublicNav'

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
        <p className="text-slate-600">
          This staging copy exists to replace broken legal links while the final ProInspect legal text is prepared for launch.
        </p>
        <section className="space-y-3 text-sm leading-7 text-slate-700">
          <p>Bookings, payments, inspections, and reporting workflows are subject to client-specific agreements and operational policies.</p>
          <p>Use of the platform is limited to authorised staff, clients, and administrators under the applicable service agreement.</p>
          <p>Production legal wording, cancellation rules, privacy controls, and billing terms still need formal review before launch.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
