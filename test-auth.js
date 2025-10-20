const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAuthFlow() {
  try {
    console.log('🔍 Testing Authentication Flow...\n');
    
    // Test 1: Register a new user
    console.log('1. Testing User Registration...');
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: '123456'
    };
    
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, userData);
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('User ID:', registerResponse.data.data.user._id);
    console.log('Email:', registerResponse.data.data.user.email);
    console.log('Password hash exists:', !!registerResponse.data.data.user.password);
    console.log('');
    
    // Test 2: Login with the same credentials
    console.log('2. Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('Access Token:', loginResponse.data.data.accessToken ? 'Present' : 'Missing');
    console.log('User ID:', loginResponse.data.data.user._id);
    console.log('');
    
    // Test 3: Get profile with token
    console.log('3. Testing Get Profile...');
    const token = loginResponse.data.data.accessToken;
    const profileResponse = await axios.get(`${API_BASE}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.data.name);
    console.log('');
    
    console.log('🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testAuthFlow();
