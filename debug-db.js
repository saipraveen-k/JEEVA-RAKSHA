const mongoose = require('mongoose');

async function debugDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    console.log('Connected to MongoDB');
    
    // Get all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check if users collection exists and has data
    if (collections.find(c => c.name === 'users')) {
      const users = await db.collection('users').find({}).toArray();
      console.log('Users in database:', users.length);
      users.forEach(user => {
        console.log(`- ${user.email} (role: ${user.role})`);
      });
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugDB();
