const express = require('express');
const router = express.Router();
const pool = require('../db');

// Generate and save a treatment plan
router.post('/generate', async (req, res) => {
  const {
    patient_name, species, breed_id, weight_kg,
    drug_id, calculated_dose_mg, volume_ml,
    frequency, duration_days, notes
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO treatment_plans
       (patient_name, species, breed_id, weight_kg, drug_id,
        calculated_dose_mg, volume_ml, frequency, duration_days, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [patient_name, species, breed_id, weight_kg, drug_id,
       calculated_dose_mg, volume_ml, frequency, duration_days, notes]
    );

    // Build human-readable instructions
    const drug = await pool.query('SELECT name FROM drugs WHERE id=$1', [drug_id]);
    const instructions = generateOwnerInstructions({
      ...result.rows[0],
      drug_name: drug.rows[0].name
    });

    res.json({ plan: result.rows[0], instructions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generateOwnerInstructions(plan) {
  const freqMap = { SID: 'once daily', BID: 'twice daily', TID: 'three times daily' };
  const freq = freqMap[plan.frequency] || plan.frequency;

  return {
    summary: `Give ${plan.patient_name} ${plan.calculated_dose_mg}mg of ${plan.drug_name} ${freq} for ${plan.duration_days} days.`,
    steps: [
      `Administer ${plan.volume_ml ? plan.volume_ml + ' mL' : plan.calculated_dose_mg + 'mg'} of ${plan.drug_name}.`,
      `Give ${freq} — at the same time(s) each day.`,
      `Continue for ${plan.duration_days} days. Do not stop early even if your pet feels better.`,
      `Store medication as instructed on the label.`,
      `Contact your vet immediately if you notice vomiting, lethargy, or unusual behavior.`
    ]
  };
}

module.exports = router;