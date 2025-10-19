const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCarts
} = require('../controllers/cartController');
const {
  authenticateToken
} = require('../middleware/auth');
const {
  validateCartItem,
  validateObjectId
} = require('../middleware/validation');

// Protected routes (User authentication required)
router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', validateCartItem, addToCart);
router.put('/items/:itemId', validateObjectId('itemId'), updateCartItem);
router.delete('/items/:itemId', validateObjectId('itemId'), removeFromCart);
router.delete('/clear', clearCart);
router.post('/merge', mergeCarts);

module.exports = router;
