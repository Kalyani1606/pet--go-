const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/orders — place a store order
router.post('/', (req, res) => {
  const { items, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart items are required' });
  }

  const result = db.prepare(`
    INSERT INTO orders (items, total)
    VALUES (?, ?)
  `).run(JSON.stringify(items), total || 0);

  console.log(`🛒 New order #${result.lastInsertRowid} | ${items.length} items | Total: ₹${total}`);
  res.json({ success: true, orderId: `ORD-${result.lastInsertRowid}`, message: 'Order placed successfully!' });
});

module.exports = router;
