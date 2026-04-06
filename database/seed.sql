-- ============================================================
-- HostAI - Seed Data for Testing
-- Run AFTER schema.sql
-- ============================================================

-- Seed user (password: "password123" - bcrypt hash)
INSERT INTO users (id, email, password_hash, first_name, last_name, preferred_language, role) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'host@hostai.demo', '$2b$10$rQZ9s.LY6GBjDMfMPV0.Buq8mMq9JuGwF/cCHivw7yQqXxhCsq5Oy', 'Sophie', 'Martin', 'fr', 'host'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'john@hostai.demo', '$2b$10$rQZ9s.LY6GBjDMfMPV0.Buq8mMq9JuGwF/cCHivw7yQqXxhCsq5Oy', 'John', 'Smith', 'en', 'host');

-- Seed properties
INSERT INTO properties (id, host_id, title_en, title_fr, title_es, description_en, description_fr, description_es,
  address, city, country, property_type, max_guests, bedrooms, bathrooms,
  checkin_instructions_en, checkin_instructions_fr, checkin_instructions_es,
  cleaner_email, cleaner_name, images) VALUES
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Charming Parisian Apartment in Montmartre',
  'Charmant appartement parisien à Montmartre',
  'Encantador apartamento parisino en Montmartre',
  'A beautiful light-filled apartment steps from Sacré-Cœur. Perfect for couples or solo travelers exploring Paris.',
  'Un bel appartement lumineux à deux pas du Sacré-Cœur. Parfait pour les couples ou les voyageurs solo explorant Paris.',
  'Un hermoso apartamento lleno de luz a pasos del Sacré-Cœur. Perfecto para parejas o viajeros individuales que exploran París.',
  '18 Rue des Abbesses, 75018 Paris', 'Paris', 'France',
  'apartment', 2, 1, 1,
  'Key is in the lockbox at the front door. Code: 4521. WiFi: ParisHome_5G / pass: bonjour2024',
  'La clé est dans la boîte à clés à la porte d''entrée. Code: 4521. WiFi: ParisHome_5G / mdp: bonjour2024',
  'La llave está en la caja de llaves en la puerta principal. Código: 4521. WiFi: ParisHome_5G / contraseña: bonjour2024',
  'cleaner@cleanpro.fr', 'Marie Dupont',
  ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Cozy Studio near Eiffel Tower',
  'Studio cosy près de la Tour Eiffel',
  'Estudio acogedor cerca de la Torre Eiffel',
  'Compact and efficient studio with stunning Eiffel Tower views from the balcony.',
  'Studio compact et fonctionnel avec une vue imprenable sur la Tour Eiffel depuis le balcon.',
  'Estudio compacto y eficiente con impresionantes vistas a la Torre Eiffel desde el balcón.',
  '7 Avenue de la Bourdonnais, 75007 Paris', 'Paris', 'France',
  'apartment', 2, 0, 1,
  'Smart lock on door. Your code will be sent 24h before arrival. Building code: *1234',
  'Serrure intelligente sur la porte. Votre code sera envoyé 24h avant l''arrivée. Code immeuble: *1234',
  'Cerradura inteligente en la puerta. Tu código se enviará 24h antes de la llegada. Código edificio: *1234',
  'cleaner@cleanpro.fr', 'Marie Dupont',
  ARRAY['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 'https://images.unsplash.com/photo-1499916078039-922301b0eb9b?w=800']
),
(
  'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'Modern Loft in Barcelona Gothic Quarter',
  'Loft moderne dans le Quartier Gothique de Barcelone',
  'Loft moderno en el Barrio Gótico de Barcelona',
  'Stylish loft in the heart of Gothic Quarter. Walk to everything Barcelona has to offer.',
  'Loft élégant au cœur du Quartier Gothique. À pied de tout ce que Barcelone a à offrir.',
  'Loft elegante en el corazón del Barrio Gótico. A pie de todo lo que Barcelona tiene para ofrecer.',
  'Carrer del Bisbe 15, 08002 Barcelona', 'Barcelona', 'Spain',
  'loft', 4, 2, 2,
  'Keys at reception desk downstairs. Show your booking confirmation to staff.',
  'Clés à la réception au rez-de-chaussée. Montrez votre confirmation de réservation au personnel.',
  'Llaves en la recepción abajo. Muestre su confirmación de reserva al personal.',
  'cleaning@barcelonastays.es', 'Carlos Rivera',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800']
);

-- Seed bookings
INSERT INTO bookings (id, property_id, host_id, guest_name, guest_email, guest_language, num_guests, check_in, check_out, special_instructions, status, source) VALUES
(
  'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Emma Wilson', 'emma.wilson@email.com', 'en', 2,
  CURRENT_DATE + INTERVAL '2 days',
  CURRENT_DATE + INTERVAL '7 days',
  'Celebrating anniversary - could use any local restaurant tips!',
  'confirmed', 'airbnb'
),
(
  'g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Pierre Leclerc', 'pierre.leclerc@email.fr', 'fr', 1,
  CURRENT_DATE - INTERVAL '3 days',
  CURRENT_DATE + INTERVAL '1 day',
  'Je suis végétarien - recommendations de restaurants?',
  'checked_in', 'manual'
),
(
  'h7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Maria García', 'maria.garcia@email.es', 'es', 2,
  CURRENT_DATE + INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '15 days',
  'Primera vez en París - necesitamos consejos de transporte',
  'confirmed', 'booking.com'
);

-- Seed cleaning tasks
INSERT INTO cleaning_tasks (property_id, booking_id, host_id, title, description, scheduled_date, status, cleaner_notified) VALUES
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Full cleaning after Pierre''s stay',
  'Change bed linens, clean bathroom, restock amenities, check inventory',
  CURRENT_DATE + INTERVAL '1 day',
  'pending',
  true
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
  NULL,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Deep cleaning before Maria''s arrival',
  'Full apartment deep clean, window wash, restock welcome basket',
  CURRENT_DATE + INTERVAL '9 days',
  'pending',
  false
);

-- Seed AI messages
INSERT INTO ai_messages (booking_id, property_id, host_id, message_type, direction, language, content, ai_generated, status) VALUES
(
  'g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'checkin',
  'outbound',
  'fr',
  'Bonjour Pierre ! Bienvenue à Paris ! 🗼 Votre appartement vous attend. La clé est dans la boîte à clés à la porte d''entrée, code : 4521. WiFi : ParisHome_5G / mdp : bonjour2024. N''hésitez pas à me contacter pour toute question. Bon séjour !',
  true,
  'delivered'
),
(
  'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'checkin',
  'outbound',
  'en',
  'Hello Emma! We''re so excited to welcome you to our Montmartre apartment! 🎉 Here are your check-in details: Lockbox code: 4521, WiFi: ParisHome_5G / Password: bonjour2024. For your anniversary, I highly recommend Le Moulin de la Galette restaurant just 2 minutes away. Enjoy your stay!',
  true,
  'sent'
);

-- Seed notifications
INSERT INTO notifications (host_id, booking_id, property_id, type, title, body, read) VALUES
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'checkin_reminder',
  'Upcoming check-in in 2 days',
  'Emma Wilson is checking in to Charming Parisian Apartment on ' || (CURRENT_DATE + INTERVAL '2 days')::TEXT,
  false
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'checkout_reminder',
  'Checkout tomorrow',
  'Pierre Leclerc checks out tomorrow. Cleaning task created automatically.',
  false
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  NULL,
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'cleaning_alert',
  'Cleaning task pending',
  'Cleaning scheduled for tomorrow after Pierre''s checkout. Cleaner notified.',
  true
);
