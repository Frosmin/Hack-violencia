const express = require('express');
const router = express.Router();
const { createEvidenceController } = require('../controllers/evidenceController');

router.post('/upload', createEvidenceController);

module.exports = router;