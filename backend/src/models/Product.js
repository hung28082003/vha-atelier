const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Thông tin cơ bản
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true,
    maxlength: [100, 'Tên sản phẩm không được quá 100 ký tự']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả sản phẩm'],
    maxlength: [2000, 'Mô tả không được quá 2000 ký tự']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Mô tả ngắn không được quá 200 ký tự']
  },
  
  // Danh mục và thương hiệu
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Vui lòng chọn danh mục']
  },
  brand: {
    type: String,
    required: [true, 'Vui lòng nhập thương hiệu'],
    trim: true
  },
  
  // Giá cả
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá sản phẩm'],
    min: [0, 'Giá không được âm']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Giá gốc không được âm']
  },
  discount: {
    type: Number,
    min: [0, 'Giảm giá không được âm'],
    max: [100, 'Giảm giá không được quá 100%']
  },
  
  // Hình ảnh
  images: [{
    public_id: String,
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Biến thể sản phẩm (màu sắc, kích thước)
  variants: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['color', 'size', 'material'],
      required: true
    },
    value: {
      type: String,
      required: true
    },
    priceAdjustment: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Số lượng không được âm']
    },
    sku: String,
    image: {
      public_id: String,
      url: String
    }
  }],
  
  // Kích thước và màu sắc
  sizes: [{
    size: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Số lượng không được âm']
    },
    sku: String
  }],
  colors: [{
    name: {
      type: String,
      required: true
    },
    hex: {
      type: String,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Mã màu không hợp lệ']
    },
    image: {
      public_id: String,
      url: String
    }
  }],
  
  // Tồn kho
  stock: {
    type: Number,
    required: [true, 'Vui lòng nhập số lượng tồn kho'],
    min: [0, 'Số lượng không được âm']
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  trackStock: {
    type: Boolean,
    default: true
  },
  
  // Trạng thái sản phẩm
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'out_of_stock'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  
  // Thông tin vận chuyển
  weight: {
    type: Number,
    min: [0, 'Trọng lượng không được âm']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  shippingClass: {
    type: String,
    enum: ['standard', 'express', 'overnight'],
    default: 'standard'
  },
  
  // SEO
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title không được quá 60 ký tự']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description không được quá 160 ký tự']
  },
  metaKeywords: [String],
  
  // Thông tin bổ sung
  tags: [String],
  materials: [String],
  careInstructions: String,
  origin: String,
  
  // Thống kê
  viewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Đánh giá không được âm'],
    max: [5, 'Đánh giá không được quá 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ name: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ status: 1, isFeatured: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ tags: 1 });

// Text search index
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  tags: 'text'
});

// Middleware: Tạo slug từ name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Middleware: Update updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware: Tính toán discount
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    this.isOnSale = this.discount > 0;
  }
  next();
});

// Virtual fields
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0];
});

productSchema.virtual('isInStock').get(function() {
  return this.stock > 0 && this.status === 'active';
});

productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold && this.stock > 0;
});

productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.originalPrice * (1 - this.discount / 100);
  }
  return this.price;
});

// Instance methods
productSchema.methods.updateStock = function(quantity) {
  if (this.trackStock) {
    this.stock = Math.max(0, this.stock - quantity);
    if (this.stock === 0) {
      this.status = 'out_of_stock';
    }
  }
  return this.save();
};

productSchema.methods.addView = function() {
  this.viewCount += 1;
  return this.save();
};

productSchema.methods.updateRating = function(newRating) {
  const totalRating = this.averageRating * this.reviewCount;
  this.reviewCount += 1;
  this.averageRating = (totalRating + newRating) / this.reviewCount;
  return this.save();
};

productSchema.methods.getAvailableSizes = function() {
  return this.sizes.filter(size => size.stock > 0);
};

productSchema.methods.getAvailableColors = function() {
  return this.colors;
};

// Static methods
productSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, status: 'active' })
    .populate('category', 'name slug');
};

productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ 
    status: 'active', 
    isFeatured: true,
    stock: { $gt: 0 }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('category', 'name slug');
};

productSchema.statics.findNew = function(limit = 10) {
  return this.find({ 
    status: 'active', 
    isNew: true,
    stock: { $gt: 0 }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('category', 'name slug');
};

productSchema.statics.findOnSale = function(limit = 10) {
  return this.find({ 
    status: 'active', 
    isOnSale: true,
    stock: { $gt: 0 }
  })
  .sort({ discount: -1 })
  .limit(limit)
  .populate('category', 'name slug');
};

productSchema.statics.findByCategory = function(categoryId, limit = 20, page = 1) {
  const skip = (page - 1) * limit;
  return this.find({ 
    category: categoryId, 
    status: 'active',
    stock: { $gt: 0 }
  })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate('category', 'name slug');
};

productSchema.statics.searchProducts = function(query, limit = 20, page = 1) {
  const skip = (page - 1) * limit;
  return this.find({
    $text: { $search: query },
    status: 'active',
    stock: { $gt: 0 }
  })
  .sort({ score: { $meta: 'textScore' } })
  .skip(skip)
  .limit(limit)
  .populate('category', 'name slug');
};

productSchema.statics.getTopSelling = function(limit = 10) {
  return this.find({ 
    status: 'active',
    stock: { $gt: 0 }
  })
  .sort({ salesCount: -1 })
  .limit(limit)
  .populate('category', 'name slug');
};

module.exports = mongoose.model('Product', productSchema);
