const axios = require('axios');

async function testCaseCreation() {
  try {
    // Login as user
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@demo.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    
    // Create a case
    const caseResponse = await axios.post('http://localhost:5000/api/cases', {
      animalType: 'dog',
      description: 'Test case for user',
      location: '{"lat":40.7128,"lng":-74.0060}'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Case created successfully:', caseResponse.data.success);
    console.log('Case ID:', caseResponse.data.case._id);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testCaseCreation();