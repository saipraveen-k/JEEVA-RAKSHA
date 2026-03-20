// Simple login test to isolate the issue
const axios = require('axios');

async function testLogin() {
  console.log('🧪 Testing login with different approaches...\n');
  
  // Test 1: Direct axios call like frontend
  console.log('📋 Test 1: Direct axios call (like frontend)');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@demo.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }

  // Test 2: With different email format
  console.log('\n📋 Test 2: With trimmed email');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@demo.com '.trim(), // Trimmed
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }

  // Test 3: Check if user exists in database
  console.log('\n📋 Test 3: Check user registration');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test-user@test.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Registration success:', response.data);
  } catch (error) {
    console.log('❌ Registration error:', error.response?.data || error.message);
  }

  // Test 4: Try login with the new user
  console.log('\n📋 Test 4: Login with new user');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test-user@test.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

testLogin().catch(console.error);
