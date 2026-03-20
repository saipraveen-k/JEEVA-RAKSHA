const axios = require('axios');

async function createNewDemoUsers() {
  console.log('🔧 CREATING NEW DEMO USERS WITH PROPER PASSWORDS\n');

  try {
    // Create new user with proper password
    console.log('📝 Creating new user account...');
    try {
      const userResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Demo User',
        email: 'newuser@demo.com',
        password: 'Password123' // Has uppercase, lowercase, and numbers
      });
      console.log('✅ New user created:', userResponse.data.success ? 'SUCCESS' : 'FAILED');
    } catch (error) {
      console.log('❌ New user creation failed:', error.response?.data || error.message);
    }

    // Create new admin with proper password
    console.log('\n📝 Creating new admin account...');
    try {
      const adminResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Demo Admin',
        email: 'newadmin@demo.com',
        password: 'Admin123', // Has uppercase, lowercase, and numbers
        role: 'admin'
      });
      console.log('✅ New admin created:', adminResponse.data.success ? 'SUCCESS' : 'FAILED');
    } catch (error) {
      console.log('❌ New admin creation failed:', error.response?.data || error.message);
    }

    // Test login with new users
    console.log('\n🧪 TESTING NEW ACCOUNTS:');
    
    try {
      const newUserLogin = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'newuser@demo.com',
        password: 'Password123'
      });
      console.log('✅ New user login:', newUserLogin.data.success ? 'SUCCESS' : 'FAILED');
    } catch (error) {
      console.log('❌ New user login failed:', error.response?.data || error.message);
    }

    try {
      const newAdminLogin = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'newadmin@demo.com',
        password: 'Admin123'
      });
      console.log('✅ New admin login:', newAdminLogin.data.success ? 'SUCCESS' : 'FAILED');
    } catch (error) {
      console.log('❌ New admin login failed:', error.response?.data || error.message);
    }

    console.log('\n🎯 NEW WORKING DEMO ACCOUNTS:');
    console.log('USER: newuser@demo.com / Password123');
    console.log('ADMIN: newadmin@demo.com / Admin123');
    console.log('\n📝 Use these for testing - they meet validation requirements!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createNewDemoUsers();
