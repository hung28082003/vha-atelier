const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên danh mục'],
    trim: true,
    unique: true,
    maxlength: [50, 'Tên danh mục không được quá 50 ký tự']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Mô tả không được quá 500 ký tự']
  },
  
  // Hình ảnh
  image: {
    public_id: String,
    url: String
  },
  
  // Phân cấp danh mục
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  path: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Thông tin hiển thị
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
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
  
  // Thống kê
  productCount: {
    type: Number,
    default: 0
  },
  viewCount: {
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
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, sortOrder: 1 });
categorySchema.index({ isFeatured: 1 });

// Middleware: Tạo slug từ name
categorySchema.pre('save', function(next) {
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
categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware: Update level và path
categorySchema.pre('save', async function(next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
        this.path = [...parentCategory.path, this.parent];
      }
    } else {
      this.level = 0;
      this.path = [];
    }
  }
  next();
});

// Virtual fields
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Instance methods
categorySchema.methods.getFullPath = function() {
  return this.path.map(id => id.toString());
};

categorySchema.methods.isChildOf = function(categoryId) {
  return this.path.includes(categoryId);
};

categorySchema.methods.getAncestors = async function() {
  if (this.path.length === 0) return [];
  
  return await this.constructor.find({
    _id: { $in: this.path }
  }).sort({ level: 1 });
};

categorySchema.methods.getDescendants = async function() {
  return await this.constructor.find({
    path: this._id
  }).sort({ level: 1, sortOrder: 1 });
};

// Static methods
categorySchema.statics.findRootCategories = function() {
  return this.find({ parent: null, isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

categorySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

categorySchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isActive: true })
    .sort({ level: 1, sortOrder: 1, name: 1 });
  
  const categoryMap = new Map();
  const rootCategories = [];
  
  // Tạo map cho tất cả categories
  categories.forEach(cat => {
    categoryMap.set(cat._id.toString(), { ...cat.toObject(), children: [] });
  });
  
  // Xây dựng tree structure
  categories.forEach(cat => {
    const categoryObj = categoryMap.get(cat._id.toString());
    
    if (cat.parent) {
      const parent = categoryMap.get(cat.parent.toString());
      if (parent) {
        parent.children.push(categoryObj);
      }
    } else {
      rootCategories.push(categoryObj);
    }
  });
  
  return rootCategories;
};

module.exports = mongoose.model('Category', categorySchema);
