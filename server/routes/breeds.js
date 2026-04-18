const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const { species } = req.query;
  try {
    const query = species
      ? 'SELECT * FROM breeds WHERE species=$1 ORDER BY name'
      : 'SELECT * FROM breeds ORDER BY species, name';
    const result = await pool.query(query, species ? [species] : []);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;