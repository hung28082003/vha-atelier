const Product = require('../models/Product');
const Category = require('../models/Category');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { uploadProductImages } = require('../config/cloudinary');

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    sort = '-createdAt',
    category,
    minPrice,
    maxPrice,
    brand,
    status = 'active'
  } = req.query;

  // Build filter object
  const filter = { status };
  
  if (category) {
    filter.category = category;
  }
  
  if (brand) {
    filter.brand = new RegExp(brand, 'i');
  }
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('reviews.user', 'firstName lastName avatar');

  if (!product) {
    throw new AppError('Sản phẩm không tồn tại', 404);
  }

  // Increment view count
  await product.addView();

  res.json({
    success: true,
    data: { product }
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin/Moderator)
const createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;

  // Check if category exists
  const category = await Category.findById(productData.category);
  if (!category) {
    throw new AppError('Danh mục không tồn tại', 400);
  }

  // Create product
  const product = await Product.create(productData);

  // Update category product count
  await Category.findByIdAndUpdate(
    productData.category,
    { $inc: { productCount: 1 } }
  );

  res.status(201).json({
    success: true,
    message: 'Tạo sản phẩm thành công',
    data: { product }
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Moderator)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Sản phẩm không tồn tại', 404);
  }

  // Update product
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      product[key] = req.body[key];
    }
  });

  await product.save();

  res.json({
    success: true,
    message: 'Cập nhật sản phẩm thành công',
    data: { product }
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Sản phẩm không tồn tại', 404);
  }

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    const publicIds = product.images.map(img => img.public_id);
    const { deleteMultipleImages } = require('../config/cloudinary');
    await deleteMultipleImages(publicIds);
  }

  // Delete product
  await Product.findByIdAndDelete(req.params.id);

  // Update category product count
  await Category.findByIdAndUpdate(
    product.category,
    { $inc: { productCount: -1 } }
  );

  res.json({
    success: true,
    message: 'Xóa sản phẩm thành công'
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.findFeatured(parseInt(limit));

  res.json({
    success: true,
    data: { products }
  });
});

// @desc    Get new products
// @route   GET /api/products/new
// @access  Public
const getNewProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.findNew(parseInt(limit));

  res.json({
    success: true,
    data: { products }
  });
});

// @desc    Get products on sale
// @route   GET /api/products/sale
// @access  Public
const getOnSaleProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.findOnSale(parseInt(limit));

  res.json({
    success: true,
    data: { products }
  });
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 12 } = req.query;

  if (!q) {
    throw new AppError('Vui lòng nhập từ khóa tìm kiếm', 400);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.searchProducts(q, parseInt(limit), parseInt(page));

  const total = await Product.countDocuments({
    $text: { $search: q },
    status: 'active',
    stock: { $gt: 0 }
  });

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 12 } = req.query;

  const products = await Product.findByCategory(categoryId, parseInt(limit), parseInt(page));

  const total = await Product.countDocuments({
    category: categoryId,
    status: 'active',
    stock: { $gt: 0 }
  });

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: (parseInt(page) - 1) * parseInt(limit) + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
});

// @desc    Get top selling products
// @route   GET /api/products/top-selling
// @access  Public
const getTopSellingProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.getTopSelling(parseInt(limit));

  res.json({
    success: true,
    data: { products }
  });
});

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private (Admin/Moderator)
const updateProductStock = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Sản phẩm không tồn tại', 404);
  }

  product.stock = quantity;
  if (quantity === 0) {
    product.status = 'out_of_stock';
  } else if (product.status === 'out_of_stock') {
    product.status = 'active';
  }

  await product.save();

  res.json({
    success: true,
    message: 'Cập nhật tồn kho thành công',
    data: { product }
  });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Sản phẩm không tồn tại', 404);
  }

  // Check if user already reviewed this product
  const existingReview = product.reviews.find(
    review => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    throw new AppError('Bạn đã đánh giá sản phẩm này rồi', 400);
  }

  // Add review
  product.reviews.push({
    user: userId,
    rating,
    comment
  });

  // Update average rating
  await product.updateRating(rating);

  await product.save();

  res.status(201).json({
    success: true,
    message: 'Thêm đánh giá thành công',
    data: { product }
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewProducts,
  getOnSaleProducts,
  searchProducts,
  getProductsByCategory,
  getTopSellingProducts,
  updateProductStock,
  addProductReview
};
