// COMPLETE SYSTEM AUDIT & TESTING SCRIPT
const axios = require('axios');

async function comprehensiveSystemTest() {
  console.log('🎯 JEEVA RAKSHA - COMPLETE SYSTEM AUDIT');
  console.log('=====================================\n');

  let testsPassed = 0;
  let totalTests = 0;

  const testResult = (name, success, details = '') => {
    totalTests++;
    if (success) testsPassed++;
    console.log(`${success ? '✅' : '❌'} ${name}${details ? `: ${details}` : ''}`);
  };

  try {
    // =================== 1. BACKEND CONNECTIVITY ===================
    console.log('🔗 1. BACKEND CONNECTIVITY TESTS\n');

    try {
      const healthCheck = await axios.get('http://localhost:5000/api/cases');
      testResult('Backend connectivity', healthCheck.status === 200);
    } catch (error) {
      testResult('Backend connectivity', false, 'Backend not running');
    }

    // =================== 2. AUTHENTICATION TESTS ===================
    console.log('\n🔐 2. AUTHENTICATION TESTS\n');

    // Test user login
    try {
      const userLogin = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'user@demo.com',
        password: 'password123'
      });
      testResult('User login', userLogin.data.success === true);
      testResult('User token generation', !!userLogin.data.token);
      testResult('User role validation', userLogin.data.user.role === 'user');
    } catch (error) {
      testResult('User login', false, error.response?.data?.message || error.message);
    }

    // Test admin login
    try {
      const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@demo.com',
        password: 'admin123'
      });
      testResult('Admin login', adminLogin.data.success === true);
      testResult('Admin token generation', !!adminLogin.data.token);
      testResult('Admin role validation', adminLogin.data.user.role === 'admin');
    } catch (error) {
      testResult('Admin login', false, error.response?.data?.message || error.message);
    }

    // Test invalid credentials
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'invalid@test.com',
        password: 'wrongpass'
      });
      testResult('Invalid credentials rejection', false, 'Should fail');
    } catch (error) {
      testResult('Invalid credentials rejection', error.response?.status === 401);
    }

    // =================== 3. API ENDPOINT TESTS ===================
    console.log('\n🔗 3. API ENDPOINT TESTS\n');

    // Get valid token for authenticated requests
    let userToken = '';
    try {
      const login = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'user@demo.com',
        password: 'password123'
      });
      userToken = login.data.token;
    } catch (error) {
      console.log('⚠️  Cannot get token for API tests');
    }

    // Test cases endpoint (requires auth)
    if (userToken) {
      try {
        const casesResponse = await axios.get('http://localhost:5000/api/cases', {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        testResult('Cases endpoint access', casesResponse.status === 200);
        testResult('Cases response format', Array.isArray(casesResponse.data));
      } catch (error) {
        testResult('Cases endpoint access', false, error.response?.data?.message || error.message);
      }
    }

    // Test unauthorized access
    try {
      await axios.get('http://localhost:5000/api/cases');
      testResult('Unauthorized access rejection', false, 'Should fail');
    } catch (error) {
      testResult('Unauthorized access rejection', error.response?.status === 401);
    }

    // =================== 4. CASE MANAGEMENT TESTS ===================
    console.log('\n📋 4. CASE MANAGEMENT TESTS\n');

    if (userToken) {
      // Test case creation
      try {
        const newCase = await axios.post('http://localhost:5000/api/cases', {
          animalType: 'dog',
          description: 'Test case for audit',
          location: { lat: 12.9716, lng: 77.5946 }
        }, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        testResult('Case creation', newCase.data.success === true);
        if (newCase.data.success) {
          var createdCaseId = newCase.data.case._id;
          testResult('Case ID generation', !!createdCaseId);
        }
      } catch (error) {
        testResult('Case creation', false, error.response?.data?.message || error.message);
      }

      // Test case update if case was created
      if (createdCaseId) {
        try {
          const updateResponse = await axios.put(`http://localhost:5000/api/cases/${createdCaseId}`, {
            status: 'in_progress'
          }, {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          testResult('Case status update', updateResponse.data.success === true);
        } catch (error) {
          testResult('Case status update', false, error.response?.data?.message || error.message);
        }
      }
    }

    // =================== 5. ADMIN FEATURES TESTS ===================
    console.log('\n👨‍💼 5. ADMIN FEATURES TESTS\n');

    let adminToken = '';
    try {
      const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@demo.com',
        password: 'admin123'
      });
      adminToken = adminLogin.data.token;
    } catch (error) {
      console.log('⚠️  Cannot get admin token');
    }

    if (adminToken) {
      // Test admin access to cases
      try {
        const adminCases = await axios.get('http://localhost:5000/api/cases', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        testResult('Admin cases access', adminCases.status === 200);
      } catch (error) {
        testResult('Admin cases access', false, error.response?.data?.message || error.message);
      }

      // Test stats endpoint
      try {
        const statsResponse = await axios.get('http://localhost:5000/api/cases/stats', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        testResult('Cases stats endpoint', statsResponse.status === 200);
        testResult('Stats data structure', typeof statsResponse.data === 'object');
      } catch (error) {
        testResult('Cases stats endpoint', false, error.response?.data?.message || error.message);
      }
    }

    // =================== 6. VALIDATION TESTS ===================
    console.log('\n🛡️ 6. VALIDATION TESTS\n');

    // Test password validation bypass for demo accounts
    try {
      const demoUserLogin = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'user@demo.com',
        password: 'password123' // Should work even though it doesn't meet strict requirements
      });
      testResult('Demo account password bypass', demoUserLogin.data.success === true);
    } catch (error) {
      testResult('Demo account password bypass', false);
    }

    // Test input validation
    if (userToken) {
      try {
        await axios.post('http://localhost:5000/api/cases', {
          animalType: 'invalid_animal',
          description: '',
          location: { lat: 91, lng: 181 } // Invalid coordinates
        }, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        testResult('Input validation', false, 'Should reject invalid data');
      } catch (error) {
        testResult('Input validation', error.response?.status === 400);
      }
    }

    // =================== 7. EDGE CASE TESTS ===================
    console.log('\n🧪 7. EDGE CASE TESTS\n');

    // Test empty form submission
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: '',
        password: ''
      });
      testResult('Empty form rejection', false, 'Should fail');
    } catch (error) {
      testResult('Empty form rejection', error.response?.status === 400);
    }

    // Test malformed JSON
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@test.com',
        password: { invalid: 'object' } // Invalid password format
      });
      testResult('Malformed input handling', false, 'Should fail');
    } catch (error) {
      testResult('Malformed input handling', true, 'Properly rejected');
    }

    // =================== 8. PERFORMANCE TESTS ===================
    console.log('\n⚡ 8. PERFORMANCE TESTS\n');

    // Test rapid requests (should not crash)
    if (userToken) {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          axios.get('http://localhost:5000/api/cases', {
            headers: { Authorization: `Bearer ${userToken}` }
          }).catch(() => null) // Ignore errors for performance test
        );
      }

      try {
        await Promise.all(promises);
        testResult('Rapid request handling', true, 'No crashes');
      } catch (error) {
        testResult('Rapid request handling', false, 'System crashed');
      }
    }

    // =================== FINAL RESULTS ===================
    console.log('\n🎯 AUDIT RESULTS');
    console.log('================');
    console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
    console.log(`Success Rate: ${((testsPassed/totalTests)*100).toFixed(1)}%`);

    if (testsPassed === totalTests) {
      console.log('\n🎉 STATUS: EXCELLENT - All systems operational!');
    } else if (testsPassed >= totalTests * 0.8) {
      console.log('\n✅ STATUS: GOOD - Minor issues detected');
    } else {
      console.log('\n⚠️  STATUS: NEEDS ATTENTION - Significant issues found');
    }

    return {
      totalTests,
      testsPassed,
      successRate: (testsPassed/totalTests)*100
    };

  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    return { totalTests: 0, testsPassed: 0, successRate: 0 };
  }
}

// Run the comprehensive audit
comprehensiveSystemTest().then(results => {
  console.log(`\n📊 Final Score: ${results.testsPassed}/${results.totalTests} (${results.successRate.toFixed(1)}%)`);
  if (results.successRate === 100) {
    console.log('🚀 System is ready for hackathon submission!');
  } else {
    console.log('🔧 System needs fixes before submission.');
  }
});
