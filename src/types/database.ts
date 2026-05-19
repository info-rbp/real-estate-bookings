export type BookingStatus = 'draft' | 'pending' | 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'failed' | 'invoiced'

export type UserRole = 'client' | 'agent' | 'admin' | 'staff'

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
  full_name: string
  email: string
  phone: string | null
  company_name: string | null
  role: UserRole
  avatar_url: string | null
  timezone: string
  two_factor_enabled: boolean
  email_notifications: boolean
  sms_notifications: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_id: string
  service?: Service
  property_address: string
  property_city: string
  property_postal_code: string
  property_type: 'apartment' | 'house' | 'townhouse'
  access_method: 'lockbox' | 'tenant' | 'agency'
  access_instructions: string | null
  booking_date: string
  booking_time: string
  duration_minutes: number
  status: BookingStatus
  assigned_professional_id: string | null
  assigned_professional?: Profile
  base_price: number
  travel_surcharge: number
  total_price: number
  notes: string | null
  created_at: string
  updated_at: string
}
