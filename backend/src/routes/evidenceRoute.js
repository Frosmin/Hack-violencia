// backend/src/routes/evidenceRoute.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createEvidenceController } = require('../controllers/evidenceController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Configurar multer para almacenar el archivo temporalmente en la memoria
const upload = multer({ storage: multer.memoryStorage() });

// Aplicar requireAuth para proteger la ruta y upload.single('image') para la imagen
router.post('/upload', requireAuth, upload.single('image'), createEvidenceController);

module.exports = router;