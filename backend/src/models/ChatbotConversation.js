const mongoose = require('mongoose');

const chatbotConversationSchema = new mongoose.Schema({
  // User information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Cuộc trò chuyện phải thuộc về một người dùng']
  },
  
  // Session information
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Conversation context
  context: {
    currentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    currentProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    userPreferences: {
      style: [String],
      colors: [String],
      budget: {
        min: Number,
        max: Number
      },
      size: String,
      occasion: String
    },
    conversationHistory: [{
      type: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      metadata: {
        intent: String,
        entities: mongoose.Schema.Types.Mixed,
        confidence: Number
      }
    }]
  },
  
  // AI Assistant information
  assistant: {
    name: {
      type: String,
      default: 'VHA Style Assistant'
    },
    personality: {
      type: String,
      default: 'friendly, knowledgeable, helpful'
    },
    expertise: [String]
  },
  
  // Conversation status
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'archived'],
    default: 'active'
  },
  
  // Analytics
  analytics: {
    messageCount: {
      type: Number,
      default: 0
    },
    userSatisfaction: {
      type: Number,
      min: 1,
      max: 5
    },
    recommendationsGiven: {
      type: Number,
      default: 0
    },
    productsViewed: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    categoriesExplored: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }]
  },
  
  // Timestamps
  lastActivity: {
    type: Date,
    default: Date.now
  },
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
chatbotConversationSchema.index({ user: 1 });
chatbotConversationSchema.index({ sessionId: 1 });
chatbotConversationSchema.index({ status: 1 });
chatbotConversationSchema.index({ lastActivity: -1 });

// Middleware: Update lastActivity and updatedAt
chatbotConversationSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  this.updatedAt = new Date();
  next();
});

// Instance methods
chatbotConversationSchema.methods.addMessage = function(type, message, metadata = {}) {
  this.context.conversationHistory.push({
    type,
    message,
    metadata,
    timestamp: new Date()
  });
  
  this.analytics.messageCount += 1;
  
  return this.save();
};

chatbotConversationSchema.methods.updateUserPreferences = function(preferences) {
  this.context.userPreferences = {
    ...this.context.userPreferences,
    ...preferences
  };
  return this.save();
};

chatbotConversationSchema.methods.setCurrentCategory = function(categoryId) {
  this.context.currentCategory = categoryId;
  return this.save();
};

chatbotConversationSchema.methods.setCurrentProduct = function(productId) {
  this.context.currentProduct = productId;
  return this.save();
};

chatbotConversationSchema.methods.addProductView = function(productId) {
  if (!this.analytics.productsViewed.includes(productId)) {
    this.analytics.productsViewed.push(productId);
  }
  return this.save();
};

chatbotConversationSchema.methods.addCategoryExploration = function(categoryId) {
  if (!this.analytics.categoriesExplored.includes(categoryId)) {
    this.analytics.categoriesExplored.push(categoryId);
  }
  return this.save();
};

chatbotConversationSchema.methods.incrementRecommendations = function() {
  this.analytics.recommendationsGiven += 1;
  return this.save();
};

chatbotConversationSchema.methods.getRecentMessages = function(limit = 10) {
  return this.context.conversationHistory
    .slice(-limit)
    .map(msg => ({
      type: msg.type,
      message: msg.message,
      timestamp: msg.timestamp,
      metadata: msg.metadata
    }));
};

chatbotConversationSchema.methods.getConversationSummary = function() {
  const userMessages = this.context.conversationHistory.filter(msg => msg.type === 'user');
  const assistantMessages = this.context.conversationHistory.filter(msg => msg.type === 'assistant');
  
  return {
    totalMessages: this.analytics.messageCount,
    userMessages: userMessages.length,
    assistantMessages: assistantMessages.length,
    recommendationsGiven: this.analytics.recommendationsGiven,
    productsViewed: this.analytics.productsViewed.length,
    categoriesExplored: this.analytics.categoriesExplored.length,
    userPreferences: this.context.userPreferences,
    lastActivity: this.lastActivity,
    duration: Date.now() - this.createdAt.getTime()
  };
};

// Static methods
chatbotConversationSchema.statics.findByUser = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ lastActivity: -1 })
    .limit(limit)
    .populate('context.currentCategory', 'name slug')
    .populate('context.currentProduct', 'name images price');
};

chatbotConversationSchema.statics.findActiveByUser = function(userId) {
  return this.findOne({ 
    user: userId, 
    status: 'active' 
  })
  .populate('context.currentCategory', 'name slug')
  .populate('context.currentProduct', 'name images price');
};

chatbotConversationSchema.statics.createSession = async function(userId) {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  const conversation = new this({
    user: userId,
    sessionId,
    context: {
      conversationHistory: [],
      userPreferences: {}
    },
    assistant: {
      name: 'VHA Style Assistant',
      personality: 'friendly, knowledgeable, helpful',
      expertise: ['fashion', 'styling', 'trends', 'sizing', 'colors']
    }
  });
  
  return conversation.save();
};

chatbotConversationSchema.statics.getConversationStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        activeConversations: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        totalMessages: { $sum: '$analytics.messageCount' },
        totalRecommendations: { $sum: '$analytics.recommendationsGiven' },
        averageSatisfaction: { $avg: '$analytics.userSatisfaction' }
      }
    }
  ]);
  
  return stats[0] || {
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0,
    totalRecommendations: 0,
    averageSatisfaction: 0
  };
};

module.exports = mongoose.model('ChatbotConversation', chatbotConversationSchema);
