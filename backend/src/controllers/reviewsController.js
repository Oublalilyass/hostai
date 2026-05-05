// backend/src/controllers/reviewsController.js
// Guest Review Request Automation
// ⚡ AI INTEGRATION: replace generateReviewMessage() with Claude/OpenAI

const pool = require('../utils/db');

// ─── helpers ──────────────────────────────────────────────────────────────────

const VALID_LANGS = ['en', 'fr', 'es'];

function safeLang(val) {
  return VALID_LANGS.includes(val) ? val : 'en';
}

function safeDate(val) {
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
}

function stayNights(checkIn, checkOut) {
  const diff = safeDate(checkOut) - safeDate(checkIn);
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

async function tableExists(name) {
  const r = await pool.query(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = $1
     ) AS exists`,
    [name]
  );
  return r.rows[0].exists === true;
}

const EMPTY_STATS = {
  total: '0', pending: '0', sent: '0',
  received: '0', skipped: '0',
  avg_rating: null, conversion_rate: null,
};

// ─── AI message generator ────────────────────────────────────────────────────
// ⚡ Replace the body of this function with Anthropic / OpenAI call
async function generateReviewMessage({ guestName, propertyTitle, language, stayDuration }) {
  // --- Anthropic example (uncomment when ready) ---
  // const Anthropic = require('@anthropic-ai/sdk');
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // const msg = await client.messages.create({
  //   model: 'claude-opus-4-5', max_tokens: 300,
  //   messages: [{ role: 'user', content:
  //     `Write a short, warm Airbnb review-request message in ${language}.
  //      Guest: ${guestName}. Property: ${propertyTitle}. Stay: ${stayDuration} nights.
  //      Max 100 words. Friendly tone. End with a star emoji.` }]
  // });
  // return msg.content[0].text;

  const nights = stayDuration === 1 ? '1 night' : `${stayDuration} nights`;
  const tpl = {
    en: `Hi ${guestName}! 🌟 Thank you for your ${nights} at ${propertyTitle}. We hope you had a wonderful stay! Your honest review helps us improve and helps future guests. Could you spare 2 minutes to share your thoughts? It means a lot to us. Hope to welcome you back soon! 😊`,
    fr: `Bonjour ${guestName} ! 🌟 Merci pour votre séjour de ${stayDuration === 1 ? '1 nuit' : stayDuration + ' nuits'} à ${propertyTitle}. Nous espérons que tout s'est parfaitement passé ! Votre avis nous aide à progresser. Pourriez-vous prendre 2 minutes pour laisser un commentaire ? Cela compte beaucoup pour nous. À bientôt ! 😊`,
    es: `¡Hola ${guestName}! 🌟 Gracias por su estancia de ${stayDuration === 1 ? '1 noche' : stayDuration + ' noches'} en ${propertyTitle}. ¡Esperamos que lo haya disfrutado! Su reseña nos ayuda a mejorar y a futuros huéspedes. ¿Podría dedicar 2 minutos para compartir su opinión? Significa mucho para nosotros. ¡Esperamos volver a recibirle pronto! 😊`,
  };
  return tpl[language] || tpl.en;
}

// ─── GET /api/reviews ────────────────────────────────────────────────────────
const getReviews = async (req, res) => {
  try {
    // Return empty data (not 500) if migration hasn't been run yet
    if (!(await tableExists('review_requests'))) {
      return res.json({ reviews: [], stats: EMPTY_STATS, migration_needed: true });
    }

    const { status, property_id } = req.query;
    const params = [req.user.id];

    let query = `
  SELECT
    rr.*,
    p.title_en,
    p.title_fr,
    p.title_es,
    p.city,
    p.images,
    b.check_in,
    b.check_out,
    b.source,
    (b.check_out::date - b.check_in::date) AS stay_nights
  FROM review_requests rr
  JOIN properties p ON rr.property_id = p.id
  JOIN bookings b ON rr.booking_id = b.id
  WHERE rr.host_id = $1
`;

    if (status) { params.push(status); query += ` AND rr.status = $${params.length}`; }
    if (property_id) { params.push(property_id); query += ` AND rr.property_id = $${params.length}`; }
    query += ' ORDER BY rr.created_at DESC';

    const [rows, stats] = await Promise.all([
      pool.query(query, params),
      pool.query(`
        SELECT
          COUNT(*)::text                                                                   AS total,
          COUNT(*) FILTER (WHERE status = 'pending')::text                                AS pending,
          COUNT(*) FILTER (WHERE status = 'sent')::text                                   AS sent,
          COUNT(*) FILTER (WHERE status = 'review_received')::text                        AS received,
          COUNT(*) FILTER (WHERE status = 'skipped')::text                                AS skipped,
          ROUND(AVG(review_rating) FILTER (WHERE review_rating IS NOT NULL), 1)::text     AS avg_rating,
          ROUND(
            COUNT(*) FILTER (WHERE review_received = true) * 100.0
            / NULLIF(COUNT(*) FILTER (WHERE status IN ('sent','review_received')), 0)
          , 1)::text                                                                       AS conversion_rate
        FROM review_requests WHERE host_id = $1
      `, [req.user.id]),
    ]);

    res.json({ reviews: rows.rows, stats: stats.rows[0] });
  } catch (err) {
    console.error('getReviews error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /api/reviews/generate ──────────────────────────────────────────────
const generateReview = async (req, res) => {
  try {
    if (!(await tableExists('review_requests'))) {
      return res.status(400).json({ error: 'Run migrate_reviews.sql first.' });
    }

    const { booking_id, language, platform = 'airbnb', special_note, send_after_hours = 2 } = req.body;
    if (!booking_id) return res.status(400).json({ error: 'booking_id is required' });

    const bRes = await pool.query(
      `SELECT b.*, p.title_en, p.title_fr, p.title_es
       FROM bookings b JOIN properties p ON b.property_id = p.id
       WHERE b.id = $1 AND b.host_id = $2`,
      [booking_id, req.user.id]
    );
    if (!bRes.rows.length) return res.status(404).json({ error: 'Booking not found' });

    const b = bRes.rows[0];
    const lang = safeLang(language || b.guest_language);
    const title = b[`title_${lang}`] || b.title_en || 'your property';
    const nights = stayNights(b.check_in, b.check_out);

    const message = await generateReviewMessage({ guestName: b.guest_name, propertyTitle: title, language: lang, stayDuration: nights });

    const scheduledAt = new Date(safeDate(b.check_out).getTime() + Number(send_after_hours) * 3600000);

    // Upsert
    const existing = await pool.query('SELECT id FROM review_requests WHERE booking_id=$1 AND host_id=$2', [booking_id, req.user.id]);

    let row;
    if (existing.rows.length) {
      const u = await pool.query(
        `UPDATE review_requests SET message=$1, language=$2, platform=$3, send_after_hours=$4, scheduled_at=$5, status='pending', updated_at=NOW()
         WHERE booking_id=$6 AND host_id=$7 RETURNING *`,
        [message, lang, platform, Number(send_after_hours), scheduledAt, booking_id, req.user.id]
      );
      row = u.rows[0];
    } else {
      const i = await pool.query(
        `INSERT INTO review_requests
           (booking_id, property_id, host_id, guest_name, guest_email, guest_language,
            message, language, platform, send_after_hours, scheduled_at, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending') RETURNING *`,
        [booking_id, b.property_id, req.user.id, b.guest_name, b.guest_email || null, lang,
          message, lang, platform, Number(send_after_hours), scheduledAt]
      );
      row = i.rows[0];
    }

    res.json({ reviewRequest: row, message });
  } catch (err) {
    console.error('generateReview error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /api/reviews/:id/send ───────────────────────────────────────────────
const sendReview = async (req, res) => {
  try {
    const r = await pool.query(
      `UPDATE review_requests SET status='sent', sent_at=NOW(), auto_sent=false
       WHERE id=$1 AND host_id=$2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });

    // notification (best-effort)
    pool.query(
      `INSERT INTO notifications (host_id, booking_id, property_id, type, title, body)
       VALUES ($1,$2,$3,'review_sent',$4,$5)`,
      [req.user.id, r.rows[0].booking_id, r.rows[0].property_id,
        'Review request sent', `Sent to ${r.rows[0].guest_name}`]
    ).catch(() => { });

    res.json({ reviewRequest: r.rows[0] });
  } catch (err) {
    console.error('sendReview error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ─── PUT /api/reviews/:id ─────────────────────────────────────────────────────
const updateReview = async (req, res) => {
  try {
    const { message, platform, status, review_received, review_rating, review_note, send_after_hours } = req.body;

    const r = await pool.query(
      `UPDATE review_requests SET
         message          = COALESCE($1, message),
         platform         = COALESCE($2, platform),
         status           = COALESCE($3, status),
         review_received  = COALESCE($4, review_received),
         review_rating    = COALESCE($5, review_rating),
         review_note      = COALESCE($6, review_note),
         send_after_hours = COALESCE($7, send_after_hours),
         reviewed_at      = CASE WHEN $4 = true THEN NOW() ELSE reviewed_at END,
         updated_at       = NOW()
       WHERE id=$8 AND host_id=$9 RETURNING *`,
      [message, platform, status, review_received ?? null, review_rating ?? null,
        review_note ?? null, send_after_hours ?? null, req.params.id, req.user.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ reviewRequest: r.rows[0] });
  } catch (err) {
    console.error('updateReview error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ─── DELETE /api/reviews/:id ──────────────────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const r = await pool.query(
      'DELETE FROM review_requests WHERE id=$1 AND host_id=$2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteReview error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /api/reviews/bulk-generate ─────────────────────────────────────────
const bulkGenerate = async (req, res) => {
  try {
    if (!(await tableExists('review_requests'))) {
      return res.status(400).json({
        error: 'Table review_requests does not exist. Run: psql -d YOUR_DB -f database/migrate_reviews.sql',
      });
    }

    const { platform = 'airbnb', send_after_hours = 2 } = req.body;

    const bRes = await pool.query(
      `SELECT b.*, p.title_en, p.title_fr, p.title_es
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       LEFT JOIN review_requests rr ON rr.booking_id = b.id
       WHERE b.host_id = $1 AND b.status = 'checked_out' AND rr.id IS NULL`,
      [req.user.id]
    );

    if (!bRes.rows.length) {
      return res.json({ created: 0, reviewRequests: [], message: 'No eligible bookings found.' });
    }

    const created = [];
    const errors = [];

    for (const b of bRes.rows) {
      try {
        const lang = safeLang(b.guest_language);
        const title = b[`title_${lang}`] || b.title_en || 'your property';
        const nights = stayNights(b.check_in, b.check_out);

        const message = await generateReviewMessage({ guestName: b.guest_name, propertyTitle: title, language: lang, stayDuration: nights });
        const scheduledAt = new Date(safeDate(b.check_out).getTime() + Number(send_after_hours) * 3600000);

        const ins = await pool.query(
          `INSERT INTO review_requests
             (booking_id, property_id, host_id, guest_name, guest_email, guest_language,
              message, language, platform, send_after_hours, scheduled_at, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending')
           ON CONFLICT DO NOTHING RETURNING *`,
          [b.id, b.property_id, req.user.id, b.guest_name, b.guest_email || null, lang,
            message, lang, platform, Number(send_after_hours), scheduledAt]
        );
        if (ins.rows.length) created.push(ins.rows[0]);
      } catch (rowErr) {
        console.error('bulkGenerate row error:', b.id, rowErr.message);
        errors.push({ booking_id: b.id, guest: b.guest_name, error: rowErr.message });
      }
    }

    res.json({ created: created.length, errors: errors.length ? errors : undefined, reviewRequests: created });
  } catch (err) {
    console.error('bulkGenerate error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getReviews, generateReview, sendReview, updateReview, deleteReview, bulkGenerate };
