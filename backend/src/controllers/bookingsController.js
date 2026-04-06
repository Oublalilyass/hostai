// src/controllers/bookingsController.js
// Booking management with auto-task creation on checkout

const pool = require('../utils/db');

// GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const { property_id, status } = req.query;
    let query = `
      SELECT b.*, p.title_en, p.title_fr, p.title_es, p.address, p.images
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE b.host_id = $1
    `;
    const params = [req.user.id];

    if (property_id) {
      params.push(property_id);
      query += ` AND b.property_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND b.status = $${params.length}`;
    }

    query += ' ORDER BY b.check_in ASC';

    const result = await pool.query(query, params);
    res.json({ bookings: result.rows });
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// GET /api/bookings/:id
const getBooking = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, p.title_en, p.title_fr, p.title_es, p.address, p.images,
              p.checkin_instructions_en, p.checkin_instructions_fr, p.checkin_instructions_es,
              p.cleaner_email, p.cleaner_name
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE b.id = $1 AND b.host_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: result.rows[0] });
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const {
      property_id, guest_name, guest_email, guest_phone,
      guest_language, num_guests, check_in, check_out,
      special_instructions, source,
    } = req.body;

    // Verify property belongs to host
    const prop = await pool.query(
      'SELECT id FROM properties WHERE id = $1 AND host_id = $2',
      [property_id, req.user.id]
    );
    if (prop.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (
        property_id, host_id, guest_name, guest_email, guest_phone,
        guest_language, num_guests, check_in, check_out,
        special_instructions, source
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [
        property_id, req.user.id, guest_name, guest_email, guest_phone,
        guest_language || 'en', num_guests || 1, check_in, check_out,
        special_instructions, source || 'manual',
      ]
    );

    const booking = result.rows[0];

    // Auto-create notification
    await pool.query(
      `INSERT INTO notifications (host_id, booking_id, property_id, type, title, body)
       VALUES ($1,$2,$3,'checkin_reminder','New booking added','Guest $4 arrives on $5')`,
      [req.user.id, booking.id, property_id, guest_name, check_in]
    );

    res.status(201).json({ booking });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// PUT /api/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const {
      guest_name, guest_email, guest_phone, guest_language,
      num_guests, check_in, check_out, special_instructions, status,
    } = req.body;

    // Fetch current booking first
    const current = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND host_id = $2',
      [req.params.id, req.user.id]
    );
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const result = await pool.query(
      `UPDATE bookings SET
        guest_name=$1, guest_email=$2, guest_phone=$3, guest_language=$4,
        num_guests=$5, check_in=$6, check_out=$7, special_instructions=$8, status=$9
      WHERE id=$10 AND host_id=$11
      RETURNING *`,
      [
        guest_name, guest_email, guest_phone, guest_language,
        num_guests, check_in, check_out, special_instructions, status,
        req.params.id, req.user.id,
      ]
    );

    const booking = result.rows[0];

    // Auto-create cleaning task when status changes to checked_out
    if (status === 'checked_out' && current.rows[0].status !== 'checked_out') {
      const prop = await pool.query('SELECT * FROM properties WHERE id = $1', [booking.property_id]);
      const property = prop.rows[0];

      await pool.query(
        `INSERT INTO cleaning_tasks (property_id, booking_id, host_id, title, description, scheduled_date, cleaner_notified)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          booking.property_id, booking.id, req.user.id,
          `Cleaning after ${guest_name}'s stay`,
          'Change linens, clean bathroom and kitchen, restock amenities',
          booking.check_out,
          !!property.cleaner_email,
        ]
      );

      // Notify host
      await pool.query(
        `INSERT INTO notifications (host_id, booking_id, property_id, type, title, body)
         VALUES ($1,$2,$3,'cleaning_alert','Cleaning task created','Auto-created cleaning task after checkout')`,
        [req.user.id, booking.id, booking.property_id]
      );
    }

    res.json({ booking });
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// DELETE /api/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 AND host_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Delete booking error:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

module.exports = { getBookings, getBooking, createBooking, updateBooking, deleteBooking };
