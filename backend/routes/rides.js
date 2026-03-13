const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/rides — create a ride booking
router.post('/', (req, res) => {
  const { pickup, pickupLat, pickupLon, destination, destLat, destLon, petType, petCount, service, price } = req.body;

  if (!pickup) {
    return res.status(400).json({ error: 'Pickup location is required' });
  }

  const result = db.prepare(`
    INSERT INTO rides (pickup, pickup_lat, pickup_lon, destination, dest_lat, dest_lon, pet_type, pet_count, service, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(pickup, pickupLat || null, pickupLon || null, destination || null, destLat || null, destLon || null, petType || null, petCount || 1, service || null, price || null);

  console.log(`🚗 New ride booking #${result.lastInsertRowid}: ${pickup} → ${destination}`);
  res.json({ success: true, bookingId: `PG-${result.lastInsertRowid}`, message: 'Ride booked successfully!' });
});

module.exports = router;
