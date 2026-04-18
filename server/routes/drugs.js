const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all drugs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, generic_name, drug_class FROM drugs ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get drug by ID with full info
router.get('/:id', async (req, res) => {
  try {
    const drug = await pool.query('SELECT * FROM drugs WHERE id=$1', [req.params.id]);
    const dosages = await pool.query('SELECT * FROM dosage_ranges WHERE drug_id=$1', [req.params.id]);
    const formulations = await pool.query('SELECT * FROM formulations WHERE drug_id=$1', [req.params.id]);
    res.json({
      ...drug.rows[0],
      dosage_ranges: dosages.rows,
      formulations: formulations.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;