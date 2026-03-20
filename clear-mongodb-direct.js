// Direct MongoDB connection to clear data
const { MongoClient } = require('mongodb');

async function clearMongoDBDirectly() {
  console.log('🔥 DIRECT MONGODB CLEAR OPERATION\n');

  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('jeeva-raksha');

    // Clear users collection
    console.log('\n🗑️ Clearing users collection...');
    const usersResult = await db.collection('users').deleteMany({});
    console.log(`✅ Deleted ${usersResult.deletedCount} users`);

    // Clear cases collection
    console.log('\n🗑️ Clearing cases collection...');
    const casesResult = await db.collection('cases').deleteMany({});
    console.log(`✅ Deleted ${casesResult.deletedCount} cases`);

    console.log('\n🎯 DATABASE COMPLETELY CLEARED');
    console.log('✅ Ready for fresh demo data');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

clearMongoDBDirectly();
