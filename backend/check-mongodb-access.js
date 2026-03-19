const mongoose = require('mongoose');

async function checkMongoDBAccess() {
  try {
    console.log('Testing MongoDB connection for Compass access...');
    
    // Test connection with the same URI used in the app
    await mongoose.connect('mongodb://localhost:27017/jeeva-raksha');
    
    console.log('✅ MongoDB is accessible');
    console.log('✅ Database name: jeeva-raksha');
    console.log('✅ Connection string: mongodb://localhost:27017/jeeva-raksha');
    
    // Get database stats
    const db = mongoose.connection.db;
    const stats = await db.stats();
    console.log('Database stats:', {
      collections: stats.collections,
      dataSize: stats.dataSize,
      indexSize: stats.indexSize,
      objects: stats.objects
    });
    
    // List all collections with their document counts
    const collections = await db.listCollections().toArray();
    console.log('\nCollections and document counts:');
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`- ${collection.name}: ${count} documents`);
    }
    
    await mongoose.disconnect();
    console.log('\n✅ MongoDB Compass should be able to connect using:');
    console.log('   Connection String: mongodb://localhost:27017/jeeva-raksha');
    console.log('   Database Name: jeeva-raksha');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. MongoDB service is not running');
    console.log('2. MongoDB is not installed');
    console.log('3. Port 27017 is blocked by firewall');
    console.log('4. MongoDB is configured with authentication');
  }
}

checkMongoDBAccess();