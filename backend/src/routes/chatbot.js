const express = require('express');
const router = express.Router();
const {
  startConversation,
  sendMessage,
  getConversationHistory,
  getUserConversations,
  updateUserPreferences,
  getProductRecommendations,
  endConversation,
  getChatbotStats
} = require('../controllers/chatbotController');
const {
  authenticateToken,
  requireAdmin
} = require('../middleware/auth');

// Protected routes (User authentication required)
router.use(authenticateToken);

// User routes
router.post('/start', startConversation);
router.post('/message', sendMessage);
router.get('/history', getConversationHistory);
router.get('/conversations', getUserConversations);
router.put('/preferences', updateUserPreferences);
router.get('/recommendations', getProductRecommendations);
router.post('/end', endConversation);

// Admin routes
router.get('/stats', requireAdmin, getChatbotStats);

module.exports = router;
