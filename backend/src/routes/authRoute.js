const express = require('express');
const router = express.Router();
const {
  registerController,
  loginController,
  joinOrganizationController,
  currentSessionController,
} = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/join-organization', requireAuth, joinOrganizationController);
router.get('/me', requireAuth, currentSessionController);

module.exports = router;
