const express = require('express');
const router = express.Router();
const { login, refreshToken, logout } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validateRequest.middleware');
const { loginSchema } = require('../validators/auth.validator');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;
