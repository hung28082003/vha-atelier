const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  // Thông tin người dùng
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Giỏ hàng phải thuộc về một người dùng']
  },
  
  // Sản phẩm trong giỏ hàng
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Sản phẩm là bắt buộc']
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng là bắt buộc'],
      min: [1, 'Số lượng phải ít nhất là 1'],
      max: [10, 'Số lượng không được quá 10']
    },
    size: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Giá không được âm']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Thông tin bổ sung
  notes: String,
  
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
cartSchema.index({ user: 1 });
cartSchema.index({ 'items.product': 1 });
cartSchema.index({ updatedAt: -1 });

// Middleware: Update updatedAt
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual fields
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual('totalAmount').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

cartSchema.virtual('isEmpty').get(function() {
  return this.items.length === 0;
});

// Instance methods
cartSchema.methods.addItem = async function(productId, quantity = 1, size = null, color = null) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }
  
  if (product.status !== 'active') {
    throw new Error('Sản phẩm không khả dụng');
  }
  
  if (product.stock < quantity) {
    throw new Error('Không đủ hàng trong kho');
  }
  
  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() &&
    item.size === size &&
    item.color === color
  );
  
  if (existingItemIndex > -1) {
    // Cập nhật số lượng
    const newQuantity = this.items[existingItemIndex].quantity + quantity;
    if (newQuantity > 10) {
      throw new Error('Số lượng không được quá 10');
    }
    if (product.stock < newQuantity) {
      throw new Error('Không đủ hàng trong kho');
    }
    this.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Thêm sản phẩm mới
    this.items.push({
      product: productId,
      quantity,
      size,
      color,
      price: product.price,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (!item) {
    throw new Error('Sản phẩm không tồn tại trong giỏ hàng');
  }
  
  if (quantity <= 0) {
    return this.removeItem(itemId);
  }
  
  if (quantity > 10) {
    throw new Error('Số lượng không được quá 10');
  }
  
  item.quantity = quantity;
  return this.save();
};

cartSchema.methods.removeItem = function(itemId) {
  this.items.pull(itemId);
  return this.save();
};

cartSchema.methods.clear = function() {
  this.items = [];
  return this.save();
};

cartSchema.methods.getItemsWithDetails = async function() {
  const Product = mongoose.model('Product');
  const itemsWithDetails = [];
  
  for (const item of this.items) {
    const product = await Product.findById(item.product)
      .select('name images price stock status brand');
    
    if (product && product.status === 'active') {
      itemsWithDetails.push({
        ...item.toObject(),
        product: product
      });
    }
  }
  
  return itemsWithDetails;
};

cartSchema.methods.validateStock = async function() {
  const Product = mongoose.model('Product');
  const errors = [];
  
  for (const item of this.items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      errors.push(`Sản phẩm ${item.product} không tồn tại`);
      continue;
    }
    
    if (product.status !== 'active') {
      errors.push(`Sản phẩm ${product.name} không khả dụng`);
      continue;
    }
    
    if (product.stock < item.quantity) {
      errors.push(`Không đủ hàng cho sản phẩm ${product.name}`);
    }
  }
  
  return errors;
};

cartSchema.methods.toOrderItems = function() {
  return this.items.map(item => ({
    product: item.product,
    name: '', // Sẽ được populate từ product
    price: item.price,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    image: {}, // Sẽ được populate từ product
    sku: '' // Sẽ được populate từ product
  }));
};

// Static methods
cartSchema.statics.findByUser = function(userId) {
  return this.findOne({ user: userId })
    .populate('items.product', 'name images price stock status brand');
};

cartSchema.statics.findOrCreateByUser = async function(userId) {
  let cart = await this.findOne({ user: userId });
  
  if (!cart) {
    cart = new this({ user: userId, items: [] });
    await cart.save();
  }
  
  return cart;
};

cartSchema.statics.mergeCarts = async function(userId, guestCartItems) {
  const userCart = await this.findOrCreateByUser(userId);
  
  for (const item of guestCartItems) {
    try {
      await userCart.addItem(
        item.product,
        item.quantity,
        item.size,
        item.color
      );
    } catch (error) {
      console.error('Error merging cart item:', error.message);
    }
  }
  
  return userCart;
};

cartSchema.statics.getCartStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalCarts: { $sum: 1 },
        totalItems: { $sum: { $size: '$items' } },
        averageItemsPerCart: { $avg: { $size: '$items' } }
      }
    }
  ]);
  
  const activeCarts = await this.countDocuments({
    updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 7 ngày
  });
  
  return {
    ...stats[0],
    activeCarts
  };
};

module.exports = mongoose.model('Cart', cartSchema);
