const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  getUserOrders,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress
} = require('../controllers/userController');

// Profile routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, [
  body('name').optional().isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
  body('phone').optional().isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Giới tính không hợp lệ')
], updateProfile);

// Password routes
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Mật khẩu hiện tại là bắt buộc'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
], changePassword);

// Orders routes
router.get('/orders', authenticateToken, getUserOrders);

// Wishlist routes
router.get('/wishlist', authenticateToken, getWishlist);
router.post('/wishlist/:productId', authenticateToken, addToWishlist);
router.delete('/wishlist/:productId', authenticateToken, removeFromWishlist);

// Address routes
router.get('/addresses', authenticateToken, getUserAddresses);
router.post('/addresses', authenticateToken, [
  body('name').notEmpty().withMessage('Tên người nhận là bắt buộc'),
  body('phone').isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('address').notEmpty().withMessage('Địa chỉ là bắt buộc'),
  body('city').notEmpty().withMessage('Thành phố là bắt buộc'),
  body('district').notEmpty().withMessage('Quận/Huyện là bắt buộc'),
  body('ward').notEmpty().withMessage('Phường/Xã là bắt buộc')
], addUserAddress);
router.put('/addresses/:addressId', authenticateToken, [
  body('name').notEmpty().withMessage('Tên người nhận là bắt buộc'),
  body('phone').isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('address').notEmpty().withMessage('Địa chỉ là bắt buộc'),
  body('city').notEmpty().withMessage('Thành phố là bắt buộc'),
  body('district').notEmpty().withMessage('Quận/Huyện là bắt buộc'),
  body('ward').notEmpty().withMessage('Phường/Xã là bắt buộc')
], updateUserAddress);
router.delete('/addresses/:addressId', authenticateToken, deleteUserAddress);

module.exports = router;
