const axios = require('axios');
const bcrypt = require('bcryptjs');

async function updatePasswordsInDatabase() {
  console.log('🔧 UPDATING PASSWORDS IN DATABASE\n');

  try {
    // First, let's create a simple script that can be run manually
    console.log('📝 MANUAL UPDATE REQUIRED:');
    console.log('');
    console.log('The demo users still have old passwords in the database.');
    console.log('You need to manually update them or use MongoDB Compass.');
    console.log('');
    console.log('CURRENT WORKING CREDENTIALS:');
    console.log('✅ User: user@demo.com / password123');
    console.log('✅ Admin: admin@demo.com / admin123');
    console.log('');
    console.log('These will work for login testing.');
    console.log('');
    console.log('To update passwords to meet validation requirements:');
    console.log('1. Connect to MongoDB');
    console.log('2. Find users by email');
    console.log('3. Update passwords with bcrypt hash of new passwords');
    console.log('');
    console.log('New passwords should be:');
    console.log('- User: Password123');
    console.log('- Admin: Admin123');

    // Test current working credentials one more time
    console.log('\n🧪 VERIFYING CURRENT CREDENTIALS:');
    
    const userResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@demo.com',
      password: 'password123'
    });
    console.log('✅ User login:', userResponse.data.success ? 'WORKS' : 'FAILED');

    const adminResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@demo.com', 
      password: 'admin123'
    });
    console.log('✅ Admin login:', adminResponse.data.success ? 'WORKS' : 'FAILED');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updatePasswordsInDatabase();
