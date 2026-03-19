const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  animalType: {
    type: String,
    required: [true, 'Animal type is required'],
    enum: ['dog', 'cat', 'bird', 'cow', 'goat', 'other'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: null
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180
    },
    address: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Auto-assign priority based on description and animal type
caseSchema.pre('save', function(next) {
  // Only set priority on creation
  if (this.isNew) {
    const description = this.description.toLowerCase();
    const animalType = this.animalType.toLowerCase();
    
    // High priority keywords
    const highPriorityKeywords = ['blood', 'critical', 'severe', 'emergency', 'dying', 'dead', 'injured badly', 'broken bone', 'hit by car'];
    const hasHighPriorityKeyword = highPriorityKeywords.some(keyword => description.includes(keyword));
    
    if (hasHighPriorityKeyword) {
      this.priority = 'high';
    } else if (['cow', 'goat', 'horse', 'pig'].includes(animalType)) {
      // Large animals get medium priority
      this.priority = 'medium';
    } else {
      // Small animals or default cases get low priority
      this.priority = 'low';
    }
  }
  
  next();
});

// Index for location-based queries
caseSchema.index({ 'location': '2dsphere' });

// Index for status queries
caseSchema.index({ status: 1 });

// Index for created by queries
caseSchema.index({ createdBy: 1 });

// Index for priority queries
caseSchema.index({ priority: 1 });

module.exports = mongoose.model('Case', caseSchema);
