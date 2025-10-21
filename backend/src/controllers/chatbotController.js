const ChatbotConversation = require('../models/ChatbotConversation');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const {
  generateResponse,
  extractUserPreferences,
  searchProductsByPreferences,
  getFallbackResponse
} = require('../services/chatbotService');

// @desc    Start new conversation
// @route   POST /api/chatbot/start
// @access  Private
const startConversation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Check if user has active conversation
  let conversation = await ChatbotConversation.findActiveByUser(userId);
  
  if (!conversation) {
    // Create new conversation
    conversation = await ChatbotConversation.createSession(userId);
  }
  
  // Add welcome message
  await conversation.addMessage('assistant', 
    'Xin chào! Tôi là VHA Style Assistant, trợ lý thời trang của bạn. Tôi có thể giúp bạn tìm kiếm trang phục phù hợp, tư vấn phong cách, và gợi ý cách mix & match. Bạn đang tìm kiếm gì hôm nay?'
  );
  
  res.json({
    success: true,
    message: 'Bắt đầu cuộc trò chuyện thành công',
      data: {
        conversation: {
          sessionId: conversation.sessionId,
          messages: conversation.getRecentMessages(5),
          userPreferences: conversation.context?.userPreferences || {}
        }
      }
  });
});

// @desc    Send message to chatbot
// @route   POST /api/chatbot/message
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;
  const userId = req.user._id;
  
  if (!message || !message.trim()) {
    throw new AppError('Vui lòng nhập tin nhắn', 400);
  }
  
  // Find conversation
  let conversation;
  if (sessionId) {
    conversation = await ChatbotConversation.findOne({ 
      sessionId, 
      user: userId 
    });
  } else {
    conversation = await ChatbotConversation.findActiveByUser(userId);
  }
  
  if (!conversation) {
    throw new AppError('Không tìm thấy cuộc trò chuyện', 404);
  }
  
  // Add user message
  await conversation.addMessage('user', message.trim());
  
  // Extract user preferences from message
  const newPreferences = extractUserPreferences(message, conversation.context?.userPreferences || {});
  if (Object.keys(newPreferences).length > 0) {
    await conversation.updateUserPreferences(newPreferences);
  }
  
  // Search for relevant products
  const relevantProducts = await searchProductsByPreferences(
    conversation.context?.userPreferences || {}, 
    3
  );
  
  // Add products to analytics
  relevantProducts.forEach(product => {
    conversation.addProductView(product._id);
  });
  
  // Generate AI response
  const aiResponse = await generateResponse(message, conversation, {
    products: relevantProducts
  });
  
  let responseMessage;
  let recommendations = [];
  
  if (aiResponse.success) {
    responseMessage = aiResponse.response;
    
    // If products were found, include them in recommendations
    if (relevantProducts.length > 0) {
      recommendations = relevantProducts.map(product => ({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.primaryImage,
        category: product.category?.name,
        description: product.shortDescription || product.description.substring(0, 100)
      }));
      
      await conversation.incrementRecommendations();
    }
  } else {
    responseMessage = getFallbackResponse(message);
  }
  
  // Add assistant response
  await conversation.addMessage('assistant', responseMessage, {
    intent: 'response',
    confidence: aiResponse.success ? 0.9 : 0.5,
    recommendations: recommendations.length
  });
  
  res.json({
    success: true,
    data: {
      response: responseMessage,
      sessionId: conversation.sessionId,
      recommendations: recommendations,
      userPreferences: conversation.context?.userPreferences || {},
      messageCount: conversation.analytics.messageCount
    }
  });
});

// @desc    Get conversation history
// @route   GET /api/chatbot/history
// @access  Private
const getConversationHistory = asyncHandler(async (req, res) => {
  const { sessionId, limit = 20 } = req.query;
  const userId = req.user._id;
  
  let conversation;
  if (sessionId) {
    conversation = await ChatbotConversation.findOne({ 
      sessionId, 
      user: userId 
    });
  } else {
    conversation = await ChatbotConversation.findActiveByUser(userId);
  }
  
  if (!conversation) {
    throw new AppError('Không tìm thấy cuộc trò chuyện', 404);
  }
  
  const messages = conversation.getRecentMessages(parseInt(limit));
  const summary = conversation.getConversationSummary();
  
  res.json({
    success: true,
    data: {
      conversation: {
        sessionId: conversation.sessionId,
        messages: messages,
        summary: summary,
        userPreferences: conversation.context.userPreferences
      }
    }
  });
});

// @desc    Get user's conversations
// @route   GET /api/chatbot/conversations
// @access  Private
const getUserConversations = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const userId = req.user._id;
  
  const conversations = await ChatbotConversation.findByUser(userId, parseInt(limit));
  
  const conversationList = conversations.map(conv => ({
    sessionId: conv.sessionId,
    status: conv.status,
    messageCount: conv.analytics.messageCount,
    recommendationsGiven: conv.analytics.recommendationsGiven,
    lastActivity: conv.lastActivity,
    createdAt: conv.createdAt,
    summary: conv.getConversationSummary()
  }));
  
  res.json({
    success: true,
    data: {
      conversations: conversationList
    }
  });
});

// @desc    Update user preferences
// @route   PUT /api/chatbot/preferences
// @access  Private
const updateUserPreferences = asyncHandler(async (req, res) => {
  const { preferences } = req.body;
  const userId = req.user._id;
  
  let conversation = await ChatbotConversation.findActiveByUser(userId);
  
  if (!conversation) {
    conversation = await ChatbotConversation.createSession(userId);
  }
  
  await conversation.updateUserPreferences(preferences);
  
  res.json({
    success: true,
    message: 'Cập nhật sở thích thành công',
    data: {
      userPreferences: conversation.context.userPreferences
    }
  });
});

// @desc    Get product recommendations
// @route   GET /api/chatbot/recommendations
// @access  Private
const getProductRecommendations = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  const userId = req.user._id;
  
  const conversation = await ChatbotConversation.findActiveByUser(userId);
  
  if (!conversation) {
    throw new AppError('Không tìm thấy cuộc trò chuyện', 404);
  }
  
  const recommendations = await searchProductsByPreferences(
    conversation.context?.userPreferences || {},
    parseInt(limit)
  );
  
  // Add to analytics
  recommendations.forEach(product => {
    conversation.addProductView(product._id);
  });
  
  await conversation.incrementRecommendations();
  
  res.json({
    success: true,
    data: {
      recommendations: recommendations,
      userPreferences: conversation.context.userPreferences
    }
  });
});

// @desc    End conversation
// @route   POST /api/chatbot/end
// @access  Private
const endConversation = asyncHandler(async (req, res) => {
  const { sessionId, satisfaction } = req.body;
  const userId = req.user._id;
  
  let conversation;
  if (sessionId) {
    conversation = await ChatbotConversation.findOne({ 
      sessionId, 
      user: userId 
    });
  } else {
    conversation = await ChatbotConversation.findActiveByUser(userId);
  }
  
  if (!conversation) {
    throw new AppError('Không tìm thấy cuộc trò chuyện', 404);
  }
  
  // Update satisfaction rating
  if (satisfaction && satisfaction >= 1 && satisfaction <= 5) {
    conversation.analytics.userSatisfaction = satisfaction;
  }
  
  // End conversation
  conversation.status = 'completed';
  await conversation.save();
  
  res.json({
    success: true,
    message: 'Kết thúc cuộc trò chuyện thành công',
    data: {
      summary: conversation.getConversationSummary()
    }
  });
});

// @desc    Get chatbot statistics (Admin)
// @route   GET /api/chatbot/stats
// @access  Private (Admin)
const getChatbotStats = asyncHandler(async (req, res) => {
  const stats = await ChatbotConversation.getConversationStats();
  
  // Get recent conversations
  const recentConversations = await ChatbotConversation.find()
    .populate('user', 'firstName lastName email')
    .sort({ lastActivity: -1 })
    .limit(5);
  
  res.json({
    success: true,
    data: {
      stats: stats,
      recentConversations: recentConversations.map(conv => ({
        sessionId: conv.sessionId,
        user: conv.user,
        messageCount: conv.analytics.messageCount,
        recommendationsGiven: conv.analytics.recommendationsGiven,
        satisfaction: conv.analytics.userSatisfaction,
        lastActivity: conv.lastActivity
      }))
    }
  });
});

module.exports = {
  startConversation,
  sendMessage,
  getConversationHistory,
  getUserConversations,
  updateUserPreferences,
  getProductRecommendations,
  endConversation,
  getChatbotStats
};
