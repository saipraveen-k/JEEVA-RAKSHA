// Fresh demo data creation - bypassing validation
const mongoose = require('mongoose');
const User = require('./backend/models/User');
const bcrypt = require('bcryptjs');

async function createFreshDemoData() {
  console.log('🚀 CREATING FRESH DEMO DATA\n');

  try {
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    console.log('✅ Connected to MongoDB');

    // Create FRESH demo user with simple password
    console.log('\n👤 Creating fresh demo user...');
    const userPassword = 'password123'; // Simple password for testing
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);

    const demoUser = new User({
      name: 'Demo User',
      email: 'user@demo.com',
      password: hashedUserPassword,
      role: 'user'
    });
    await demoUser.save();
    console.log('✅ Demo user created: user@demo.com / password123');

    // Create FRESH demo admin with simple password
    console.log('\n👨‍💼 Creating fresh demo admin...');
    const adminPassword = 'admin123'; // Simple password for testing
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const demoAdmin = new User({
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: hashedAdminPassword,
      role: 'admin'
    });
    await demoAdmin.save();
    console.log('✅ Demo admin created: admin@demo.com / admin123');

    console.log('\n🎯 FRESH DEMO DATA CREATED');
    console.log('📝 Working credentials:');
    console.log('USER: user@demo.com / password123');
    console.log('ADMIN: admin@demo.com / admin123');
    console.log('\n✅ Passwords are simple and will work!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

createFreshDemoData();
