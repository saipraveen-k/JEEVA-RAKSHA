// Check actual demo user passwords in database
const mongoose = require('mongoose');
const User = require('./backend/models/User');

async function checkDemoUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    console.log('✅ Connected to MongoDB');

    // Check user@demo.com
    const user = await User.findOne({ email: 'user@demo.com' });
    if (user) {
      console.log('\n👤 USER ACCOUNT FOUND:');
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      console.log('Password Hash:', user.password.substring(0, 20) + '...');
      
      // Test password comparison
      const isMatch = await user.comparePassword('password123');
      console.log('Test "password123":', isMatch ? '✅ MATCH' : '❌ NO MATCH');
      
      const isMatchNew = await user.comparePassword('Password123');
      console.log('Test "Password123":', isMatchNew ? '✅ MATCH' : '❌ NO MATCH');
    }

    // Check admin@demo.com
    const admin = await User.findOne({ email: 'admin@demo.com' });
    if (admin) {
      console.log('\n👨‍💼 ADMIN ACCOUNT FOUND:');
      console.log('Email:', admin.email);
      console.log('Name:', admin.name);
      console.log('Role:', admin.role);
      console.log('Password Hash:', admin.password.substring(0, 20) + '...');
      
      // Test password comparison
      const isAdminMatch = await admin.comparePassword('admin123');
      console.log('Test "admin123":', isAdminMatch ? '✅ MATCH' : '❌ NO MATCH');
      
      const isAdminMatchNew = await admin.comparePassword('Admin123');
      console.log('Test "Admin123":', isAdminMatchNew ? '✅ MATCH' : '❌ NO MATCH');
    }

    console.log('\n🔧 If passwords don\'t match, we need to update them in the database');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

checkDemoUsers();
