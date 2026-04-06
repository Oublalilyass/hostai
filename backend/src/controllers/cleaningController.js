// src/controllers/cleaningController.js
// Cleaning task management

const pool = require('../utils/db');

// GET /api/cleaning
const getTasks = async (req, res) => {
  try {
    const { property_id, status } = req.query;
    let query = `
      SELECT ct.*, p.title_en, p.title_fr, p.title_es, p.address,
             b.guest_name, b.check_out
      FROM cleaning_tasks ct
      JOIN properties p ON ct.property_id = p.id
      LEFT JOIN bookings b ON ct.booking_id = b.id
      WHERE ct.host_id = $1
    `;
    const params = [req.user.id];

    if (property_id) {
      params.push(property_id);
      query += ` AND ct.property_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND ct.status = $${params.length}`;
    }

    query += ' ORDER BY ct.scheduled_date ASC, ct.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error('Get cleaning tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch cleaning tasks' });
  }
};

// POST /api/cleaning
const createTask = async (req, res) => {
  try {
    const { property_id, booking_id, title, description, scheduled_date, due_time } = req.body;

    // Verify property
    const prop = await pool.query(
      'SELECT * FROM properties WHERE id = $1 AND host_id = $2',
      [property_id, req.user.id]
    );
    if (prop.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const result = await pool.query(
      `INSERT INTO cleaning_tasks (property_id, booking_id, host_id, title, description, scheduled_date, due_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [property_id, booking_id || null, req.user.id, title, description, scheduled_date, due_time || null]
    );

    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    console.error('Create cleaning task error:', err);
    res.status(500).json({ error: 'Failed to create cleaning task' });
  }
};

// PUT /api/cleaning/:id
const updateTask = async (req, res) => {
  try {
    const { title, description, scheduled_date, status, cleaner_notified } = req.body;

    const result = await pool.query(
      `UPDATE cleaning_tasks SET
        title=$1, description=$2, scheduled_date=$3, status=$4,
        cleaner_notified=$5, notified_at = CASE WHEN $5=true AND cleaner_notified=false THEN NOW() ELSE notified_at END
      WHERE id=$6 AND host_id=$7
      RETURNING *`,
      [title, description, scheduled_date, status, cleaner_notified, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (err) {
    console.error('Update cleaning task error:', err);
    res.status(500).json({ error: 'Failed to update cleaning task' });
  }
};

// DELETE /api/cleaning/:id
const deleteTask = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM cleaning_tasks WHERE id = $1 AND host_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete cleaning task error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
