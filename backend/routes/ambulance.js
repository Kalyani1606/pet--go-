const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/ambulance — create an ambulance booking
router.post('/', (req, res) => {
  const { pickup, pickupLat, pickupLon, destination, destLat, destLon, animalSize, oxygenSupport, emergencyNote } = req.body;

  if (!pickup) {
    return res.status(400).json({ error: 'Pickup location is required' });
  }

  const result = db.prepare(`
    INSERT INTO ambulance_bookings (pickup, pickup_lat, pickup_lon, destination, dest_lat, dest_lon, animal_size, oxygen_support, emergency_note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(pickup, pickupLat || null, pickupLon || null, destination || null, destLat || null, destLon || null, animalSize || 'medium', oxygenSupport ? 1 : 0, emergencyNote || null);

  console.log(`🚑 New ambulance booking #${result.lastInsertRowid}: ${pickup} → ${destination || 'TBD'} | Size: ${animalSize} | O₂: ${oxygenSupport ? 'Yes' : 'No'}`);
  res.json({ success: true, bookingId: `AMB-${result.lastInsertRowid}`, message: 'Ambulance dispatched!' });
});

module.exports = router;
