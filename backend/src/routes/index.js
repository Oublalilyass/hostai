// src/routes/index.js
// All API routes

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Controllers
const auth = require('../controllers/authController');
const properties = require('../controllers/propertiesController');
const bookings = require('../controllers/bookingsController');
const ai = require('../controllers/aiController');
const cleaning = require('../controllers/cleaningController');
const notifications = require('../controllers/notificationsController');

// ============================================================
// AUTH ROUTES (public)
// ============================================================
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', authenticate, auth.getMe);
router.put('/auth/profile', authenticate, auth.updateProfile);

// ============================================================
// PROPERTIES (protected)
// ============================================================
router.get('/properties', authenticate, properties.getProperties);
router.get('/properties/:id', authenticate, properties.getProperty);
router.post('/properties', authenticate, properties.createProperty);
router.put('/properties/:id', authenticate, properties.updateProperty);
router.delete('/properties/:id', authenticate, properties.deleteProperty);

// ============================================================
// BOOKINGS (protected)
// ============================================================
router.get('/bookings', authenticate, bookings.getBookings);
router.get('/bookings/:id', authenticate, bookings.getBooking);
router.post('/bookings', authenticate, bookings.createBooking);
router.put('/bookings/:id', authenticate, bookings.updateBooking);
router.delete('/bookings/:id', authenticate, bookings.deleteBooking);

// ============================================================
// AI MESSAGING (protected)
// ============================================================
router.post('/ai/generate', authenticate, ai.generateMessage);
router.get('/ai/messages', authenticate, ai.getMessages);
router.post('/ai/chat', authenticate, ai.chat);

// ============================================================
// CLEANING (protected)
// ============================================================
router.get('/cleaning', authenticate, cleaning.getTasks);
router.post('/cleaning', authenticate, cleaning.createTask);
router.put('/cleaning/:id', authenticate, cleaning.updateTask);
router.delete('/cleaning/:id', authenticate, cleaning.deleteTask);

// ============================================================
// NOTIFICATIONS & DASHBOARD (protected)
// ============================================================
router.get('/notifications', authenticate, notifications.getNotifications);
router.put('/notifications/read-all', authenticate, notifications.markAllRead);
router.put('/notifications/:id/read', authenticate, notifications.markRead);
router.get('/dashboard/stats', authenticate, notifications.getDashboardStats);

module.exports = router;
