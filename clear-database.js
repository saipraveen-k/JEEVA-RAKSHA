const mongoose = require('mongoose');
const User = require('./backend/models/User');
const Case = require('./backend/models/Case');

async function clearAndResetEverything() {
  console.log('🔥 COMPLETE DATABASE RESET - CLEARING ALL DATA\n');

  try {
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    console.log('✅ Connected to MongoDB');

    // Clear ALL users
    console.log('\n🗑️ Clearing ALL existing users...');
    const userDeleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${userDeleteResult.deletedCount} users`);

    // Clear ALL cases
    console.log('\n🗑️ Clearing ALL existing cases...');
    const caseDeleteResult = await Case.deleteMany({});
    console.log(`✅ Deleted ${caseDeleteResult.deletedCount} cases`);

    console.log('\n🎯 DATABASE COMPLETELY CLEARED');
    console.log('✅ Ready to create fresh demo data');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

clearAndResetEverything();
