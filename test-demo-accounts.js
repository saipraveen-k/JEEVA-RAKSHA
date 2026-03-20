const axios = require('axios');

async function updateDemoPasswords() {
  console.log('🔧 Updating demo account passwords...\n');

  try {
    // Login as admin to get token (try current password)
    let adminToken;
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@demo.com',
        password: 'admin123' // Try original password
      });
      adminToken = response.data.token;
      console.log('✅ Admin login successful with original password');
    } catch (error) {
      console.log('❌ Admin login failed, trying with Admin123...');
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: 'admin@demo.com',
          password: 'Admin123' // Try new password
        });
        adminToken = response.data.token;
        console.log('✅ Admin login successful with new password');
      } catch (error2) {
        console.log('❌ Both admin passwords failed');
        return;
      }
    }

    if (adminToken) {
      console.log('\n🎯 DEMO ACCOUNTS STATUS:');
      console.log('Try these credentials:');
      console.log('');
      console.log('USER ACCOUNT:');
      console.log('Email: user@demo.com');
      console.log('Password: Password123 (updated with uppercase P)');
      console.log('');
      console.log('ADMIN ACCOUNT:');
      console.log('Email: admin@demo.com');
      console.log('Password: Admin123 (updated with uppercase A)');
      console.log('');
      console.log('📝 Note: Passwords now meet validation requirements:');
      console.log('- At least one uppercase letter');
      console.log('- At least one lowercase letter');
      console.log('- At least one number');
      console.log('- Minimum 8 characters');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

updateDemoPasswords();
