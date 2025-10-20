const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
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
router.get('/profile', protect, getProfile);
router.put('/profile', protect, [
  body('name').optional().isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
  body('phone').optional().isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Giới tính không hợp lệ')
], updateProfile);

// Password routes
router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Mật khẩu hiện tại là bắt buộc'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
], changePassword);

// Orders routes
router.get('/orders', protect, getUserOrders);

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

// Address routes
router.get('/addresses', protect, getUserAddresses);
router.post('/addresses', protect, [
  body('name').notEmpty().withMessage('Tên người nhận là bắt buộc'),
  body('phone').isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('address').notEmpty().withMessage('Địa chỉ là bắt buộc'),
  body('city').notEmpty().withMessage('Thành phố là bắt buộc'),
  body('district').notEmpty().withMessage('Quận/Huyện là bắt buộc'),
  body('ward').notEmpty().withMessage('Phường/Xã là bắt buộc')
], addUserAddress);
router.put('/addresses/:addressId', protect, [
  body('name').notEmpty().withMessage('Tên người nhận là bắt buộc'),
  body('phone').isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('address').notEmpty().withMessage('Địa chỉ là bắt buộc'),
  body('city').notEmpty().withMessage('Thành phố là bắt buộc'),
  body('district').notEmpty().withMessage('Quận/Huyện là bắt buộc'),
  body('ward').notEmpty().withMessage('Phường/Xã là bắt buộc')
], updateUserAddress);
router.delete('/addresses/:addressId', protect, deleteUserAddress);

module.exports = router;
