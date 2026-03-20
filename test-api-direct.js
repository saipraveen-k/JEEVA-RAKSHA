const axios = require('axios');

async function testAPIDirect() {
  try {
    console.log('Testing API directly...');
    
    // First, let's try to login to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@demo.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    
    // Now try to create a case
    const caseResponse = await axios.post('http://localhost:5000/api/cases', {
      animalType: 'dog',
      description: 'Test case for dog rescue',
      location: '{"lat": 12.9716, "lng": 77.5946}'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Case creation successful:', caseResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAPIDirect();