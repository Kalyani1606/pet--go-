const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/contact — save a contact form submission
router.post('/', (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const result = db.prepare(`
    INSERT INTO contact_messages (first_name, last_name, email, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(firstName || null, lastName || null, email, subject || null, message || null);

  console.log(`📩 New contact message #${result.lastInsertRowid} from ${firstName} ${lastName} (${email})`);
  res.json({ success: true, messageId: result.lastInsertRowid, message: 'Message received! We will get back to you soon.' });
});

module.exports = router;
