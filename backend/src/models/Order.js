const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Thông tin đơn hàng
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Thông tin khách hàng
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Đơn hàng phải thuộc về một khách hàng']
  },
  
  // Sản phẩm trong đơn hàng
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Giá không được âm']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng phải ít nhất là 1']
    },
    size: String,
    color: String,
    image: {
      public_id: String,
      url: String
    },
    sku: String
  }],
  
  // Thông tin giao hàng
  shippingAddress: {
    fullName: {
      type: String,
      required: [true, 'Vui lòng nhập tên người nhận']
    },
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại']
    },
    address: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ']
    },
    ward: {
      type: String,
      required: [true, 'Vui lòng nhập phường/xã']
    },
    district: {
      type: String,
      required: [true, 'Vui lòng nhập quận/huyện']
    },
    city: {
      type: String,
      required: [true, 'Vui lòng nhập tỉnh/thành phố']
    },
    note: String
  },
  
  // Thông tin thanh toán
  paymentMethod: {
    type: String,
    enum: ['qr_code', 'cod', 'bank_transfer'],
    required: [true, 'Vui lòng chọn phương thức thanh toán']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    qrCode: String,
    bankAccount: {
      number: String,
      name: String,
      bank: String
    },
    paidAt: Date,
    refundedAt: Date
  },
  
  // Trạng thái đơn hàng
  status: {
    type: String,
    enum: [
      'pending',           // Chờ xử lý
      'confirmed',         // Đã xác nhận
      'processing',        // Đang xử lý
      'shipped',           // Đã gửi hàng
      'delivered',         // Đã giao hàng
      'cancelled',         // Đã hủy
      'returned'           // Đã trả hàng
    ],
    default: 'pending'
  },
  
  // Thông tin vận chuyển
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight'],
    default: 'standard'
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: [0, 'Phí vận chuyển không được âm']
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  
  // Giá cả
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Tổng tiền không được âm']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Thuế không được âm']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Giảm giá không được âm']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Tổng tiền không được âm']
  },
  
  // Mã giảm giá
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  couponCode: String,
  couponDiscount: {
    type: Number,
    default: 0
  },
  
  // Ghi chú
  notes: {
    customer: String,
    admin: String
  },
  
  // Lịch sử trạng thái
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Thông tin AI Chatbot
  chatbotSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatbotConversation'
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
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shippingAddress.phone': 1 });

// Middleware: Tạo order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Tìm số thứ tự trong ngày
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    this.orderNumber = `VHA${year}${month}${day}${sequence}`;
  }
  next();
});

// Middleware: Update updatedAt
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware: Thêm vào status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date()
    });
  }
  next();
});

// Virtual fields
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual('isPaid').get(function() {
  return this.paymentStatus === 'paid';
});

orderSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered';
});

orderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

orderSchema.virtual('canReturn').get(function() {
  return this.status === 'delivered' && 
         this.deliveredAt && 
         (Date.now() - this.deliveredAt.getTime()) <= (7 * 24 * 60 * 60 * 1000); // 7 ngày
});

// Instance methods
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy,
    updatedAt: new Date()
  });
  
  // Cập nhật thời gian giao hàng
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  }
  
  return this.save();
};

orderSchema.methods.markAsPaid = function(transactionId = null) {
  this.paymentStatus = 'paid';
  this.paymentDetails.paidAt = new Date();
  if (transactionId) {
    this.paymentDetails.transactionId = transactionId;
  }
  return this.save();
};

orderSchema.methods.cancel = function(reason = '') {
  if (this.canCancel) {
    this.status = 'cancelled';
    this.statusHistory.push({
      status: 'cancelled',
      note: reason,
      updatedAt: new Date()
    });
    return this.save();
  }
  throw new Error('Không thể hủy đơn hàng này');
};

orderSchema.methods.return = function(reason = '') {
  if (this.canReturn) {
    this.status = 'returned';
    this.statusHistory.push({
      status: 'returned',
      note: reason,
      updatedAt: new Date()
    });
    return this.save();
  }
  throw new Error('Không thể trả hàng cho đơn hàng này');
};

orderSchema.methods.generateQRCode = function() {
  // Tạo QR code cho thanh toán
  const qrData = {
    orderNumber: this.orderNumber,
    amount: this.total,
    account: process.env.BANK_ACCOUNT_NUMBER,
    bank: process.env.BANK_NAME
  };
  
  this.paymentDetails.qrCode = JSON.stringify(qrData);
  return this.save();
};

// Static methods
orderSchema.statics.findByOrderNumber = function(orderNumber) {
  return this.findOne({ orderNumber })
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name images')
    .populate('coupon', 'code discount');
};

orderSchema.statics.findByUser = function(userId, limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('items.product', 'name images')
    .populate('coupon', 'code discount');
};

orderSchema.statics.findPending = function() {
  return this.find({ status: 'pending' })
    .sort({ createdAt: 1 })
    .populate('user', 'firstName lastName email phone');
};

orderSchema.statics.findByStatus = function(status, limit = 20, page = 1) {
  const skip = (page - 1) * limit;
  return this.find({ status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name images');
};

orderSchema.statics.getOrderStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);
  
  const statusStats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    ...stats[0],
    statusBreakdown: statusStats
  };
};

module.exports = mongoose.model('Order', orderSchema);
