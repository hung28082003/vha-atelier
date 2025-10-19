const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  returnOrder,
  getOrderStats,
  getUserOrders,
  generatePaymentQR
} = require('../controllers/orderController');
const {
  authenticateToken,
  requireAdmin,
  requireAdminOrModerator,
  requireOwnership
} = require('../middleware/auth');
const {
  validateOrder,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

// Protected routes (User authentication required)
router.use(authenticateToken);

// User routes
router.get('/my-orders', validatePagination, getUserOrders);
router.get('/:id', validateObjectId('id'), getOrder);
router.post('/', validateOrder, createOrder);
router.post('/:id/cancel', validateObjectId('id'), cancelOrder);
router.post('/:id/return', validateObjectId('id'), returnOrder);
router.post('/:id/payment-qr', validateObjectId('id'), generatePaymentQR);

// Admin/Moderator routes
router.get('/', validatePagination, requireAdminOrModerator, getOrders);
router.put('/:id/status', validateObjectId('id'), requireAdminOrModerator, updateOrderStatus);
router.get('/stats/overview', requireAdmin, getOrderStats);

module.exports = router;
