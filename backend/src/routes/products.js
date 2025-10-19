const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/productController');
const {
  authenticateToken,
  requireAdmin,
  requireAdminOrModerator,
  optionalAuth
} = require('../middleware/auth');
const {
  validateProduct,
  validateProductUpdate,
  validateObjectId,
  validatePagination,
  validateSearch
} = require('../middleware/validation');

// Public routes
router.get('/', validatePagination, validateSearch, optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/sale', getOnSaleProducts);
router.get('/top-selling', getTopSellingProducts);
router.get('/search', validateSearch, validatePagination, optionalAuth, searchProducts);
router.get('/category/:categoryId', validateObjectId('categoryId'), validatePagination, getProductsByCategory);
router.get('/:id', validateObjectId('id'), optionalAuth, getProduct);

// Protected routes (Admin/Moderator only)
router.use(authenticateToken);
router.use(requireAdminOrModerator);

router.post('/', validateProduct, createProduct);
router.put('/:id', validateObjectId('id'), validateProductUpdate, updateProduct);
router.delete('/:id', validateObjectId('id'), requireAdmin, deleteProduct);
router.patch('/:id/stock', validateObjectId('id'), updateProductStock);

// User routes (for reviews)
router.post('/:id/reviews', validateObjectId('id'), addProductReview);

module.exports = router;
