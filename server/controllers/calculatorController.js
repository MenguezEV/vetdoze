const pool = require('../db');

// THE MAIN FEATURE: Precision Drug Dosage Calculator
const calculateDose = async (req, res) => {
  const { species, breed_id, weight_kg, drug_id, formulation_id } = req.body;

  // Input validation
  if (!species || !weight_kg || !drug_id) {
    return res.status(400).json({ error: 'Species, weight, and drug are required.' });
  }
  if (weight_kg <= 0 || weight_kg > 200) {
    return res.status(400).json({ error: 'Weight must be between 0 and 200 kg.' });
  }

  try {
    // 1. Get dosage range for this drug + species
    const dosageResult = await pool.query(
      `SELECT * FROM dosage_ranges WHERE drug_id=$1 AND species=$2`,
      [drug_id, species]
    );
    if (dosageResult.rows.length === 0) {
      return res.status(404).json({ error: 'No dosage data found for this drug and species.' });
    }
    const dosage = dosageResult.rows[0];

    // 2. Calculate dose in mg
    const minDose = weight_kg * dosage.min_dose_mg_per_kg;
    const maxDose = weight_kg * dosage.max_dose_mg_per_kg;
    const recommendedDose = weight_kg * ((dosage.min_dose_mg_per_kg + dosage.max_dose_mg_per_kg) / 2);

    // 3. Calculate volume if formulation is provided
    let volumeResult = null;
    let formulation = null;
    if (formulation_id) {
      const formResult = await pool.query(
        `SELECT * FROM formulations WHERE id=$1`, [formulation_id]
      );
      formulation = formResult.rows[0];
      if (formulation) {
        if (formulation.form === 'tablet') {
          volumeResult = {
            tablets: (recommendedDose / formulation.concentration_value).toFixed(2),
            unit: 'tablets'
          };
        } else {
          volumeResult = {
            volume: (recommendedDose / formulation.concentration_value).toFixed(2),
            unit: 'mL'
          };
        }
      }
    }

    // 4. Check breed-specific warnings
    let warnings = [];
    if (breed_id) {
      const warnResult = await pool.query(
        `SELECT bdw.*, b.name as breed_name
         FROM breed_drug_warnings bdw
         JOIN breeds b ON b.id = bdw.breed_id
         WHERE bdw.breed_id=$1 AND bdw.drug_id=$2`,
        [breed_id, drug_id]
      );
      warnings = warnResult.rows;
    }

    // 5. Get drug info
    const drugResult = await pool.query(`SELECT * FROM drugs WHERE id=$1`, [drug_id]);
    const drug = drugResult.rows[0];

    res.json({
      success: true,
      drug: { name: drug.name, class: drug.drug_class },
      patient: { species, weight_kg },
      calculation: {
        min_dose_mg: parseFloat(minDose.toFixed(3)),
        max_dose_mg: parseFloat(maxDose.toFixed(3)),
        recommended_dose_mg: parseFloat(recommendedDose.toFixed(3)),
      },
      administration: volumeResult,
      schedule: {
        route: dosage.route,
        frequency: dosage.frequency,
        duration_notes: dosage.duration_notes,
      },
      warnings: warnings,
      source: dosage.source
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during calculation.' });
  }
};

module.exports = { calculateDose };