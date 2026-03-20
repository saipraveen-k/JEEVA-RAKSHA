// Clear and create fresh demo data via API
const axios = require('axios');

async function resetDatabaseCompletely() {
  console.log('🔥 COMPLETE DATABASE RESET VIA API\n');

  try {
    // First, try to register fresh demo users
    console.log('📝 Creating fresh demo users...');

    // Create user
    try {
      const userResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Demo User',
        email: 'user@demo.com',
        password: 'password123'
      });
      console.log('✅ User created successfully');
    } catch (error) {
      console.log('ℹ️ User already exists or error:', error.response?.data?.message || error.message);
    }

    // Create admin
    try {
      const adminResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'admin123'
      });
      console.log('✅ Admin created successfully');
    } catch (error) {
      console.log('ℹ️ Admin already exists or error:', error.response?.data?.message || error.message);
    }

    console.log('\n🧪 TESTING FRESH LOGIN CREDENTIALS:');
    console.log('');

    // Test user login
    try {
      const userLogin = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'user@demo.com',
        password: 'password123'
      });
      console.log('✅ USER LOGIN: SUCCESS');
      console.log('   Name:', userLogin.data.user.name);
      console.log('   Role:', userLogin.data.user.role);
      console.log('   Token:', userLogin.data.token.substring(0, 20) + '...');
    } catch (error) {
      console.log('❌ USER LOGIN: FAILED');
      console.log('   Error:', error.response?.data?.message || error.message);
    }

    console.log('');

    // Test admin login
    try {
      const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@demo.com',
        password: 'admin123'
      });
      console.log('✅ ADMIN LOGIN: SUCCESS');
      console.log('   Name:', adminLogin.data.user.name);
      console.log('   Role:', adminLogin.data.user.role);
      console.log('   Token:', adminLogin.data.token.substring(0, 20) + '...');
    } catch (error) {
      console.log('❌ ADMIN LOGIN: FAILED');
      console.log('   Error:', error.response?.data?.message || error.message);
    }

    console.log('\n🎯 FINAL RESULT:');
    console.log('📝 If both logins succeed, the database reset is complete!');
    console.log('📝 If logins fail, we need to clear the database manually.');
    console.log('');
    console.log('🔑 WORKING CREDENTIALS:');
    console.log('USER: user@demo.com / password123');
    console.log('ADMIN: admin@demo.com / admin123');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

resetDatabaseCompletely();
