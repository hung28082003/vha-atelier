const axios = require('axios');
require('dotenv').config({path: './config.env'});

const testHuggingFace = async () => {
  try {
    console.log('🔄 Testing Hugging Face connection...');
    console.log('🔑 Token:', process.env.HUGGINGFACE_API_KEY.substring(0, 10) + '...');
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        inputs: 'Hello, how are you?',
        parameters: {
          max_length: 50,
          temperature: 0.7
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Hugging Face connected!');
    console.log('🤖 Response:', response.data[0].generated_text);
  } catch (error) {
    console.log('❌ Hugging Face failed:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Check your API token');
    } else if (error.response?.status === 429) {
      console.log('💡 Rate limit exceeded, try again later');
    } else if (error.response?.status === 503) {
      console.log('💡 Model is loading, try again in a few minutes');
    }
  }
};

testHuggingFace();
