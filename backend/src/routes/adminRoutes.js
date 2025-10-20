const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProducts,
  getOrders,
  updateOrderStatus,
  getChatbotConversations,
  getSystemSettings,
  updateSystemSettings
} = require('../controllers/adminController');

// Apply admin authentication to all routes
router.use(authenticateToken, requireAdmin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', [
  body('name').optional().isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
  body('email').optional().isEmail().withMessage('Email không hợp lệ'),
  body('role').optional().isIn(['user', 'admin', 'moderator']).withMessage('Vai trò không hợp lệ'),
  body('isActive').optional().isBoolean().withMessage('Trạng thái phải là boolean')
], updateUser);
router.delete('/users/:id', deleteUser);

// Product management routes
router.get('/products', getProducts);

// Order management routes
router.get('/orders', getOrders);
router.put('/orders/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Trạng thái không hợp lệ'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Ghi chú không được quá 500 ký tự')
], updateOrderStatus);

// Chatbot management routes
router.get('/chatbot/conversations', getChatbotConversations);

// System settings routes
router.get('/settings', getSystemSettings);
router.put('/settings', [
  body('siteName').optional().isLength({ min: 1, max: 100 }).withMessage('Tên website phải từ 1-100 ký tự'),
  body('siteDescription').optional().isLength({ max: 500 }).withMessage('Mô tả không được quá 500 ký tự'),
  body('maintenanceMode').optional().isBoolean().withMessage('Chế độ bảo trì phải là boolean'),
  body('allowRegistration').optional().isBoolean().withMessage('Cho phép đăng ký phải là boolean'),
  body('chatbotEnabled').optional().isBoolean().withMessage('Chatbot phải là boolean'),
  body('chatbotWelcomeMessage').optional().isLength({ max: 200 }).withMessage('Tin nhắn chào không được quá 200 ký tự'),
  body('emailNotifications').optional().isBoolean().withMessage('Thông báo email phải là boolean'),
  body('smsNotifications').optional().isBoolean().withMessage('Thông báo SMS phải là boolean')
], updateSystemSettings);

module.exports = router;
