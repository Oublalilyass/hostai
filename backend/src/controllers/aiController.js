// src/controllers/aiController.js
// AI-powered guest messaging with multilingual support
// ⚡ AI INTEGRATION POINT: Replace placeholder functions with real AI calls

const pool = require('../utils/db');

// ============================================================
// AI INTEGRATION PLACEHOLDER
// Replace this function with actual Anthropic Claude or OpenAI call
// ============================================================
const generateAIMessage = async ({ type, language, guestName, propertyTitle, checkinInstructions, specialInstructions, userMessage }) => {
  // ⚡ AI INTEGRATION: Uncomment and use one of these providers

  // --- OPTION 1: Anthropic Claude ---
  // const Anthropic = require('@anthropic-ai/sdk');
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // const message = await client.messages.create({
  //   model: 'claude-opus-4-5',
  //   max_tokens: 1024,
  //   messages: [{ role: 'user', content: buildPrompt(...) }],
  // });
  // return message.content[0].text;

  // --- OPTION 2: OpenAI ---
  // const OpenAI = require('openai');
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const completion = await openai.chat.completions.create({
  //   model: 'gpt-4o',
  //   messages: [{ role: 'user', content: buildPrompt(...) }],
  // });
  // return completion.choices[0].message.content;

  // MOCK RESPONSES for MVP demo
  const templates = {
    checkin: {
      en: `Hello ${guestName}! 🏠 Welcome to ${propertyTitle}! We're thrilled to have you. ${checkinInstructions || 'Your check-in details have been sent.'} Feel free to message me anytime if you need anything. Enjoy your stay!`,
      fr: `Bonjour ${guestName} ! 🏠 Bienvenue à ${propertyTitle} ! Nous sommes ravis de vous accueillir. ${checkinInstructions || 'Vos informations d\'arrivée ont été envoyées.'} N'hésitez pas à me contacter si vous avez besoin de quoi que ce soit. Bon séjour !`,
      es: `¡Hola ${guestName}! 🏠 ¡Bienvenido/a a ${propertyTitle}! Estamos encantados de recibirle. ${checkinInstructions || 'Sus detalles de check-in han sido enviados.'} No dude en contactarme si necesita algo. ¡Disfrute su estancia!`,
    },
    checkout: {
      en: `Hello ${guestName}, we hope you had a wonderful stay at ${propertyTitle}! 🌟 Checkout is at 11:00 AM. Please leave the keys where you found them. Safe travels and we hope to welcome you back soon!`,
      fr: `Bonjour ${guestName}, nous espérons que vous avez passé un merveilleux séjour à ${propertyTitle} ! 🌟 Le départ est à 11h00. Veuillez laisser les clés là où vous les avez trouvées. Bon voyage et nous espérons vous accueillir à nouveau bientôt !`,
      es: `¡Hola ${guestName}! Esperamos que haya disfrutado su estancia en ${propertyTitle} 🌟 El check-out es a las 11:00. Por favor, deje las llaves donde las encontró. ¡Buen viaje y esperamos verle pronto!`,
    },
    faq: {
      en: `Hello ${guestName}! Thank you for your question: "${userMessage}". ${getFaqAnswer(userMessage, 'en')} If you need more help, I'm always here! 😊`,
      fr: `Bonjour ${guestName} ! Merci pour votre question : "${userMessage}". ${getFaqAnswer(userMessage, 'fr')} Si vous avez besoin d'aide supplémentaire, je suis toujours là ! 😊`,
      es: `¡Hola ${guestName}! Gracias por su pregunta: "${userMessage}". ${getFaqAnswer(userMessage, 'es')} Si necesita más ayuda, ¡aquí estoy! 😊`,
    },
  };

  const lang = language || 'en';
  return templates[type]?.[lang] || templates[type]?.['en'] || 'Message generated successfully.';
};

// Simple FAQ matcher (replace with AI in production)
const getFaqAnswer = (question, lang) => {
  const q = (question || '').toLowerCase();
  const answers = {
    wifi: {
      en: 'The WiFi details are in your welcome message. The network name and password are posted on the fridge.',
      fr: 'Les détails WiFi sont dans votre message de bienvenue. Le nom du réseau et le mot de passe sont affichés sur le réfrigérateur.',
      es: 'Los detalles del WiFi están en su mensaje de bienvenida. El nombre de la red y la contraseña están en el refrigerador.',
    },
    parking: {
      en: 'Street parking is available nearby. There is also a paid parking garage 2 minutes away.',
      fr: 'Le stationnement en rue est disponible à proximité. Il y a également un parking payant à 2 minutes.',
      es: 'Hay aparcamiento en la calle disponible cerca. También hay un parking de pago a 2 minutos.',
    },
    checkout: {
      en: 'Checkout is at 11:00 AM. Please leave the keys on the kitchen counter.',
      fr: 'Le départ est à 11h00. Veuillez laisser les clés sur le comptoir de la cuisine.',
      es: 'El check-out es a las 11:00. Por favor, deje las llaves en el mostrador de la cocina.',
    },
  };

  if (q.includes('wifi') || q.includes('internet')) return answers.wifi[lang] || answers.wifi.en;
  if (q.includes('park')) return answers.parking[lang] || answers.parking.en;
  if (q.includes('check') || q.includes('leave') || q.includes('out')) return answers.checkout[lang] || answers.checkout.en;

  return lang === 'fr'
    ? 'Je transmettrai votre question à l\'hôte qui vous répondra rapidement.'
    : lang === 'es'
    ? 'Transmitiré su pregunta al anfitrión quien responderá pronto.'
    : 'I\'ll pass your question to the host who will respond shortly.';
};

// ============================================================
// CONTROLLERS
// ============================================================

// POST /api/ai/generate
const generateMessage = async (req, res) => {
  try {
    const { booking_id, message_type, language, user_message } = req.body;

    // Fetch booking and property details
    const bookingResult = await pool.query(
      `SELECT b.*, p.title_en, p.title_fr, p.title_es,
              p.checkin_instructions_en, p.checkin_instructions_fr, p.checkin_instructions_es
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE b.id = $1 AND b.host_id = $2`,
      [booking_id, req.user.id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];
    const lang = language || booking.guest_language || 'en';
    const propertyTitle = booking[`title_${lang}`] || booking.title_en;
    const checkinInstructions = booking[`checkin_instructions_${lang}`] || booking.checkin_instructions_en;

    // Generate AI message
    const content = await generateAIMessage({
      type: message_type,
      language: lang,
      guestName: booking.guest_name,
      propertyTitle,
      checkinInstructions,
      specialInstructions: booking.special_instructions,
      userMessage: user_message,
    });

    // Save to database
    const msgResult = await pool.query(
      `INSERT INTO ai_messages (booking_id, property_id, host_id, message_type, direction, language, content, ai_generated, status)
       VALUES ($1,$2,$3,$4,'outbound',$5,$6,true,'sent')
       RETURNING *`,
      [booking_id, booking.property_id, req.user.id, message_type, lang, content]
    );

    res.json({ message: msgResult.rows[0], content });
  } catch (err) {
    console.error('Generate message error:', err);
    res.status(500).json({ error: 'Failed to generate message' });
  }
};

// GET /api/ai/messages
const getMessages = async (req, res) => {
  try {
    const { booking_id, property_id } = req.query;
    let query = `
      SELECT m.*, b.guest_name, b.check_in, b.check_out
      FROM ai_messages m
      LEFT JOIN bookings b ON m.booking_id = b.id
      WHERE m.host_id = $1
    `;
    const params = [req.user.id];

    if (booking_id) {
      params.push(booking_id);
      query += ` AND m.booking_id = $${params.length}`;
    }
    if (property_id) {
      params.push(property_id);
      query += ` AND m.property_id = $${params.length}`;
    }

    query += ' ORDER BY m.created_at DESC LIMIT 50';

    const result = await pool.query(query, params);
    res.json({ messages: result.rows });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// POST /api/ai/chat - FAQ bot endpoint
const chat = async (req, res) => {
  try {
    const { booking_id, user_message, language } = req.body;

    const bookingResult = await pool.query(
      `SELECT b.*, p.title_en, p.title_fr, p.title_es
       FROM bookings b JOIN properties p ON b.property_id = p.id
       WHERE b.id = $1 AND b.host_id = $2`,
      [booking_id, req.user.id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];
    const lang = language || booking.guest_language || 'en';

    const content = await generateAIMessage({
      type: 'faq',
      language: lang,
      guestName: booking.guest_name,
      propertyTitle: booking[`title_${lang}`] || booking.title_en,
      userMessage: user_message,
    });

    // Save inbound message
    await pool.query(
      `INSERT INTO ai_messages (booking_id, property_id, host_id, message_type, direction, language, content, ai_generated)
       VALUES ($1,$2,$3,'faq','inbound',$4,$5,false)`,
      [booking_id, booking.property_id, req.user.id, lang, user_message]
    );

    // Save AI response
    const response = await pool.query(
      `INSERT INTO ai_messages (booking_id, property_id, host_id, message_type, direction, language, content, ai_generated, status)
       VALUES ($1,$2,$3,'faq','outbound',$4,$5,true,'sent')
       RETURNING *`,
      [booking_id, booking.property_id, req.user.id, lang, content]
    );

    res.json({ response: content, message: response.rows[0] });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed' });
  }
};

module.exports = { generateMessage, getMessages, chat };
