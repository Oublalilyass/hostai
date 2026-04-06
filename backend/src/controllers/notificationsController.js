// src/controllers/notificationsController.js

const pool = require('../utils/db');

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE host_id = $1
       ORDER BY created_at DESC LIMIT 30`,
      [req.user.id]
    );
    const unreadCount = result.rows.filter(n => !n.read).length;
    res.json({ notifications: result.rows, unreadCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// PUT /api/notifications/:id/read
const markRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET read=true WHERE id=$1 AND host_id=$2',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// PUT /api/notifications/read-all
const markAllRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET read=true WHERE host_id=$1',
      [req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

// GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const [properties, bookings, cleaning, messages] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM properties WHERE host_id=$1 AND is_active=true', [req.user.id]),
      pool.query(`SELECT
        COUNT(*) FILTER (WHERE status IN ('confirmed','checked_in')) as active,
        COUNT(*) FILTER (WHERE check_in BETWEEN NOW() AND NOW() + INTERVAL '7 days' AND status='confirmed') as upcoming_week,
        COUNT(*) FILTER (WHERE check_out BETWEEN NOW() AND NOW() + INTERVAL '7 days' AND status='checked_in') as checkouts_week
        FROM bookings WHERE host_id=$1`, [req.user.id]),
      pool.query(`SELECT COUNT(*) FILTER (WHERE status='pending') as pending,
        COUNT(*) FILTER (WHERE status='done') as done FROM cleaning_tasks WHERE host_id=$1`, [req.user.id]),
      pool.query('SELECT COUNT(*) FROM ai_messages WHERE host_id=$1 AND created_at > NOW() - INTERVAL \'30 days\'', [req.user.id]),
    ]);

    res.json({
      stats: {
        totalProperties: parseInt(properties.rows[0].count),
        activeBookings: parseInt(bookings.rows[0].active),
        upcomingCheckins: parseInt(bookings.rows[0].upcoming_week),
        upcomingCheckouts: parseInt(bookings.rows[0].checkouts_week),
        pendingCleaning: parseInt(cleaning.rows[0].pending),
        completedCleaning: parseInt(cleaning.rows[0].done),
        aiMessagesThisMonth: parseInt(messages.rows[0].count),
      }
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

module.exports = { getNotifications, markRead, markAllRead, getDashboardStats };
