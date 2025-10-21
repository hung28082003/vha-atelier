const Category = require('../models/Category');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, parent } = req.query;

  const filter = { isActive: true };
  if (parent !== undefined) {
    filter.parent = parent === 'null' ? null : parent;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const categories = await Category.find(filter)
    .populate('parent', 'name slug')
    .sort({ sortOrder: 1, name: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Category.countDocuments(filter);

  res.json({
    success: true,
    data: {
      categories,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalCategories: total,
        hasNext: skip + categories.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
    .populate('parent', 'name slug')
    .populate('children', 'name slug image productCount');

  if (!category) {
    throw new AppError('Danh mục không tồn tại', 404);
  }

  // Increment view count
  category.viewCount += 1;
  await category.save();

  res.json({
    success: true,
    data: { category }
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin/Moderator)
const createCategory = asyncHandler(async (req, res) => {
  const categoryData = req.body;

  // Check if parent category exists (if provided)
  if (categoryData.parent) {
    const parentCategory = await Category.findById(categoryData.parent);
    if (!parentCategory) {
      throw new AppError('Danh mục cha không tồn tại', 400);
    }
  }

  // Check if category name already exists
  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') }
  });

  if (existingCategory) {
    throw new AppError('Tên danh mục đã tồn tại', 400);
  }

  const category = await Category.create(categoryData);

  res.status(201).json({
    success: true,
    message: 'Tạo danh mục thành công',
    data: { category }
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin/Moderator)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new AppError('Danh mục không tồn tại', 404);
  }

  // Check if parent category exists (if being updated)
  if (req.body.parent && req.body.parent !== category.parent?.toString()) {
    const parentCategory = await Category.findById(req.body.parent);
    if (!parentCategory) {
      throw new AppError('Danh mục cha không tồn tại', 400);
    }

    // Prevent setting parent to self or descendant
    if (req.body.parent === req.params.id) {
      throw new AppError('Không thể đặt danh mục cha là chính nó', 400);
    }

    const descendants = await category.getDescendants();
    const isDescendant = descendants.some(desc => desc._id.toString() === req.body.parent);
    if (isDescendant) {
      throw new AppError('Không thể đặt danh mục cha là danh mục con', 400);
    }
  }

  // Check if category name already exists (if being updated)
  if (req.body.name && req.body.name !== category.name) {
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
      _id: { $ne: req.params.id }
    });

    if (existingCategory) {
      throw new AppError('Tên danh mục đã tồn tại', 400);
    }
  }

  // Update category
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      category[key] = req.body[key];
    }
  });

  await category.save();

  res.json({
    success: true,
    message: 'Cập nhật danh mục thành công',
    data: { category }
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new AppError('Danh mục không tồn tại', 404);
  }

  // Check if category has products
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    throw new AppError('Không thể xóa danh mục có sản phẩm', 400);
  }

  // Check if category has children
  const childrenCount = await Category.countDocuments({ parent: req.params.id });
  if (childrenCount > 0) {
    throw new AppError('Không thể xóa danh mục có danh mục con', 400);
  }

  // Delete category image from Cloudinary if exists
  if (category.image && category.image.public_id) {
    const { deleteImage } = require('../config/cloudinary');
    await deleteImage(category.image.public_id);
  }

  await Category.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Xóa danh mục thành công'
  });
});

// @desc    Get category tree
// @route   GET /api/categories/tree
// @access  Public
const getCategoryTree = asyncHandler(async (req, res) => {
  const categoryTree = await Category.getCategoryTree();

  res.json({
    success: true,
    data: { categories: categoryTree }
  });
});

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
const getFeaturedCategories = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const categories = await Category.findFeatured(parseInt(limit));

  res.json({
    success: true,
    data: { categories }
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getFeaturedCategories
};
