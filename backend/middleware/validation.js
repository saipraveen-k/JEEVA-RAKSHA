const mongoSanitize = require('express-mongo-sanitize');
const { body, validationResult } = require('express-validator');

// Sanitize and validate case inputs
const validateCaseInput = (req, res, next) => {
  try {
    // Sanitize inputs to prevent NoSQL injection
    const { animalType, description, location } = req.body;
    
    if (animalType) {
      req.body.animalType = mongoSanitize(animalType.trim());
    }
    
    if (description) {
      req.body.description = mongoSanitize(description.trim());
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
      if (!animalTypes.includes(req.body.animalType.toLowerCase())) {
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

// Validate user registration inputs
const validateUserInput = (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Sanitize inputs
    if (name) req.body.name = mongoSanitize(name.trim());
    if (email) req.body.email = mongoSanitize(email.trim().toLowerCase());
    
    // Validate name
    if (!name || name.length < 2 || name.length > 50) {
      return res.status(400).json({ 
        message: 'Name must be between 2 and 50 characters' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }
    
    // Validate password strength
    if (!password || password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }
    
    if (password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({ 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ message: 'Validation error' });
  }
};

// Validate login inputs
const validateLoginInput = (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Sanitize inputs
    if (email) req.body.email = mongoSanitize(email.trim().toLowerCase());
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }
    
    // Validate password not empty
    if (!password || password.length === 0) {
      return res.status(400).json({ 
        message: 'Password is required' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ message: 'Validation error' });
  }
};

module.exports = {
  validateCaseInput,
  validateUserInput,
  validateLoginInput
};
