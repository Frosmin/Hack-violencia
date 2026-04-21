const express = require('express');
const router = express.Router();
const llmController = require('../controllers/llmController');
const multer = require('multer');


const upload = multer({ storage: multer.memoryStorage() });

router.post('/ask-photo', upload.single('image'),  llmController.askLLMPhoto);

module.exports = router;