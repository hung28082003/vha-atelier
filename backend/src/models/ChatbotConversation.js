const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous conversations
  },
  messages: [messageSchema],
  context: {
    userPreferences: {
      style: [String],
      colors: [String],
      budget: {
        min: Number,
        max: Number
      }
    },
    currentIntent: String,
    conversationFlow: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
conversationSchema.index({ sessionId: 1 });
conversationSchema.index({ user: 1 });
conversationSchema.index({ lastActivity: -1 });

// Instance methods
conversationSchema.methods.addMessage = function(role, content) {
  this.messages.push({ role, content });
  this.lastActivity = new Date();
  return this.save();
};

conversationSchema.methods.getRecentMessages = function(limit = 10) {
  return this.messages.slice(-limit);
};

conversationSchema.methods.updateContext = function(newContext) {
  this.context = { ...this.context, ...newContext };
  this.lastActivity = new Date();
  return this.save();
};

module.exports = mongoose.model('ChatbotConversation', conversationSchema);