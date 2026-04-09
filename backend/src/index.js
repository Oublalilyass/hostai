// src/index.js
// HostAI Backend - Express Server Entry Point

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',')
  : ['http://localhost:3000'];


// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors({
  origin: '*',  // allow all origins
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ============================================================
// ROUTES
// ============================================================
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'HostAI Backend', version: '1.0.0' });
});

// ============================================================
// ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================================
// START
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🚀 HostAI Backend running on http://localhost:${PORT}`);
  console.log(`📋 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/health\n`);
});
