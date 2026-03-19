const mongoose = require('mongoose');
const User = require('./models/User');
const Case = require('./models/Case');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/jeeva-raksha')
.then(() => {
  console.log('Connected to MongoDB');
  seedData();
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Case.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',  // Let the pre-save hook handle hashing
      role: 'admin'
    });
    await admin.save();
    console.log('Created admin user: admin@demo.com / admin123');

    // Create regular users
    const user1 = new User({
      name: 'John Doe',
      email: 'user@demo.com',
      password: 'password123',  // Let the pre-save hook handle hashing
      role: 'user'
    });
    await user1.save();

    const user2 = new User({
      name: 'Jane Smith',
      email: 'jane@demo.com',
      password: 'password123',  // Let the pre-save hook handle hashing
      role: 'user'
    });
    await user2.save();
    console.log('Created demo users: user@demo.com / password123');

    // Create sample cases
    const sampleCases = [
      {
        animalType: 'dog',
        description: 'Injured dog found near the park, appears to have a broken leg and is unable to walk properly.',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: 'Central Park, New York'
        },
        status: 'pending',
        priority: 'high',
        createdBy: user1._id,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        animalType: 'cat',
        description: 'Stray cat with visible wounds, seems to be malnourished and scared.',
        location: {
          lat: 40.7580,
          lng: -73.9855,
          address: 'Times Square, New York'
        },
        status: 'in_progress',
        priority: 'medium',
        createdBy: user2._id,
        assignedTo: admin._id,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        animalType: 'bird',
        description: 'Small bird with injured wing, unable to fly. Found on sidewalk.',
        location: {
          lat: 40.7489,
          lng: -73.9680,
          address: 'Grand Central Station, New York'
        },
        status: 'resolved',
        priority: 'low',
        createdBy: user1._id,
        assignedTo: admin._id,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        notes: [{
          content: 'Bird was taken to wildlife rescue center',
          addedBy: admin._id,
          addedAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
        }]
      },
      {
        animalType: 'cow',
        description: 'Cow wandering on highway, causing traffic hazard. Animal appears distressed.',
        location: {
          lat: 40.6782,
          lng: -73.9442,
          address: 'Brooklyn Highway, New York'
        },
        status: 'pending',
        priority: 'high',
        createdBy: user2._id,
        createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        animalType: 'goat',
        description: 'Group of goats found in residential area, possibly escaped from nearby farm.',
        location: {
          lat: 40.7282,
          lng: -73.9942,
          address: 'Greenwich Village, New York'
        },
        status: 'pending',
        priority: 'medium',
        createdBy: user1._id,
        createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      }
    ];

    for (const caseData of sampleCases) {
      const caseItem = new Case(caseData);
      await caseItem.save();
    }
    console.log('Created sample cases');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Demo Accounts:');
    console.log('Admin: admin@demo.com / admin123');
    console.log('User: user@demo.com / password123');
    console.log('User: jane@demo.com / password123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};
