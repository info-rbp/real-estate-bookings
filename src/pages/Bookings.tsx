import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Booking } from '../types/database';
import { Calendar, Search, MoreVertical, CalendarDays } from 'lucide-react';

const mockBookings: Booking[] = [
  {
    id: '1',
    user_id: 'mock-user-id',
    service_id: '1',
    service: { id: '1', name: 'Architectural Review', description: '...', price: 250, price_type: 'fixed', duration_minutes: 120, is_active: true, icon_name: 'architecture', category: 'Consultations', created_at: '2024-01-01T00:00:00.000Z' },
    property_address: '123 Main St, New York, NY',
    property_city: 'New York', 
    property_postal_code: '10001',
    property_type: 'apartment',
    access_method: 'lockbox',
    access_instructions: 'Code is 1234',
    booking_date: '2024-09-15',
    booking_time: '10:00 AM',
    duration_minutes: 120,
    status: 'confirmed',
    base_price: 250, travel_surcharge: 50, total_price: 300, notes: '', created_at: '', updated_at: '', assigned_professional_id: null,
  },
  {
    id: '2',
    user_id: 'mock-user-id',
    service_id: '2',
    service: { id: '2', name: 'Interior Design Consultation', description: '...', price: 150, price_type: 'fixed', duration_minutes: 90, is_active: true, icon_name: 'brush', category: 'Consultations', created_at: '2024-01-01T00:00:00.000Z' },
    property_address: '789 Oak Ave, Brooklyn, NY',
    property_city: 'Brooklyn', 
    property_postal_code: '11201',
    property_type: 'house',
    access_method: 'tenant',
    access_instructions: 'Tenant will be home.',
    booking_date: '2024-10-24',
    booking_time: '2:30 PM',
    duration_minutes: 90,
    status: 'pending',
    base_price: 150, travel_surcharge: 50, total_price: 200, notes: '', created_at: '', updated_at: '', assigned_professional_id: null,
  },
  {
    id: '3',
    user_id: 'mock-user-id',
    service_id: '3',
    service: { id: '3', name: 'Site Inspection - Zone B', description: '...', price: 350, price_type: 'fixed', duration_minutes: 180, is_active: true, icon_name: 'construction', category: 'Inspections', created_at: '2024-01-01T00:00:00.000Z' },
    property_address: '456 Pine Ln, Queens, NY',
    property_city: 'Queens',
    property_postal_code: '11354',
    property_type: 'commercial',
    access_method: 'concierge',
    access_instructions: 'Key at front desk',
    booking_date: '2024-11-01',
    booking_time: '9:00 AM',
    status: 'completed',
    base_price: 350, travel_surcharge: 75, total_price: 425, notes: '', created_at: '', updated_at: '', assigned_professional_id: null,
  },
  {
    id: '4',
    user_id: 'mock-user-id',
    service_id: '4',
    service: { id: '4', name: 'Plumbing Checkup', description: '...', price: 100, price_type: 'fixed', duration_minutes: 60, is_active: true, icon_name: 'plumbing', category: 'Maintenance', created_at: '2024-01-01T00:00:00.000Z' },
    property_address: '101 Maple St, Bronx, NY',
    property_city: 'Bronx', 
    property_postal_code: '10451',
    property_type: 'house',
    access_method: 'owner',
    access_instructions: 'Owner will be home',
    booking_date: '2024-08-05',
    booking_time: '11:00 AM',
    status: 'cancelled',
    base_price: 100, travel_surcharge: 25, total_price: 125, notes: '', created_at: '', updated_at: '', assigned_professional_id: null,
  },
];

const statusFilters = ['All', 'Upcoming', 'Pending', 'Completed', 'Cancelled'];

const StatusPill = ({ status }: { status: string }) => {
  const baseClasses = "px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2";
  const statusInfo: { [key: string]: { text: string; bg: string; dot: string } } = {
    confirmed: { text: 'Confirmed', bg: 'bg-primary-fixed', dot: 'bg-primary' },
    pending: { text: 'Pending', bg: 'bg-tertiary-fixed', dot: 'bg-tertiary' },
    completed: { text: 'Completed', bg: 'bg-surface-container-high', dot: 'bg-on-surface-variant' },
    cancelled: { text: 'Cancelled', bg: 'bg-error-container', dot: 'bg-error' },
  };
  const { text, bg, dot } = statusInfo[status] || { text: status, bg: 'bg-surface-container-high', dot: 'bg-on-surface-variant' };

  return (
    <div className={`${baseClasses} ${bg}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`}></span>
      {text}
    </div>
  );
};

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = useMemo(() => {
    return mockBookings.filter(booking => {
      const statusMatch = activeFilter === 'All' || 
        (activeFilter === 'Upcoming' && ['confirmed'].includes(booking.status)) ||
        booking.status.toLowerCase() === activeFilter.toLowerCase();
      const searchMatch = (booking.service?.name.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                          booking.property_address.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div>
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-on-surface">My Bookings</h2>
        <p className="text-base text-on-surface-variant mt-1">View and manage your scheduled services.</p>
      </header>

      <div className="bg-surface-container-lowest p-4 rounded-xl soft-saas-shadow border border-outline-variant/30 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 overflow-x-auto">
            {statusFilters.map(filter => (
                <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeFilter === filter ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
                >
                {filter}
                </button>
            ))}
        </div>
        <div className="w-full md:w-auto flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-container outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <div key={booking.id} className="bg-surface-container-lowest rounded-xl soft-saas-shadow border border-outline-variant/30 overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                                <Calendar size={24}/>
                            </div>
                            <div>
                                <h3 className="font-semibold text-on-surface leading-tight">{booking.service?.name || 'Service Name'}</h3>
                                <p className="text-sm text-on-surface-variant">{booking.property_address}</p>
                            </div>
                        </div>
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-semibold text-on-surface">{new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                            <p className="text-sm text-on-surface-variant">{booking.booking_time}</p>
                        </div>
                        <StatusPill status={booking.status} />
                    </div>
                </div>
                <div className="bg-surface-container-low p-4 border-t border-outline-variant/30 flex justify-end gap-2">
                    <Link to={`/dashboard/bookings/${booking.id}`} className="text-primary text-sm font-semibold hover:underline">View Details</Link>
                </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/50">
             <CalendarDays size={48} className="mx-auto text-on-surface-variant opacity-50 mb-4" />
            <h3 className="text-lg font-semibold text-on-surface">No bookings found</h3>
            <p className="text-on-surface-variant">Try adjusting your filters or <Link to="/book/service" className="text-primary font-semibold hover:underline">create a new booking</Link>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
