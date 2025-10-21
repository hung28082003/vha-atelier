const { validationResult, body } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Họ và tên phải từ 2-50 ký tự'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Giới tính không hợp lệ'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc'),
  handleValidationErrors
];

// User update validation
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Họ và tên phải từ 2-50 ký tự'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Giới tính không hợp lệ'),
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mật khẩu hiện tại là bắt buộc'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Xác nhận mật khẩu không khớp');
      }
      return true;
    }),
  handleValidationErrors
];

// Email validation
const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  handleValidationErrors
];

// Password reset confirm validation
const validatePasswordResetConfirm = [
  body('token')
    .notEmpty()
    .withMessage('Token là bắt buộc'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Xác nhận mật khẩu không khớp');
      }
      return true;
    }),
  handleValidationErrors
];

// Object ID validation
const validateObjectId = (paramName = 'id') => [
  body(paramName).isMongoId().withMessage('ID không hợp lệ'),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Trang phải là số nguyên dương'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Giới hạn phải từ 1-100'),
  handleValidationErrors
];

// Search validation
const validateSearch = [
  body('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Từ khóa tìm kiếm phải từ 1-100 ký tự'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Danh mục không hợp lệ'),
  body('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá tối thiểu phải >= 0'),
  body('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá tối đa phải >= 0'),
  body('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'newest', 'oldest', 'popular'])
    .withMessage('Sắp xếp không hợp lệ'),
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên sản phẩm phải từ 1-100 ký tự'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mô tả phải từ 10-1000 ký tự'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Giá phải >= 0'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Số lượng phải >= 0'),
  body('category')
    .isMongoId()
    .withMessage('Danh mục không hợp lệ'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Thương hiệu không quá 50 ký tự'),
  body('sizes')
    .optional()
    .isArray()
    .withMessage('Kích thước phải là mảng'),
  body('colors')
    .optional()
    .isArray()
    .withMessage('Màu sắc phải là mảng'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags phải là mảng'),
  handleValidationErrors
];

// Product update validation
const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên sản phẩm phải từ 1-100 ký tự'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mô tả phải từ 10-1000 ký tự'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá phải >= 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Số lượng phải >= 0'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Danh mục không hợp lệ'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Thương hiệu không quá 50 ký tự'),
  body('sizes')
    .optional()
    .isArray()
    .withMessage('Kích thước phải là mảng'),
  body('colors')
    .optional()
    .isArray()
    .withMessage('Màu sắc phải là mảng'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags phải là mảng'),
  handleValidationErrors
];

// Category validation
const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tên danh mục phải từ 1-50 ký tự'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Mô tả không quá 200 ký tự'),
  body('parent')
    .optional()
    .isMongoId()
    .withMessage('Danh mục cha không hợp lệ'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Trạng thái phải là boolean'),
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
  body('items.*.product')
    .isMongoId()
    .withMessage('ID sản phẩm không hợp lệ'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Số lượng phải >= 1'),
  body('shippingAddress')
    .isObject()
    .withMessage('Địa chỉ giao hàng là bắt buộc'),
  body('shippingAddress.fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên người nhận phải từ 2-50 ký tự'),
  body('shippingAddress.phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('shippingAddress.address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Địa chỉ phải từ 10-200 ký tự'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Thành phố phải từ 2-50 ký tự'),
  body('shippingAddress.district')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Quận/huyện phải từ 2-50 ký tự'),
  body('shippingAddress.ward')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Phường/xã phải từ 2-50 ký tự'),
  body('paymentMethod')
    .isIn(['qr_code', 'cod'])
    .withMessage('Phương thức thanh toán không hợp lệ'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Ghi chú không quá 500 ký tự'),
  handleValidationErrors
];

// Address validation
const validateAddress = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên người nhận phải từ 2-50 ký tự'),
  body('phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Địa chỉ phải từ 10-200 ký tự'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Thành phố phải từ 2-50 ký tự'),
  body('district')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Quận/huyện phải từ 2-50 ký tự'),
  body('ward')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Phường/xã phải từ 2-50 ký tự'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('Địa chỉ mặc định phải là boolean'),
  handleValidationErrors
];

// Payment validation
const validatePayment = [
  body('orderId')
    .isMongoId()
    .withMessage('ID đơn hàng không hợp lệ'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Số tiền phải >= 0'),
  body('method')
    .isIn(['qr_code', 'cod'])
    .withMessage('Phương thức thanh toán không hợp lệ'),
  handleValidationErrors
];

// Cart item validation
const validateCartItem = [
  body('product')
    .isMongoId()
    .withMessage('ID sản phẩm không hợp lệ'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Số lượng phải >= 1'),
  body('size')
    .optional()
    .isString()
    .isLength({ min: 1, max: 10 })
    .withMessage('Kích thước không hợp lệ'),
  body('color')
    .optional()
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('Màu sắc không hợp lệ'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange,
  validateEmail,
  validatePasswordReset,
  validatePasswordResetConfirm,
  validateObjectId,
  validatePagination,
  validateSearch,
  validateProduct,
  validateProductUpdate,
  validateCategory,
  validateOrder,
  validateAddress,
  validatePayment,
  validateCartItem
};