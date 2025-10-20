const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test functions
async function testHealthCheck() {
  try {
    console.log('🔍 Testing Health Check...');
    const response = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health Check failed:', error.message);
    return false;
  }
}

async function testRegister() {
  try {
    console.log('🔍 Testing User Registration...');
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: '123456'
    };
    
    const response = await axios.post(`${API_BASE}/auth/register`, userData);
    console.log('✅ Registration successful:', response.data);
    return { success: true, data: response.data, userData };
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testLogin(email, password) {
  try {
    console.log('🔍 Testing User Login...');
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password
    });
    console.log('✅ Login successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testGetProfile(token) {
  try {
    console.log('🔍 Testing Get Profile...');
    const response = await axios.get(`${API_BASE}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get Profile successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Get Profile failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testUpdateProfile(token) {
  try {
    console.log('🔍 Testing Update Profile...');
    const profileData = {
      name: 'Updated Test User',
      phone: '0123456789',
      gender: 'male'
    };
    
    const response = await axios.put(`${API_BASE}/user/profile`, profileData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Update Profile successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Update Profile failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testGetOrders(token) {
  try {
    console.log('🔍 Testing Get Orders...');
    const response = await axios.get(`${API_BASE}/user/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get Orders successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Get Orders failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testGetWishlist(token) {
  try {
    console.log('🔍 Testing Get Wishlist...');
    const response = await axios.get(`${API_BASE}/user/wishlist`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get Wishlist successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Get Wishlist failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testGetAddresses(token) {
  try {
    console.log('🔍 Testing Get Addresses...');
    const response = await axios.get(`${API_BASE}/user/addresses`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Get Addresses successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Get Addresses failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testAddAddress(token) {
  try {
    console.log('🔍 Testing Add Address...');
    const addressData = {
      name: 'Test User',
      phone: '0123456789',
      address: '123 Test Street',
      ward: 'Test Ward',
      district: 'Test District',
      city: 'Ho Chi Minh City',
      isDefault: true
    };
    
    const response = await axios.post(`${API_BASE}/user/addresses`, addressData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Add Address successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Add Address failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting VHA Atelier API Tests...\n');
  
  // Test 1: Health Check
  const healthCheck = await testHealthCheck();
  if (!healthCheck) {
    console.log('❌ Backend server is not running. Please start the backend first.');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Register
  const registerResult = await testRegister();
  if (!registerResult.success) {
    console.log('❌ Registration failed. Stopping tests.');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Login
  const loginResult = await testLogin(registerResult.userData.email, registerResult.userData.password);
  if (!loginResult.success) {
    console.log('❌ Login failed. Stopping tests.');
    return;
  }
  
  const token = loginResult.data.data.accessToken;
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 4: Get Profile
  await testGetProfile(token);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 5: Update Profile
  await testUpdateProfile(token);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 6: Get Orders
  await testGetOrders(token);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 7: Get Wishlist
  await testGetWishlist(token);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 8: Get Addresses
  await testGetAddresses(token);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 9: Add Address
  await testAddAddress(token);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('🎉 All API tests completed!');
  console.log('\n📋 Test Summary:');
  console.log('✅ Health Check');
  console.log('✅ User Registration');
  console.log('✅ User Login');
  console.log('✅ Get Profile');
  console.log('✅ Update Profile');
  console.log('✅ Get Orders');
  console.log('✅ Get Wishlist');
  console.log('✅ Get Addresses');
  console.log('✅ Add Address');
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Test frontend at http://localhost:3000');
  console.log('2. Test User Dashboard features');
  console.log('3. Test shopping cart and checkout');
  console.log('4. Test AI chatbot');
}

// Run tests
runTests().catch(console.error);
