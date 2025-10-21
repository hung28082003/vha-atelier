const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByUser(req.user._id);

  if (!cart) {
    // Create new cart if doesn't exist
    const newCart = await Cart.create({ user: req.user._id, items: [] });
    return res.json({
      success: true,
      data: { cart: newCart }
    });
  }

  // Get items with product details
  const itemsWithDetails = await cart.getItemsWithDetails();

  res.json({
    success: true,
    data: { 
      cart: {
        ...cart.toObject(),
        items: itemsWithDetails
      }
    }
  });
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { product, quantity = 1, size, color } = req.body;

  // Get or create cart
  const cart = await Cart.findOrCreateByUser(req.user._id);

  // Add item to cart
  await cart.addItem(product, quantity, size, color);

  // Get updated cart with product details
  const itemsWithDetails = await cart.getItemsWithDetails();

  res.json({
    success: true,
    message: 'Thêm sản phẩm vào giỏ hàng thành công',
    data: { 
      cart: {
        ...cart.toObject(),
        items: itemsWithDetails
      }
    }
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findByUser(req.user._id);

  if (!cart) {
    throw new AppError('Giỏ hàng không tồn tại', 404);
  }

  // Update item quantity
  await cart.updateItemQuantity(itemId, quantity);

  // Get updated cart with product details
  const itemsWithDetails = await cart.getItemsWithDetails();

  res.json({
    success: true,
    message: 'Cập nhật giỏ hàng thành công',
    data: { 
      cart: {
        ...cart.toObject(),
        items: itemsWithDetails
      }
    }
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findByUser(req.user._id);

  if (!cart) {
    throw new AppError('Giỏ hàng không tồn tại', 404);
  }

  // Remove item
  await cart.removeItem(itemId);

  // Get updated cart with product details
  const itemsWithDetails = await cart.getItemsWithDetails();

  res.json({
    success: true,
    message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
    data: { 
      cart: {
        ...cart.toObject(),
        items: itemsWithDetails
      }
    }
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByUser(req.user._id);

  if (!cart) {
    throw new AppError('Giỏ hàng không tồn tại', 404);
  }

  // Clear cart
  await cart.clear();

  res.json({
    success: true,
    message: 'Xóa tất cả sản phẩm khỏi giỏ hàng thành công',
    data: { cart }
  });
});

// @desc    Merge guest cart with user cart
// @route   POST /api/cart/merge
// @access  Private
const mergeCarts = asyncHandler(async (req, res) => {
  const { guestCartItems } = req.body;

  if (!guestCartItems || !Array.isArray(guestCartItems)) {
    throw new AppError('Dữ liệu giỏ hàng không hợp lệ', 400);
  }

  // Merge carts
  const cart = await Cart.mergeCarts(req.user._id, guestCartItems);

  // Get updated cart with product details
  const itemsWithDetails = await cart.getItemsWithDetails();

  res.json({
    success: true,
    message: 'Gộp giỏ hàng thành công',
    data: { 
      cart: {
        ...cart.toObject(),
        items: itemsWithDetails
      }
    }
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCarts
};
