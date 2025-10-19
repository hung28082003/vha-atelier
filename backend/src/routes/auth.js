const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const {
  authenticateToken,
  authenticateRefreshToken
} = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange,
  validateEmail,
  validatePasswordReset,
  validatePasswordResetConfirm
} = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/refresh-token', authenticateRefreshToken, refreshToken);
router.post('/forgot-password', validatePasswordReset, forgotPassword);
router.post('/reset-password', validatePasswordResetConfirm, resetPassword);
router.post('/verify-email', validateEmail, verifyEmail);
router.post('/resend-verification', validateEmail, resendVerification);

// Protected routes
router.use(authenticateToken); // Tất cả routes bên dưới cần authentication

router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', validateUserUpdate, updateProfile);
router.put('/change-password', validatePasswordChange, changePassword);

module.exports = router;
