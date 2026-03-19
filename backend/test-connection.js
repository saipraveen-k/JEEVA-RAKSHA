const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    console.log('✅ MongoDB connection successful');
    
    // Test if collections exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    // Test User model
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log('Users in database:', userCount);
    
    // Test Case model
    const Case = require('./models/Case');
    const caseCount = await Case.countDocuments();
    console.log('Cases in database:', caseCount);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();