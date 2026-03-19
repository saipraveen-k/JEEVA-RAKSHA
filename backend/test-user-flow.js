const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testUserFlow() {
  console.log('🧪 Testing User Registration and Data Storage Flow...\n');

  try {
    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data.success);
    console.log('   User ID:', registerResponse.data.user.id);
    console.log('   Token received:', !!registerResponse.data.token);

    const token = registerResponse.data.token;

    // Test 2: Login
    console.log('\n2. Testing Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful:', loginResponse.data.success);

    // Test 3: Get Current User
    console.log('\n3. Testing Get Current User...');
    const meResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get user successful:', meResponse.data.success);
    console.log('   User name:', meResponse.data.user.name);
    console.log('   User email:', meResponse.data.user.email);

    // Test 4: Create a Case
    console.log('\n4. Testing Case Creation...');
    const formData = new FormData();
    formData.append('animalType', 'dog');
    formData.append('description', 'Injured dog found near the park');
    formData.append('location', JSON.stringify({
      lat: 12.9716,
      lng: 77.5946,
      address: 'Bangalore, Karnataka'
    }));

    const caseResponse = await axios.post(`${API_BASE}/cases`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('✅ Case creation successful:', caseResponse.data.success);
    console.log('   Case ID:', caseResponse.data.case._id);

    // Test 5: Get User's Cases
    console.log('\n5. Testing Get User Cases...');
    const casesResponse = await axios.get(`${API_BASE}/cases`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get cases successful:', casesResponse.data.success);
    console.log('   Number of cases:', casesResponse.data.cases.length);

    // Test 6: Verify Data in Database
    console.log('\n6. Verifying Data in Database...');
    const testConnection = require('./test-connection');
    // We'll manually check the database
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    
    const User = require('./models/User');
    const Case = require('./models/Case');
    
    const userCount = await User.countDocuments();
    const caseCount = await Case.countDocuments();
    
    console.log('✅ Database verification:');
    console.log('   Total users:', userCount);
    console.log('   Total cases:', caseCount);
    
    await mongoose.disconnect();

    console.log('\n🎉 All tests passed! User registration and data storage are working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 409) {
      console.log('\n💡 Note: User already exists. This is expected if running multiple times.');
      console.log('   Try using a different email address for testing.');
    }
  }
}

testUserFlow();