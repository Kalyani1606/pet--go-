const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/newsletter — subscribe to newsletter
router.post('/', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    db.prepare('INSERT INTO newsletter (email) VALUES (?)').run(email);
    console.log(`📧 New newsletter subscriber: ${email}`);
    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.json({ success: true, message: 'You are already subscribed!' });
    } else {
      throw err;
    }
  }
});

module.exports = router;
