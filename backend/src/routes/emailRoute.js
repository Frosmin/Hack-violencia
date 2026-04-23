const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send', emailController.sendEmail);

module.exports = router;