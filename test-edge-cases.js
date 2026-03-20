// Edge Case Testing for JEEVA RAKSHA
// Tests various failure scenarios and edge cases

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testEdgeCases() {
  console.log('🧪 STARTING EDGE CASE TESTING...\n');

  // Test 1: Invalid credentials
  console.log('📋 Test 1: Invalid login credentials');
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'invalid@test.com',
      password: 'wrongpassword'
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 2: Empty form submission
  console.log('\n📋 Test 2: Empty form submission');
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: '',
      password: ''
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 3: Malformed JSON in location
  console.log('\n📋 Test 3: Malformed JSON in location');
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'user@demo.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    
    const response = await axios.post(`${API_BASE}/cases`, {
      animalType: 'dog',
      description: 'Test case',
      location: '{"lat": invalid, "lng": 123.456}' // Malformed JSON
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 4: Invalid coordinates
  console.log('\n📋 Test 4: Invalid coordinates');
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'user@demo.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    
    const response = await axios.post(`${API_BASE}/cases`, {
      animalType: 'dog',
      description: 'Test case',
      location: '{"lat": 91, "lng": 181}' // Invalid coordinates
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 5: Very long description
  console.log('\n📋 Test 5: Very long description');
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'user@demo.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    
    const longDescription = 'a'.repeat(1001); // 1001 characters (over limit)
    const response = await axios.post(`${API_BASE}/cases`, {
      animalType: 'dog',
      description: longDescription,
      location: '{"lat": 12.9716, "lng": 77.5946}'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 6: Invalid animal type
  console.log('\n📋 Test 6: Invalid animal type');
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'user@demo.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    
    const response = await axios.post(`${API_BASE}/cases`, {
      animalType: 'dinosaur', // Invalid animal type
      description: 'Test case',
      location: '{"lat": 12.9716, "lng": 77.5946}'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 7: Expired/Invalid token
  console.log('\n📋 Test 7: Expired/Invalid token');
  try {
    const response = await axios.get(`${API_BASE}/cases`, {
      headers: {
        'Authorization': 'Bearer invalid-token-12345'
      }
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 8: No authorization header
  console.log('\n📋 Test 8: No authorization header');
  try {
    const response = await axios.get(`${API_BASE}/cases`);
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 9: SQL Injection attempt
  console.log('\n📋 Test 9: SQL Injection attempt');
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'user@demo.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    
    const response = await axios.post(`${API_BASE}/cases`, {
      animalType: 'dog; DROP TABLE users; --', // SQL injection attempt
      description: 'Test case',
      location: '{"lat": 12.9716, "lng": 77.5946}'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 10: XSS attempt
  console.log('\n📋 Test 10: XSS attempt');
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'user@demo.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    
    const response = await axios.post(`${API_BASE}/cases`, {
      animalType: 'dog',
      description: '<script>alert("XSS")</script>', // XSS attempt
      location: '{"lat": 12.9716, "lng": 77.5946}'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }

  // Test 11: Rate limiting
  console.log('\n📋 Test 11: Rate limiting');
  try {
    // Make multiple rapid requests to test rate limiting
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        axios.post(`${API_BASE}/auth/login`, {
          email: `test${i}@demo.com`,
          password: 'password123'
        }).catch(error => {
          console.log(`Request ${i + 1} failed:`, error.response?.data || error.message);
        })
      );
    }
    await Promise.all(promises);
  } catch (error) {
    console.error('Rate limiting test error:', error.message);
  }

  console.log('\n✅ EDGE CASE TESTING COMPLETED');
  console.log('📊 SUMMARY:');
  console.log('- Invalid credentials: Should return 401');
  console.log('- Empty forms: Should return 400');
  console.log('- Malformed JSON: Should return 400');
  console.log('- Invalid coordinates: Should return 400');
  console.log('- Long description: Should return 400');
  console.log('- Invalid animal type: Should return 400');
  console.log('- Invalid token: Should return 401');
  console.log('- Missing auth: Should return 401');
  console.log('- SQL injection: Should be sanitized/blocked');
  console.log('- XSS attempts: Should be sanitized/blocked');
  console.log('- Rate limiting: Should block after threshold');
}

// Run the tests
testEdgeCases().catch(console.error);
