const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/users';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data);
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️  User already exists, continuing with login test...');
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
      }
    }

    // Test 2: Login with the user
    console.log('\n2. Testing user login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', loginResponse.data);
      
      const token = loginResponse.data.data.token;
      
      // Test 3: Get user profile with token
      console.log('\n3. Testing profile retrieval...');
      try {
        const profileResponse = await axios.get(`${BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Profile retrieval successful:', profileResponse.data);
      } catch (error) {
        console.log('❌ Profile retrieval failed:', error.response?.data || error.message);
      }
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
    }

    // Test 4: Test invalid login
    console.log('\n4. Testing invalid login...');
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: testUser.email,
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid login properly rejected:', error.response.data);
      } else {
        console.log('❌ Invalid login test failed:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAPI();
