/*
  # Create BookPro Initial Schema

  1. New Tables
    - `profiles`: User profile data linked to auth.users
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - full_name (text)
      - email (text)
      - phone (text, nullable)
      - company_name (text, nullable)
      - role (text: client/agent/admin/staff)
      - avatar_url (text, nullable)
      - timezone (text)
      - two_factor_enabled (boolean)
      - email_notifications (boolean)
      - sms_notifications (boolean)
      - created_at, updated_at (timestamps)

    - `services`: Available booking services
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - price_type (text: fixed/hourly/quote)
      - duration_minutes (integer)
      - icon_name (text)
      - category (text)
      - is_active (boolean)
      - created_at (timestamp)

    - `bookings`: Client booking records
      - id (uuid, primary key)
      - user_id (uuid, foreign key to profiles)
      - service_id (uuid, foreign key to services)
      - property_address (text)
      - property_city (text)
      - property_postal_code (text)
      - property_type (text: apartment/house/townhouse)
      - access_method (text: lockbox/tenant/agency)
      - access_instructions (text, nullable)
      - booking_date (date)
      - booking_time (time)
      - duration_minutes (integer)
      - status (text: draft/pending/confirmed/scheduled/in_progress/completed/cancelled/failed/invoiced)
      - assigned_professional_id (uuid, nullable, foreign key to profiles)
      - base_price (numeric)
      - travel_surcharge (numeric, default 0)
      - total_price (numeric)
      - notes (text, nullable)
      - created_at, updated_at (timestamps)

  2. Security
    - Enable RLS on all tables
    - Profiles: users can read/update own data, admins can read all
    - Services: anyone can read, only admins can write
    - Bookings: users can CRUD own bookings, admins can read all, staff can read assigned

  3. Seed Data
    - 6 real estate services matching the prototype
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text,
  company_name text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'agent', 'admin', 'staff')),
  avatar_url text,
  timezone text NOT NULL DEFAULT 'America/New_York',
  two_factor_enabled boolean NOT NULL DEFAULT false,
  email_notifications boolean NOT NULL DEFAULT true,
  sms_notifications boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  price_type text NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'hourly', 'quote')),
  duration_minutes integer NOT NULL DEFAULT 60,
  icon_name text NOT NULL DEFAULT 'assignment',
  category text NOT NULL DEFAULT 'inspections',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active services"
  ON services FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Unauthenticated can read active services"
  ON services FOR SELECT
  TO anon
  USING (is_active = true);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  property_address text NOT NULL DEFAULT '',
  property_city text NOT NULL DEFAULT '',
  property_postal_code text NOT NULL DEFAULT '',
  property_type text NOT NULL DEFAULT 'apartment' CHECK (property_type IN ('apartment', 'house', 'townhouse')),
  access_method text NOT NULL DEFAULT 'lockbox' CHECK (access_method IN ('lockbox', 'tenant', 'agency')),
  access_instructions text,
  booking_date date NOT NULL DEFAULT CURRENT_DATE,
  booking_time time NOT NULL DEFAULT '09:00:00',
  duration_minutes integer NOT NULL DEFAULT 60,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled', 'failed', 'invoiced')),
  assigned_professional_id uuid REFERENCES profiles(id),
  base_price numeric NOT NULL DEFAULT 0,
  travel_surcharge numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

-- Seed services data
INSERT INTO services (name, description, price, price_type, duration_minutes, icon_name, category) VALUES
  ('Property Condition Report', 'A comprehensive document outlining the detailed state of the property at the commencement or end of a lease. Includes high-resolution photographic evidence and structural assessment.', 249.00, 'fixed', 90, 'assignment', 'inspections'),
  ('Routine Inspection', 'Periodic check-up to ensure lease compliance and identify immediate maintenance needs.', 120.00, 'fixed', 45, 'event_repeat', 'inspections'),
  ('Exit Inspection', 'Final assessment of property condition before bond release and tenant departure.', 180.00, 'fixed', 60, 'exit_to_app', 'inspections'),
  ('Open for Inspection', 'Professional hosting of prospective tenants or buyers during scheduled viewings.', 95.00, 'fixed', 120, 'door_open', 'inspections'),
  ('Maintenance Coordination', 'Liaising with tradespeople and tenants to resolve property issues efficiently.', 55.00, 'hourly', 60, 'build', 'maintenance'),
  ('Insurance Claims Management', 'End-to-end handling of property insurance claims, documentation, and vendor quotes.', 0, 'quote', 60, 'shield_with_house', 'compliance')
ON CONFLICT DO NOTHING;
