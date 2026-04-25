CREATE TABLE IF NOT EXISTS review_requests (
  id SERIAL PRIMARY KEY,
  booking_id UUID,
  property_id UUID,
  email TEXT,
  guest_name TEXT,
  review_text TEXT,
  review_rating INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);