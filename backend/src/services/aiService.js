/**
 * AI Service Adapter
 * Hỗ trợ nhiều AI providers
 */

class AIService {
  constructor(provider = 'openai') {
    this.provider = provider;
    this.initializeProvider();
  }

  initializeProvider() {
    switch (this.provider) {
      case 'ollama':
        this.initializeOllama();
        break;
      case 'huggingface':
        this.initializeHuggingFace();
        break;
      default:
        this.initializeFallback();
    }
  }


  // Ollama Implementation (Local)
  initializeOllama() {
    this.baseURL = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama2';
    console.log('✅ Ollama initialized');
  }

  // Hugging Face Implementation
  initializeHuggingFace() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.model = process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium';
    console.log('✅ Hugging Face initialized');
  }


  // Fallback Implementation
  initializeFallback() {
    this.client = null;
    console.log('⚠️ Using fallback AI responses');
  }

  // Generate response based on provider
  async generateResponse(userMessage, context = {}) {
    try {
      switch (this.provider) {
        case 'ollama':
          return await this.generateOllamaResponse(userMessage, context);
        case 'huggingface':
          return await this.generateHuggingFaceResponse(userMessage, context);
        default:
          return this.generateFallbackResponse(userMessage, context);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.generateFallbackResponse(userMessage, context);
    }
  }


  // Ollama Response (Local)
  async generateOllamaResponse(userMessage, context) {
    const axios = require('axios');
    
    try {
      const response = await axios.post(`${this.baseURL}/api/generate`, {
        model: this.model,
        prompt: `${this.getSystemPrompt(context)}\n\nUser: ${userMessage}\nAssistant:`,
        stream: false
      });

      return {
        success: true,
        response: response.data.response,
        provider: 'ollama'
      };
    } catch (error) {
      console.error('Ollama Error:', error);
      return this.generateFallbackResponse(userMessage, context);
    }
  }

  // Hugging Face Response
  async generateHuggingFaceResponse(userMessage, context) {
    const axios = require('axios');
    
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          inputs: `${this.getSystemPrompt(context)}\n\nUser: ${userMessage}\nAssistant:`,
          parameters: {
            max_length: 500,
            temperature: 0.7
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        success: true,
        response: response.data[0].generated_text,
        provider: 'huggingface'
      };
    } catch (error) {
      console.error('Hugging Face Error:', error);
      return this.generateFallbackResponse(userMessage, context);
    }
  }


  // Fallback Response
  generateFallbackResponse(userMessage, context) {
    const responses = [
      "Xin chào! Tôi là trợ lý AI của VHA Atelier. Hiện tại tôi đang trong chế độ offline. Bạn có thể liên hệ trực tiếp với chúng tôi qua email hoặc hotline.",
      "Cảm ơn bạn đã liên hệ! Tôi đang tạm thời không khả dụng. Vui lòng thử lại sau hoặc liên hệ trực tiếp với đội ngũ hỗ trợ.",
      "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể tìm kiếm sản phẩm hoặc liên hệ hotline để được hỗ trợ ngay lập tức."
    ];

    return {
      success: false,
      response: responses[Math.floor(Math.random() * responses.length)],
      provider: 'fallback',
      fallback: true
    };
  }

  // System prompt for fashion e-commerce
  getSystemPrompt(context) {
    return `Bạn là trợ lý AI thông minh của VHA Atelier - cửa hàng thời trang cao cấp. 
    
Nhiệm vụ của bạn:
- Tư vấn về sản phẩm thời trang
- Hỗ trợ khách hàng mua sắm
- Trả lời câu hỏi về chính sách, giao hàng, đổi trả
- Đề xuất sản phẩm phù hợp

Phong cách giao tiếp:
- Thân thiện, chuyên nghiệp
- Sử dụng tiếng Việt
- Ngắn gọn, dễ hiểu
- Tích cực, nhiệt tình

Thông tin cửa hàng:
- Tên: VHA Atelier
- Chuyên: Thời trang cao cấp
- Phong cách: Earth tone, minimalist
- Dịch vụ: Giao hàng toàn quốc, đổi trả 30 ngày`;
  }
}

module.exports = AIService;
