const mongoose = require('mongoose');
const Case = require('./backend/models/Case');
const User = require('./backend/models/User');

async function testDirectCaseCreation() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/animal-rescue', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Find a user
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No user found. Creating a test user...');
      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await testUser.save();
      console.log('✅ Test user created');
    }

    // Create a case directly without middleware
    const caseData = {
      animalType: 'dog',
      description: 'Test case for dog rescue',
      location: {
        lat: 12.9716,
        lng: 77.5946
      },
      status: 'pending',
      priority: 'medium',
      userId: user._id
    };

    const newCase = new Case(caseData);
    await newCase.save();

    console.log('✅ Case created successfully:', newCase);
    console.log('✅ Animal type:', newCase.animalType);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testDirectCaseCreation();