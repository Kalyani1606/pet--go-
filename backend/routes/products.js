const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products — list all products, with optional filters
router.get('/', (req, res) => {
  const { pet, category } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (pet && pet !== 'all') {
    sql += ' AND pet = ?';
    params.push(pet);
  }
  if (category && category !== 'all') {
    sql += ' AND category = ?';
    params.push(category);
  }

  const products = db.prepare(sql).all(...params);
  res.json(products);
});

module.exports = router;
