// src/controllers/propertiesController.js
// CRUD for properties

const pool = require('../utils/db');

// GET /api/properties
const getProperties = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*,
        (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status NOT IN ('cancelled', 'checked_out')) as active_bookings,
        (SELECT COUNT(*) FROM cleaning_tasks ct WHERE ct.property_id = p.id AND ct.status = 'pending') as pending_cleanings
       FROM properties p
       WHERE p.host_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ properties: result.rows });
  } catch (err) {
    console.error('Get properties error:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

// GET /api/properties/:id
const getProperty = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM properties WHERE id = $1 AND host_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ property: result.rows[0] });
  } catch (err) {
    console.error('Get property error:', err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

// POST /api/properties
const createProperty = async (req, res) => {
  try {
    const {
      title_en, title_fr, title_es,
      description_en, description_fr, description_es,
      checkin_instructions_en, checkin_instructions_fr, checkin_instructions_es,
      address, city, country,
      property_type, max_guests, bedrooms, bathrooms,
      images, cleaner_email, cleaner_name,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO properties (
        host_id, title_en, title_fr, title_es,
        description_en, description_fr, description_es,
        checkin_instructions_en, checkin_instructions_fr, checkin_instructions_es,
        address, city, country, property_type, max_guests, bedrooms, bathrooms,
        images, cleaner_email, cleaner_name
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING *`,
      [
        req.user.id, title_en, title_fr, title_es,
        description_en, description_fr, description_es,
        checkin_instructions_en, checkin_instructions_fr, checkin_instructions_es,
        address, city, country, property_type || 'apartment', max_guests || 2, bedrooms || 1, bathrooms || 1,
        images || [], cleaner_email, cleaner_name,
      ]
    );

    res.status(201).json({ property: result.rows[0] });
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

// PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const {
      title_en, title_fr, title_es,
      description_en, description_fr, description_es,
      checkin_instructions_en, checkin_instructions_fr, checkin_instructions_es,
      address, city, country, property_type,
      max_guests, bedrooms, bathrooms, images,
      cleaner_email, cleaner_name, is_active,
    } = req.body;

    const result = await pool.query(
      `UPDATE properties SET
        title_en=$1, title_fr=$2, title_es=$3,
        description_en=$4, description_fr=$5, description_es=$6,
        checkin_instructions_en=$7, checkin_instructions_fr=$8, checkin_instructions_es=$9,
        address=$10, city=$11, country=$12, property_type=$13,
        max_guests=$14, bedrooms=$15, bathrooms=$16, images=$17,
        cleaner_email=$18, cleaner_name=$19, is_active=$20
      WHERE id=$21 AND host_id=$22
      RETURNING *`,
      [
        title_en, title_fr, title_es,
        description_en, description_fr, description_es,
        checkin_instructions_en, checkin_instructions_fr, checkin_instructions_es,
        address, city, country, property_type,
        max_guests, bedrooms, bathrooms, images,
        cleaner_email, cleaner_name, is_active,
        req.params.id, req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ property: result.rows[0] });
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

// DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM properties WHERE id = $1 AND host_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

module.exports = { getProperties, getProperty, createProperty, updateProperty, deleteProperty };
