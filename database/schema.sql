-- ============================================================
-- HostAI - AI Airbnb Host Assistant
-- PostgreSQL Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr', 'es')),
  role VARCHAR(20) DEFAULT 'host' CHECK (role IN ('host', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PROPERTIES
-- ============================================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Multilingual fields
  title_en VARCHAR(255),
  title_fr VARCHAR(255),
  title_es VARCHAR(255),

  description_en TEXT,
  description_fr TEXT,
  description_es TEXT,

  -- Check-in instructions (multilingual)
  checkin_instructions_en TEXT,
  checkin_instructions_fr TEXT,
  checkin_instructions_es TEXT,

  -- Location
  address TEXT NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),

  -- Property details
  property_type VARCHAR(50) DEFAULT 'apartment',
  max_guests INTEGER DEFAULT 2,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  images TEXT[], -- Array of image URLs

  -- Cleaning
  cleaner_email VARCHAR(255),
  cleaner_name VARCHAR(100),

  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Guest info
  guest_name VARCHAR(200) NOT NULL,
  guest_email VARCHAR(255),
  guest_phone VARCHAR(50),
  guest_language VARCHAR(5) DEFAULT 'en' CHECK (guest_language IN ('en', 'fr', 'es')),
  num_guests INTEGER DEFAULT 1,

  -- Dates
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,

  -- Details
  special_instructions TEXT,
  source VARCHAR(50) DEFAULT 'manual', -- airbnb, booking.com, manual

  -- Status
  status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- AI MESSAGES
-- ============================================================
CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Message details
  message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('checkin', 'checkout', 'faq', 'cleaning', 'custom')),
  direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')),
  language VARCHAR(5) DEFAULT 'en',

  content TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Status
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CLEANING TASKS
-- ============================================================
CREATE TABLE cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Task details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_date DATE,
  due_time TIME,

  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done', 'cancelled')),
  cleaner_notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,

  type VARCHAR(50) NOT NULL, -- checkin_reminder, checkout_reminder, cleaning_alert, message_received
  title VARCHAR(255) NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_properties_host_id ON properties(host_id);
CREATE INDEX idx_bookings_property_id ON bookings(property_id);
CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);
CREATE INDEX idx_bookings_check_out ON bookings(check_out);
CREATE INDEX idx_ai_messages_booking_id ON ai_messages(booking_id);
CREATE INDEX idx_cleaning_tasks_property_id ON cleaning_tasks(property_id);
CREATE INDEX idx_cleaning_tasks_status ON cleaning_tasks(status);
CREATE INDEX idx_notifications_host_id ON notifications(host_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cleaning_tasks_updated_at BEFORE UPDATE ON cleaning_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
