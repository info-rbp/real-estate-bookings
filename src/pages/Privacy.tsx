import Footer from '../components/Footer'
import PublicNav from '../components/PublicNav'

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="text-slate-600">
          This staging policy placeholder keeps the public forms and booking flow from pointing to dead links while final privacy text is being approved.
        </p>
        <section className="space-y-3 text-sm leading-7 text-slate-700">
          <p>ProInspect collects contact, booking, property, inspection, and billing information needed to deliver authorised services.</p>
          <p>Public lead and inspection forms should only collect the minimum information required and must be backed by consent-aware production handling before launch.</p>
          <p>Final retention, disclosure, and access terms are still pending business and legal review.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
