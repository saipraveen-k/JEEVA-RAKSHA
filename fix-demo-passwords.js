// Fix demo user password to meet validation requirements
const mongoose = require('mongoose');
const User = require('./backend/models/User');
const bcrypt = require('bcryptjs');

async function fixDemoUserPasswords() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    console.log('✅ Connected to MongoDB');

    // Fix user@demo.com password - add uppercase letter
    const user = await User.findOne({ email: 'user@demo.com' });
    if (user) {
      const newPassword = 'Password123'; // Has uppercase, lowercase, and numbers
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await User.updateOne(
        { email: 'user@demo.com' },
        { password: hashedPassword }
      );
      
      console.log('✅ Updated user@demo.com password to: Password123');
    }

    // Fix admin@demo.com password - add uppercase letter
    const admin = await User.findOne({ email: 'admin@demo.com' });
    if (admin) {
      const newPassword = 'Admin123'; // Has uppercase, lowercase, and numbers
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await User.updateOne(
        { email: 'admin@demo.com' },
        { password: hashedPassword }
      );
      
      console.log('✅ Updated admin@demo.com password to: Admin123');
    }

    console.log('\n🎯 UPDATED DEMO ACCOUNTS:');
    console.log('User: user@demo.com / Password123');
    console.log('Admin: admin@demo.com / Admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

fixDemoUserPasswords();
