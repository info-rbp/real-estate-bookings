import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Service } from '../types/database'
import PublicNav from '../components/PublicNav'
import { Search, Clock, Info } from 'lucide-react'

// Mock data to replace Supabase calls
const mockServices: Service[] = [
  { id: '1', name: 'Standard Inspection', description: 'A comprehensive inspection of the property.', price: 250, price_type: 'fixed', duration_minutes: 120, is_active: true, category: 'Inspections', icon_name: 'assignment', created_at: '2024-01-01T00:00:00.000Z' },
  { id: '2', name: 'Pest & Termite Inspection', description: 'Specialized inspection for pests and termites.', price: 150, price_type: 'fixed', duration_minutes: 90, is_active: true, category: 'Inspections', icon_name: 'shield_with_house', created_at: '2024-01-01T00:00:00.000Z' },
  { id: '3', name: 'Pool & Spa Inspection', description: 'Inspection of the pool and spa equipment.', price: 100, price_type: 'fixed', duration_minutes: 60, is_active: true, category: 'Inspections', icon_name: 'build', created_at: '2024-01-01T00:00:00.000Z' },
  { id: '4', name: 'Handover Report', description: 'A detailed report for property handover.', price: 300, price_type: 'fixed', duration_minutes: 180, is_active: true, category: 'Reports', icon_name: 'event_repeat', created_at: '2024-01-01T00:00:00.000Z' },
  { id: '5', name: 'Routine Maintenance', description: 'Scheduled maintenance to keep the property in top condition.', price: 75, price_type: 'hourly', duration_minutes: 60, is_active: true, category: 'Maintenance', icon_name: 'door_open', created_at: '2024-01-01T00:00:00.000Z' },
  { id: '6', name: 'Safety Compliance Check', description: 'Ensure the property meets all safety regulations.', price: 200, price_type: 'fixed', duration_minutes: 90, is_active: true, category: 'Compliance', icon_name: 'exit_to_app', created_at: '2024-01-01T00:00:00.000Z' },
];

const categories = ['All', 'Inspections', 'Maintenance', 'Compliance', 'Reports']

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Replace Supabase call with mock data
    setServices(mockServices);
  }, [])

  const filtered = services.filter(s => {
    const matchCategory = activeCategory === 'All' || s.category.toLowerCase() === activeCategory.toLowerCase()
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex-1">
        <section className="mb-12 flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-on-surface mb-4">Real Estate Service Solutions</h1>
          <p className="text-lg text-on-surface-variant mb-8">Expert property management services tailored for owners, agencies, and tenants.</p>
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input
              type="text"
              placeholder="Search for services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all soft-saas-shadow outline-none"
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <div key={service.id} className="bg-surface-container-lowest rounded-xl overflow-hidden soft-saas-shadow border border-outline-variant flex flex-col transition-transform hover:-translate-y-1">
              <div className="h-48 overflow-hidden bg-surface-variant relative">
                <img
                  src={`https://images.pexels.com/photos/${getPexelsId(service.icon_name)}/pexels-photo-${getPexelsId(service.icon_name)}.jpeg?auto=compress&cs=tinysrgb&w=600`}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface-variant px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Clock size={14} />
                    {service.duration_minutes} mins
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-on-surface">{service.name}</h3>
                  <span className="text-primary font-bold text-xl">
                    {service.price_type === 'quote' ? 'Quote' : service.price_type === 'hourly' ? `$${service.price}/hr` : `$${service.price}`}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mb-6 flex-grow">{service.description}</p>
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1 bg-primary text-on-primary py-2 rounded-lg text-sm font-semibold text-center hover:opacity-90 transition-opacity">
                    Book Now
                  </Link>
                  <button className="px-3 bg-surface-container-high text-on-surface-variant py-2 rounded-lg text-sm font-semibold border border-outline-variant hover:bg-surface-container transition-colors">
                    <Info size={16} className="inline" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
          </div>
        </div>
      </footer>
    </div>
  )
}

function getPexelsId(icon: string): string {
  const map: Record<string, string> = {
    assignment: '3184296',
    event_repeat: '3184325',
    exit_to_app: '3184292',
    door_open: '259588',
    build: '3184360',
    shield_with_house: '3184283',
  }
  return map[icon] || '3184296'
}
