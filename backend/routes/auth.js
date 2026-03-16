const express = require('express');
const router = express.Router();
const db = require('../db');

// Register
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const result = stmt.run(name, email, password);
        res.status(201).json({ success: true, userId: result.lastInsertRowid, message: 'User registered successfully!' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
        
        if (user) {
            res.json({ 
                success: true, 
                user: { id: user.id, name: user.name, email: user.email },
                message: 'Login successful!' 
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
