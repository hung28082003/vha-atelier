const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const ChatbotConversation = require('../models/ChatbotConversation');

// Dashboard Stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  
  // Calculate total revenue
  const revenueResult = await Order.aggregate([
    { $match: { status: { $in: ['delivered', 'shipped'] } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // Get recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('orderNumber user totalAmount status createdAt');

  // Get monthly stats for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      monthlyStats
    }
  });
});

// Users Management
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  if (req.query.role) {
    filter.role = req.query.role;
  }
  if (req.query.status !== undefined) {
    filter.isActive = req.query.status === 'active';
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select('-password');
  
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  res.json({
    success: true,
    data: user
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  // Remove password from update data if present
  delete updateData.password;

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  res.json({
    success: true,
    data: user
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  // Check if user has orders
  const userOrders = await Order.countDocuments({ user: userId });
  if (userOrders > 0) {
    throw new AppError('Không thể xóa người dùng đã có đơn hàng', 400);
  }

  await User.findByIdAndDelete(userId);

  res.json({
    success: true,
    message: 'Xóa người dùng thành công'
  });
});

// Products Management
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.status !== undefined) {
    filter.isActive = req.query.status === 'active';
  }

  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId)
    .populate('category', 'name');

  if (!product) {
    throw new AppError('Không tìm thấy sản phẩm', 404);
  }

  res.json({
    success: true,
    data: product
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;

  // Validate category exists
  if (productData.category) {
    const category = await Category.findById(productData.category);
    if (!category) {
      throw new AppError('Danh mục không tồn tại', 400);
    }
  }

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    data: product
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updateData = req.body;

  // Validate category exists if provided
  if (updateData.category) {
    const category = await Category.findById(updateData.category);
    if (!category) {
      throw new AppError('Danh mục không tồn tại', 400);
    }
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true }
  ).populate('category', 'name');

  if (!product) {
    throw new AppError('Không tìm thấy sản phẩm', 404);
  }

  res.json({
    success: true,
    data: product
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Không tìm thấy sản phẩm', 404);
  }

  // Check if product has orders
  const productOrders = await Order.countDocuments({
    'items.product': productId
  });
  if (productOrders > 0) {
    throw new AppError('Không thể xóa sản phẩm đã có đơn hàng', 400);
  }

  await Product.findByIdAndDelete(productId);

  res.json({
    success: true,
    message: 'Xóa sản phẩm thành công'
  });
});

// Orders Management
const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.search) {
    filter.$or = [
      { orderNumber: { $regex: req.query.search, $options: 'i' } },
      { 'user.name': { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('user', 'name email phone')
    .populate('items.product', 'name images price');

  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }

  res.json({
    success: true,
    data: order
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Trạng thái đơn hàng không hợp lệ', 400);
  }

  const updateData = { status };
  if (notes) {
    updateData.adminNotes = notes;
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    updateData,
    { new: true, runValidators: true }
  ).populate('user', 'name email');

  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }

  res.json({
    success: true,
    data: order
  });
});

// Chatbot Management
const getChatbotConversations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const conversations = await ChatbotConversation.find()
    .populate('user', 'name email')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await ChatbotConversation.countDocuments();

  res.json({
    success: true,
    data: {
      conversations,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

// System Settings
const getSystemSettings = asyncHandler(async (req, res) => {
  // For now, return default settings
  // In a real app, you'd store these in a database
  const settings = {
    siteName: 'VHA Atelier',
    siteDescription: 'Thời trang cao cấp',
    maintenanceMode: false,
    allowRegistration: true,
    chatbotEnabled: true,
    chatbotWelcomeMessage: 'Xin chào! Tôi có thể giúp gì cho bạn?',
    emailNotifications: true,
    smsNotifications: false
  };

  res.json({
    success: true,
    data: settings
  });
});

const updateSystemSettings = asyncHandler(async (req, res) => {
  // For now, just return the updated settings
  // In a real app, you'd save these to a database
  const settings = req.body;

  res.json({
    success: true,
    data: settings
  });
});

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getChatbotConversations,
  getSystemSettings,
  updateSystemSettings
};