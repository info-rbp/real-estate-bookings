export type BookingStatus =
  | 'draft'
  | 'pending'
  | 'submitted'
  | 'pending_acceptance'
  | 'pending_scheduling'
  | 'requires_information'
  | 'quote_required'
  | 'awaiting_batch'
  | 'accepted'
  | 'confirmed'
  | 'declined'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'report_delivered'
  | 'invoiced'
  | 'paid'
  | 'cancelled'
  | 'access_issue'
  | 'reattendance_required'
  | 'failed'

export type UserRole = 'client_user' | 'client_admin' | 'admin' | 'staff' | 'pending'

export interface Service {
  id: string
  name: string
  description: string
  price: number
  price_type: 'fixed' | 'hourly' | 'quote'
  duration_minutes: number
  icon_name: string
  category: string
  is_active: boolean
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  client_id: string | null
  full_name: string
  email: string
  phone: string | null
  role: UserRole
  avatar_url: string | null
  timezone: string
  two_factor_enabled: boolean
  email_notifications: boolean
  sms_notifications: boolean
  status: 'pending' | 'invited' | 'active' | 'disabled'
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  client_id?: string | null
  service_id: string
  service?: Service
  property_address: string
  property_city?: string
  property_suburb?: string
  property_postal_code: string
  property_type: 'apartment' | 'house' | 'townhouse' | 'commercial' | 'other'
  access_method: 'lockbox' | 'tenant' | 'agency' | 'concierge' | 'owner' | 'other'
  access_instructions: string | null
  booking_date?: string
  booking_time?: string
  duration_minutes?: number
  status: BookingStatus
  assigned_professional_id: string | null
  base_price: number
  travel_surcharge: number
  total_price: number
  notes: string | null
  created_at: string
  updated_at: string
}
