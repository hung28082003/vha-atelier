const OpenAI = require('openai');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ChatbotConversation = require('../models/ChatbotConversation');

// Initialize OpenAI (only if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// System prompt for the fashion assistant
const SYSTEM_PROMPT = `Bạn là VHA Style Assistant, một trợ lý thời trang thông minh và chuyên nghiệp của VHA Atelier. 

VAI TRÒ CỦA BẠN:
- Tư vấn thời trang và phong cách cá nhân
- Gợi ý sản phẩm phù hợp với sở thích và nhu cầu
- Hướng dẫn cách mix & match trang phục
- Tư vấn về size, màu sắc và chất liệu
- Cập nhật xu hướng thời trang mới nhất

TÍNH CÁCH:
- Thân thiện, nhiệt tình và chuyên nghiệp
- Hiểu biết sâu về thời trang và xu hướng
- Luôn đưa ra lời khuyên hữu ích và thực tế
- Tôn trọng sở thích cá nhân của khách hàng

NGUYÊN TẮC:
- Luôn trả lời bằng tiếng Việt
- Đưa ra lời khuyên cụ thể và có thể thực hiện
- Hỏi thêm thông tin khi cần thiết để tư vấn tốt hơn
- Khuyến khích phong cách cá nhân và sự tự tin
- Luôn tích cực và khích lệ

KHI TƯ VẤN SẢN PHẨM:
- Mô tả chi tiết về sản phẩm
- Giải thích tại sao sản phẩm phù hợp
- Gợi ý cách phối đồ
- Đề xuất các sản phẩm bổ sung
- Tư vấn về size và chăm sóc

Hãy luôn giữ thái độ chuyên nghiệp và hữu ích!`;

// Product recommendation context
const getProductContext = async (products) => {
  if (!products || products.length === 0) return '';
  
  const productInfo = products.map(product => 
    `- ${product.name} (${product.brand}): ${product.price.toLocaleString('vi-VN')} VNĐ - ${product.description.substring(0, 100)}...`
  ).join('\n');
  
  return `\n\nSẢN PHẨM CÓ SẴN:\n${productInfo}`;
};

// Category context
const getCategoryContext = async (categories) => {
  if (!categories || categories.length === 0) return '';
  
  const categoryInfo = categories.map(category => 
    `- ${category.name}: ${category.description || 'Danh mục thời trang'}`
  ).join('\n');
  
  return `\n\nDANH MỤC SẢN PHẨM:\n${categoryInfo}`;
};

// Generate AI response
const generateResponse = async (userMessage, conversation, context = {}) => {
  try {
    // Check if OpenAI is available
    if (!openai) {
      return {
        success: false,
        error: 'Chatbot tạm thời không khả dụng. Vui lòng thử lại sau.',
        fallback: true
      };
    }

    // Get recent conversation history
    const recentMessages = conversation.getRecentMessages(10);
    
    // Build conversation context
    let contextInfo = '';
    
    if (context.products && context.products.length > 0) {
      contextInfo += await getProductContext(context.products);
    }
    
    if (context.categories && context.categories.length > 0) {
      contextInfo += await getCategoryContext(context.categories);
    }
    
    if (conversation.context.userPreferences) {
      const prefs = conversation.context.userPreferences;
      contextInfo += `\n\nTHÔNG TIN KHÁCH HÀNG:\n`;
      if (prefs.style && prefs.style.length > 0) {
        contextInfo += `- Phong cách yêu thích: ${prefs.style.join(', ')}\n`;
      }
      if (prefs.colors && prefs.colors.length > 0) {
        contextInfo += `- Màu sắc yêu thích: ${prefs.colors.join(', ')}\n`;
      }
      if (prefs.budget) {
        contextInfo += `- Ngân sách: ${prefs.budget.min?.toLocaleString('vi-VN') || 0} - ${prefs.budget.max?.toLocaleString('vi-VN') || 'không giới hạn'} VNĐ\n`;
      }
      if (prefs.size) {
        contextInfo += `- Size: ${prefs.size}\n`;
      }
      if (prefs.occasion) {
        contextInfo += `- Dịp sử dụng: ${prefs.occasion}\n`;
      }
    }
    
    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + contextInfo }
    ];
    
    // Add conversation history
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.message
      });
    });
    
    // Add current user message
    messages.push({ role: 'user', content: userMessage });
    
    // Generate response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });
    
    const response = completion.choices[0].message.content;
    
    return {
      success: true,
      response: response,
      usage: completion.usage
    };
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      success: false,
      error: 'Không thể tạo phản hồi từ AI. Vui lòng thử lại sau.',
      fallback: true
    };
  }
};

// Extract user preferences from message
const extractUserPreferences = (message, currentPreferences = {}) => {
  const preferences = { ...currentPreferences };
  
  // Extract style preferences
  const styleKeywords = ['casual', 'formal', 'elegant', 'sporty', 'vintage', 'modern', 'minimalist', 'bohemian'];
  const mentionedStyles = styleKeywords.filter(style => 
    message.toLowerCase().includes(style)
  );
  
  if (mentionedStyles.length > 0) {
    preferences.style = [...(preferences.style || []), ...mentionedStyles];
  }
  
  // Extract color preferences
  const colorKeywords = ['đỏ', 'xanh', 'vàng', 'hồng', 'tím', 'cam', 'xám', 'đen', 'trắng', 'nâu', 'be'];
  const mentionedColors = colorKeywords.filter(color => 
    message.toLowerCase().includes(color)
  );
  
  if (mentionedColors.length > 0) {
    preferences.colors = [...(preferences.colors || []), ...mentionedColors];
  }
  
  // Extract size information
  const sizeMatch = message.match(/(?:size|kích thước|cỡ)\s*(\d+|[xs|s|m|l|xl|xxl]+)/i);
  if (sizeMatch) {
    preferences.size = sizeMatch[1];
  }
  
  // Extract budget information
  const budgetMatch = message.match(/(?:budget|ngân sách|giá|tầm)\s*(\d+)(?:k|000)?(?:\s*-\s*(\d+)(?:k|000)?)?/i);
  if (budgetMatch) {
    const min = parseInt(budgetMatch[1]) * (budgetMatch[1].length <= 3 ? 1000 : 1);
    const max = budgetMatch[2] ? parseInt(budgetMatch[2]) * (budgetMatch[2].length <= 3 ? 1000 : 1) : min * 2;
    preferences.budget = { min, max };
  }
  
  // Extract occasion
  const occasionKeywords = ['đi làm', 'đi chơi', 'dự tiệc', 'hẹn hò', 'du lịch', 'thể thao', 'học tập'];
  const mentionedOccasion = occasionKeywords.find(occasion => 
    message.toLowerCase().includes(occasion)
  );
  
  if (mentionedOccasion) {
    preferences.occasion = mentionedOccasion;
  }
  
  return preferences;
};

// Search products based on preferences
const searchProductsByPreferences = async (preferences, limit = 5) => {
  try {
    const filter = { status: 'active', stock: { $gt: 0 } };
    
    if (preferences.budget) {
      filter.price = {
        $gte: preferences.budget.min || 0,
        $lte: preferences.budget.max || 10000000
      };
    }
    
    // Build color and style filters
    const colorFilters = [];
    const styleFilters = [];
    
    if (preferences.colors && preferences.colors.length > 0) {
      preferences.colors.forEach(color => {
        colorFilters.push(
          { name: { $regex: color, $options: 'i' } },
          { description: { $regex: color, $options: 'i' } },
          { tags: { $regex: color, $options: 'i' } }
        );
      });
    }
    
    if (preferences.style && preferences.style.length > 0) {
      preferences.style.forEach(style => {
        styleFilters.push(
          { name: { $regex: style, $options: 'i' } },
          { description: { $regex: style, $options: 'i' } },
          { tags: { $regex: style, $options: 'i' } }
        );
      });
    }
    
    // Combine filters
    const allFilters = [...colorFilters, ...styleFilters];
    if (allFilters.length > 0) {
      filter.$or = allFilters;
    }
    
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ averageRating: -1, salesCount: -1 })
      .limit(limit);
    
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Get fallback response
const getFallbackResponse = (userMessage) => {
  const fallbackResponses = [
    "Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể mô tả cụ thể hơn về nhu cầu thời trang của mình không?",
    "Tôi muốn giúp bạn tìm được phong cách phù hợp. Bạn đang tìm kiếm trang phục cho dịp gì và có sở thích màu sắc nào không?",
    "Hãy cho tôi biết thêm về phong cách bạn yêu thích và ngân sách dự kiến để tôi có thể tư vấn tốt hơn nhé!",
    "Tôi sẵn sàng giúp bạn tìm kiếm trang phục phù hợp. Bạn có thể chia sẻ thêm về sở thích và nhu cầu của mình không?"
  ];
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

module.exports = {
  generateResponse,
  extractUserPreferences,
  searchProductsByPreferences,
  getFallbackResponse
};
