const axios = require('axios');

async function testLoginComprehensive() {
  console.log('🔍 COMPREHENSIVE LOGIN TEST\n');

  // Test 1: Try original password
  console.log('📋 Test 1: Original password (password123)');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@demo.com',
      password: 'password123'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ SUCCESS with original password!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ FAILED with original password');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }

  // Test 2: Try new password with uppercase
  console.log('\n📋 Test 2: New password (Password123)');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@demo.com',
      password: 'Password123'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ SUCCESS with new password!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ FAILED with new password');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }

  // Test 3: Try admin with original password
  console.log('\n📋 Test 3: Admin original password (admin123)');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@demo.com',
      password: 'admin123'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ SUCCESS with admin original password!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ FAILED with admin original password');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }

  // Test 4: Try admin with new password
  console.log('\n📋 Test 4: Admin new password (Admin123)');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@demo.com',
      password: 'Admin123'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ SUCCESS with admin new password!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ FAILED with admin new password');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }

  console.log('\n🎯 CONCLUSION:');
  console.log('If all tests fail, the database passwords are still old.');
  console.log('If some tests pass, the issue is frontend-related.');
  console.log('If new passwords work, use those in the UI.');
}

testLoginComprehensive();
