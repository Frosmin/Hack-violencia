// backend/src/routes/evidenceRoute.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createEvidenceController, getEvidencesController } = require('../controllers/evidenceController');
const { requireAuth } = require('../middlewares/authMiddleware');


const upload = multer({ storage: multer.memoryStorage() });


router.post('/upload', requireAuth, upload.single('image'), createEvidenceController);


router.get('/list', requireAuth, getEvidencesController);

module.exports = router;