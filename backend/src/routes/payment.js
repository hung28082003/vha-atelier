const express = require('express');
const router = express.Router();
const {
  generatePaymentQR,
  generateBankTransferQR,
  generatePaymentInstructions,
  verifyPayment,
  generatePaymentSummary,
  isPaymentExpired,
  generatePaymentReceipt
} = require('../utils/qrPayment');
const {
  authenticateToken,
  requireAdmin
} = require('../middleware/auth');
const {
  validateObjectId
} = require('../middleware/validation');
const Order = require('../models/Order');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Generate payment QR code for order
// @route   POST /api/payment/:orderId/qr
// @access  Private
const generateOrderPaymentQR = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentMethod = 'qr_code' } = req.body;

  const order = await Order.findById(orderId)
    .populate('user', 'firstName lastName email');

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Check if user can access this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Không có quyền truy cập đơn hàng này', 403);
  }

  // Check if payment is expired
  if (isPaymentExpired(order)) {
    throw new AppError('Mã thanh toán đã hết hạn', 400);
  }

  // Check if already paid
  if (order.paymentStatus === 'paid') {
    throw new AppError('Đơn hàng đã được thanh toán', 400);
  }

  let qrData;
  
  if (paymentMethod === 'qr_code') {
    qrData = await generatePaymentQR(order);
  } else if (paymentMethod === 'bank_transfer') {
    qrData = await generateBankTransferQR(order);
  } else {
    throw new AppError('Phương thức thanh toán không được hỗ trợ', 400);
  }

  // Update order with QR code data
  order.paymentDetails.qrCode = qrData.qrCodeDataURL;
  order.paymentMethod = paymentMethod;
  await order.save();

  const paymentInstructions = generatePaymentInstructions(order, paymentMethod);
  const paymentSummary = generatePaymentSummary(order);

  res.json({
    success: true,
    message: 'Tạo mã thanh toán thành công',
    data: {
      qrCode: qrData.qrCodeDataURL,
      paymentData: qrData.paymentData,
      instructions: paymentInstructions,
      summary: paymentSummary,
      expiresAt: qrData.expiresAt
    }
  });
});

// @desc    Verify payment
// @route   POST /api/payment/:orderId/verify
// @access  Private
const verifyOrderPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { transactionId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Check if user can access this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Không có quyền truy cập đơn hàng này', 403);
  }

  // Check if already paid
  if (order.paymentStatus === 'paid') {
    throw new AppError('Đơn hàng đã được thanh toán', 400);
  }

  // Verify payment
  const verificationResult = await verifyPayment(order.orderNumber, transactionId);

  if (verificationResult.success) {
    // Mark order as paid
    await order.markAsPaid(transactionId);
    
    // Update order status
    await order.updateStatus('confirmed', 'Thanh toán thành công');

    const receipt = generatePaymentReceipt(order, verificationResult);

    res.json({
      success: true,
      message: 'Xác minh thanh toán thành công',
      data: {
        order: order,
        receipt: receipt
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: verificationResult.message
    });
  }
});

// @desc    Get payment status
// @route   GET /api/payment/:orderId/status
// @access  Private
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Check if user can access this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Không có quyền truy cập đơn hàng này', 403);
  }

  const paymentSummary = generatePaymentSummary(order);
  const isExpired = isPaymentExpired(order);

  res.json({
    success: true,
    data: {
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      summary: paymentSummary,
      isExpired: isExpired,
      qrCode: order.paymentDetails.qrCode,
      paidAt: order.paymentDetails.paidAt,
      transactionId: order.paymentDetails.transactionId
    }
  });
});

// @desc    Get payment receipt
// @route   GET /api/payment/:orderId/receipt
// @access  Private
const getPaymentReceipt = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name images');

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Check if user can access this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Không có quyền truy cập đơn hàng này', 403);
  }

  // Check if order is paid
  if (order.paymentStatus !== 'paid') {
    throw new AppError('Đơn hàng chưa được thanh toán', 400);
  }

  const receipt = generatePaymentReceipt(order, order.paymentDetails);

  res.json({
    success: true,
    data: { receipt }
  });
});

// @desc    Cancel payment
// @route   POST /api/payment/:orderId/cancel
// @access  Private
const cancelPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Check if user can access this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Không có quyền truy cập đơn hàng này', 403);
  }

  // Check if already paid
  if (order.paymentStatus === 'paid') {
    throw new AppError('Không thể hủy thanh toán đã hoàn thành', 400);
  }

  // Cancel payment
  order.paymentStatus = 'failed';
  order.paymentDetails.qrCode = null;
  await order.save();

  // Update order status
  await order.updateStatus('cancelled', reason || 'Hủy thanh toán');

  res.json({
    success: true,
    message: 'Hủy thanh toán thành công'
  });
});

// Protected routes
router.use(authenticateToken);

router.post('/:orderId/qr', validateObjectId('orderId'), generateOrderPaymentQR);
router.post('/:orderId/verify', validateObjectId('orderId'), verifyOrderPayment);
router.get('/:orderId/status', validateObjectId('orderId'), getPaymentStatus);
router.get('/:orderId/receipt', validateObjectId('orderId'), getPaymentReceipt);
router.post('/:orderId/cancel', validateObjectId('orderId'), cancelPayment);

module.exports = router;
