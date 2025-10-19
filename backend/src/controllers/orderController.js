const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin/Moderator)
const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, paymentStatus } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(filter)
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNext: skip + orders.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name images price')
    .populate('coupon', 'code discount');

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Check if user can access this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Không có quyền truy cập đơn hàng này', 403);
  }

  res.json({
    success: true,
    data: { order }
  });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;

  // Validate items and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      throw new AppError(`Sản phẩm ${item.product} không tồn tại`, 400);
    }

    if (product.status !== 'active') {
      throw new AppError(`Sản phẩm ${product.name} không khả dụng`, 400);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Không đủ hàng cho sản phẩm ${product.name}`, 400);
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: product.primaryImage,
      sku: product.sku
    });
  }

  // Calculate shipping cost
  const shippingCost = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500k

  // Calculate total
  const total = subtotal + shippingCost;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingCost,
    total,
    notes: {
      customer: notes
    }
  });

  // Update product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: -item.quantity, salesCount: item.quantity } }
    );
  }

  // Clear user's cart
  const cart = await Cart.findByUser(req.user._id);
  if (cart) {
    await cart.clear();
  }

  // Update user statistics
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { totalOrders: 1, totalSpent: total }
  });

  // Generate QR code for payment if needed
  if (paymentMethod === 'qr_code') {
    await order.generateQRCode();
  }

  // Populate order for response
  const populatedOrder = await Order.findById(order._id)
    .populate('items.product', 'name images')
    .populate('user', 'firstName lastName email');

  res.status(201).json({
    success: true,
    message: 'Tạo đơn hàng thành công',
    data: { order: populatedOrder }
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Moderator)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Update order status
  await order.updateStatus(status, note, req.user._id);

  // Populate order for response
  const updatedOrder = await Order.findById(order._id)
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name images');

  res.json({
    success: true,
    message: 'Cập nhật trạng thái đơn hàng thành công',
    data: { order: updatedOrder }
  });
});

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Check if user can cancel this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Không có quyền hủy đơn hàng này', 403);
  }

  // Cancel order
  await order.cancel(reason);

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity, salesCount: -item.quantity } }
    );
  }

  // Update user statistics
  await User.findByIdAndUpdate(order.user, {
    $inc: { totalOrders: -1, totalSpent: -order.total }
  });

  res.json({
    success: true,
    message: 'Hủy đơn hàng thành công'
  });
});

// @desc    Return order
// @route   POST /api/orders/:id/return
// @access  Private
const returnOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Check if user can return this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Không có quyền trả hàng cho đơn hàng này', 403);
  }

  // Return order
  await order.return(reason);

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity, salesCount: -item.quantity } }
    );
  }

  res.json({
    success: true,
    message: 'Yêu cầu trả hàng đã được gửi'
  });
});

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(filter)
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNext: skip + orders.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
});

// @desc    Generate payment QR code
// @route   POST /api/orders/:id/payment-qr
// @access  Private
const generatePaymentQR = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Đơn hàng không tồn tại', 404);
  }

  // Check if user can access this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Không có quyền truy cập đơn hàng này', 403);
  }

  // Generate QR code
  await order.generateQRCode();

  res.json({
    success: true,
    message: 'Tạo mã QR thanh toán thành công',
    data: { 
      qrCode: order.paymentDetails.qrCode,
      amount: order.total,
      orderNumber: order.orderNumber
    }
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats/overview
// @access  Private (Admin)
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.getOrderStats();

  // Get recent orders
  const recentOrders = await Order.find()
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      stats,
      recentOrders
    }
  });
});

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  returnOrder,
  getUserOrders,
  generatePaymentQR,
  getOrderStats
};
