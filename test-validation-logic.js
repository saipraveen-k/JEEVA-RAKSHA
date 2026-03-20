const validateCaseInput = (req, res, next) => {
  try {
    // Sanitize inputs to prevent NoSQL injection
    const { animalType, description, location } = req.body;
    
    if (animalType) {
      req.body.animalType = animalType;
    }
    
    if (description) {
      req.body.description = description.trim();
    }
    
    // Validate and parse location
    if (location) {
      try {
        const parsedLocation = JSON.parse(location);
        
        // Validate location structure
        if (!parsedLocation || typeof parsedLocation.lat !== 'number' || typeof parsedLocation.lng !== 'number') {
          return res.status(400).json({ 
            message: 'Invalid location format. Location must be {lat: number, lng: number}' 
          });
        }
        
        // Validate coordinate ranges
        if (parsedLocation.lat < -90 || parsedLocation.lat > 90 || 
            parsedLocation.lng < -180 || parsedLocation.lng > 180) {
          return res.status(400).json({ 
            message: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180' 
          });
        }
        
        req.body.location = parsedLocation;
      } catch (error) {
        return res.status(400).json({ 
          message: 'Invalid location JSON format' 
        });
      }
    }
    
    // Validate animal type
    if (req.body.animalType) {
      const animalTypes = ['dog', 'cat', 'cow', 'goat', 'horse', 'pig', 'bird', 'rabbit', 'other'];
      const animalTypeStr = String(req.body.animalType).toLowerCase().trim();
      if (!animalTypes.includes(animalTypeStr)) {
        return res.status(400).json({ 
          message: 'Invalid animal type. Must be one of: ' + animalTypes.join(', ') 
        });
      }
    }
    
    // Validate description length
    if (req.body.description && req.body.description.length > 1000) {
      return res.status(400).json({ 
        message: 'Description too long. Maximum 1000 characters allowed' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ message: 'Validation error' });
  }
};

// Test the validation logic
function testValidation() {
  console.log('Testing validation logic...');
  
  // Mock request and response
  const mockReq = {
    body: {
      animalType: 'dog',
      description: 'Test case',
      location: '{"lat": 12.9716, "lng": 77.5946}'
    }
  };
  
  const mockRes = {
    status: (code) => ({
      json: (data) => {
        console.log(`Status ${code}:`, data);
        return mockRes;
      }
    })
  };
  
  const mockNext = () => {
    console.log('✅ Validation passed!');
  };
  
  console.log('Input data:', mockReq.body);
  validateCaseInput(mockReq, mockRes, mockNext);
  
  console.log('Final processed data:', mockReq.body);
}

testValidation();