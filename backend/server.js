const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from ../website
app.use(express.static(path.join(__dirname, '..', 'website')));

// API Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/ambulance', require('./routes/ambulance'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback: serve index.html for any unmatched non-API routes
// Using a regex literal in Express 5 avoids "PathError" from the string parser
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'website', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║      🐾 PETGO Backend Server Running      ║');
  console.log('╠═══════════════════════════════════════════╣');
  console.log(`║  🌐  http://localhost:${PORT}               ║`);
  console.log('║  📦  API: /api/products                   ║');
  console.log('║  🚗  API: /api/rides                      ║');
  console.log('║  🚑  API: /api/ambulance                  ║');
  console.log('║  📩  API: /api/contact                    ║');
  console.log('║  🛒  API: /api/orders                     ║');
  console.log('║  📧  API: /api/newsletter                 ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
});
