const express = require('express');
const router = express.Router();
const { calculateDose } = require('../controllers/calculatorController');

router.post('/dose', calculateDose);

module.exports = router;