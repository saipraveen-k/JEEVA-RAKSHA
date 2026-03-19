const mongoose = require('mongoose');
const User = require('./backend/models/User');

async function checkUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    
    const user = await User.findOne({email: 'user@demo.com'});
    if (user) {
      console.log('User found:', user.email);
      console.log('Password hash exists:', !!user.password);
      console.log('Role:', user.role);
      
      // Test password comparison
      const isMatch = await user.comparePassword('password123');
      console.log('Password match:', isMatch);
    } else {
      console.log('User not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();
