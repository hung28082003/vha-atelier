const axios = require('axios');

async function testCategoryAPI() {
  try {
    console.log('🧪 Testing Category API...\n');
    
    // First login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@vha-atelier.com',
      password: 'admin123456'
    });
    
    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful, token:', token.substring(0, 20) + '...');
    
    // Test create category
    const categoryData = {
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test description for category',
      isActive: true,
      sortOrder: 0
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/categories', categoryData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Create category successful:', createResponse.data);
    
    // Test get categories
    const getResponse = await axios.get('http://localhost:5000/api/categories', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Get categories successful:', getResponse.data.data.categories.length, 'categories found');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

testCategoryAPI();
