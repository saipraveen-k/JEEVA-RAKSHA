const express = require('express');
const multer = require('multer');
const axios = require('axios');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   POST /api/vision-check
// @desc    Check if uploaded image contains an animal
// @access  Public
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image file provided' 
      });
    }

    // Convert image to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Try Google Vision API first (if API key is available)
    let visionResult;
    if (process.env.GOOGLE_VISION_API_KEY) {
      try {
        visionResult = await checkWithGoogleVision(base64Image);
      } catch (error) {
        console.log('Google Vision failed, falling back to mock detection:', error.message);
        visionResult = await mockAnimalDetection(base64Image);
      }
    } else {
      // Fallback to mock detection for demo purposes
      visionResult = await mockAnimalDetection(base64Image);
    }

    res.json({
      success: true,
      ...visionResult
    });

  } catch (error) {
    console.error('Vision check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image',
      isAnimal: false,
      confidence: 0
    });
  }
});

// Google Vision API integration
async function checkWithGoogleVision(base64Image) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  
  const response = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      requests: [{
        image: {
          content: base64Image.split(',')[1] // Remove data:image/...;base64, prefix
        },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'OBJECT_LOCALIZATION', maxResults: 10 }
        ]
      }]
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const labels = response.data.responses[0]?.labelAnnotations || [];
  const objects = response.data.responses[0]?.localizedObjectAnnotations || [];

  // Animal-related keywords
  const animalKeywords = [
    'animal', 'dog', 'cat', 'cow', 'goat', 'horse', 'pig', 'bird', 'rabbit',
    'mammal', 'vertebrate', 'pet', 'domestic animal', 'wild animal',
    'canine', 'feline', 'bovine', 'equine', 'avian', 'reptile'
  ];

  // Check if any labels or objects contain animal keywords
  const allDetections = [...labels, ...objects];
  const animalDetections = allDetections.filter(item => {
    const description = (item.description || item.name || '').toLowerCase();
    return animalKeywords.some(keyword => description.includes(keyword));
  });

  const isAnimal = animalDetections.length > 0;
  const confidence = isAnimal 
    ? Math.max(...animalDetections.map(item => item.score || item.confidence || 0))
    : 0;

  return {
    isAnimal,
    confidence: Math.round(confidence * 100),
    detectedLabels: labels.map(label => ({
      label: label.description,
      confidence: Math.round((label.score || 0) * 100)
    })),
    detectedObjects: objects.map(obj => ({
      object: obj.name,
      confidence: Math.round((obj.score || 0) * 100)
    })),
    source: 'Google Vision API'
  };
}

// Mock animal detection for demo purposes
async function mockAnimalDetection(base64Image) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For demo purposes, randomly detect animals 70% of the time
  const isAnimal = Math.random() > 0.3;
  const confidence = isAnimal 
    ? Math.floor(Math.random() * 30) + 70 // 70-99% confidence
    : Math.floor(Math.random() * 40); // 0-39% confidence

  const mockLabels = isAnimal ? [
    { label: 'animal', confidence: confidence },
    { label: 'mammal', confidence: confidence - 10 },
    { label: 'dog', confidence: confidence - 20 }
  ] : [
    { label: 'plant', confidence: 60 },
    { label: 'tree', confidence: 50 },
    { label: 'nature', confidence: 40 }
  ];

  return {
    isAnimal,
    confidence,
    detectedLabels: mockLabels,
    detectedObjects: [],
    source: 'Mock Detection (Demo Mode)'
  };
}

module.exports = router;
