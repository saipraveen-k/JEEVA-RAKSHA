// Check what's actually in the database
const axios = require('axios');

async function checkDatabaseContents() {
  console.log('🔍 CHECKING DATABASE CONTENTS VIA API\n');

  try {
    // Test existing demo accounts
    const accounts = [
      { email: 'user@demo.com', password: 'password123' },
      { email: 'admin@demo.com', password: 'admin123' }
    ];

    for (const account of accounts) {
      console.log(`📋 Testing ${account.email}...`);
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', account);
        console.log(`✅ ${account.email}: EXISTS AND WORKS`);
        console.log(`   Name: ${response.data.user.name}`);
        console.log(`   Role: ${response.data.user.role}`);
      } catch (error) {
        console.log(`❌ ${account.email}: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
    }

    // Check cases endpoint
    console.log('📋 Testing cases endpoint...');
    try {
      const response = await axios.get('http://localhost:5000/api/cases');
      console.log(`✅ Cases endpoint: ${response.status} (${response.data.length} cases)`);
    } catch (error) {
      console.log(`❌ Cases endpoint: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }

    console.log('\n🎯 CONCLUSION:');
    console.log('If accounts exist, database has old data.');
    console.log('If accounts fail, we need to recreate them.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabaseContents();
