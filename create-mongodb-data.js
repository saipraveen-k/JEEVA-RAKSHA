// Direct MongoDB connection to create fresh data
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createFreshMongoDBData() {
  console.log('🚀 CREATING FRESH MONGODB DEMO DATA\n');

  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('jeeva-raksha');

    // Create user
    console.log('\n👤 Creating demo user...');
    const userPassword = 'password123';
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);

    const demoUser = {
      name: 'Demo User',
      email: 'user@demo.com',
      password: hashedUserPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('users').insertOne(demoUser);
    console.log('✅ Demo user created: user@demo.com / password123');

    // Create admin
    console.log('\n👨‍💼 Creating demo admin...');
    const adminPassword = 'admin123';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const demoAdmin = {
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: hashedAdminPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('users').insertOne(demoAdmin);
    console.log('✅ Demo admin created: admin@demo.com / admin123');

    console.log('\n🎯 FRESH DEMO DATA CREATED');
    console.log('📝 Working credentials:');
    console.log('USER: user@demo.com / password123');
    console.log('ADMIN: admin@demo.com / admin123');
    console.log('\n✅ Check MongoDB Compass - you should see these users!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  }
}

createFreshMongoDBData();
