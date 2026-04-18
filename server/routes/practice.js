const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get a random practice case
router.get('/case', async (req, res) => {
  const { difficulty } = req.query;
  try {
    const query = difficulty
      ? 'SELECT pc.*, b.name as breed_name, d.name as drug_name FROM practice_cases pc JOIN breeds b ON b.id=pc.breed_id JOIN drugs d ON d.id=pc.drug_id WHERE pc.difficulty=$1 ORDER BY RANDOM() LIMIT 1'
      : 'SELECT pc.*, b.name as breed_name, d.name as drug_name FROM practice_cases pc JOIN breeds b ON b.id=pc.breed_id JOIN drugs d ON d.id=pc.drug_id ORDER BY RANDOM() LIMIT 1';
    const result = await pool.query(query, difficulty ? [difficulty] : []);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No cases found.' });
    // Return case WITHOUT answer
    const { correct_dose_mg, correct_volume_ml, ...safeCase } = result.rows[0];
    res.json(safeCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check student's answer
router.post('/check/:id', async (req, res) => {
  const { student_dose_mg } = req.body;
  try {
    const result = await pool.query('SELECT * FROM practice_cases WHERE id=$1', [req.params.id]);
    const correctCase = result.rows[0];
    const tolerance = 0.05; // 5% tolerance
    const diff = Math.abs(student_dose_mg - correctCase.correct_dose_mg) / correctCase.correct_dose_mg;
    const isCorrect = diff <= tolerance;
    res.json({
      correct: isCorrect,
      student_answer: student_dose_mg,
      correct_dose_mg: correctCase.correct_dose_mg,
      correct_volume_ml: correctCase.correct_volume_ml,
      explanation: correctCase.explanation,
      hint: isCorrect ? null : correctCase.hint,
      margin_of_error_percent: (diff * 100).toFixed(1)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;