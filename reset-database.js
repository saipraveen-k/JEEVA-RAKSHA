const mongoose = require('mongoose');
const User = require('./backend/models/User');
const Case = require('./backend/models/Case');

async function clearAndResetDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    console.log('✅ Connected to MongoDB');

    // Clear existing demo users
    console.log('\n🗑️ Clearing existing demo accounts...');
    const userDeleteResult = await User.deleteMany({
      email: { $in: ['user@demo.com', 'admin@demo.com', 'newuser@demo.com', 'newadmin@demo.com'] }
    });
    console.log(`✅ Deleted ${userDeleteResult.deletedCount} demo users`);

    // Clear existing cases
    console.log('\n🗑️ Clearing existing cases...');
    const caseDeleteResult = await Case.deleteMany({});
    console.log(`✅ Deleted ${caseDeleteResult.deletedCount} cases`);

    // Create fresh demo user with proper password
    console.log('\n👤 Creating fresh demo user...');
    const demoUser = new User({
      name: 'Demo User',
      email: 'user@demo.com',
      password: 'Password123', // Meets validation: uppercase P, lowercase, numbers
      role: 'user'
    });
    await demoUser.save();
    console.log('✅ Demo user created: user@demo.com / Password123');

    // Create fresh demo admin with proper password
    console.log('\n👨‍💼 Creating fresh demo admin...');
    const demoAdmin = new User({
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: 'Admin123', // Meets validation: uppercase A, lowercase, numbers
      role: 'admin'
    });
    await demoAdmin.save();
    console.log('✅ Demo admin created: admin@demo.com / Admin123');

    console.log('\n🎯 DATABASE RESET COMPLETE');
    console.log('📝 Fresh demo accounts ready:');
    console.log('USER: user@demo.com / Password123');
    console.log('ADMIN: admin@demo.com / Admin123');
    console.log('\n✅ All passwords meet validation requirements!');
    console.log('✅ Database is clean and ready for testing!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

clearAndResetDatabase();
