const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function debugSeed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    console.log('Connected to MongoDB');
    
    // Create a test user manually
    const userPassword = await bcrypt.hash('password123', 10);
    console.log('Password hash:', userPassword);
    
    const testUser = {
      name: 'Test User',
      email: 'test@demo.com',
      password: userPassword,
      role: 'user'
    };
    
    console.log('Creating user:', testUser.email);
    // Note: This would require the User model to work properly
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugSeed();
