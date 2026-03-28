const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jeeva-raksha')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err.message));

// Create admin user function
const createAdminUser = async (name, email, password) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User ${email} already exists with role: ${existingUser.role}`);
      return existingUser;
    }

    // Create new admin user
    const adminUser = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await adminUser.save();
    console.log(`✅ Admin user created successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🎭 Role: admin`);
    
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
};

// List all users function
const listAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log('\n📋 All Users in Database:');
    console.log('─'.repeat(50));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log(`\nTotal users: ${users.length}`);
    return users;
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
    throw error;
  }
};

// Update user role function
const updateUserRole = async (email, newRole) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User ${email} not found`);
      return null;
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();
    
    console.log(`✅ User role updated successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔄 Role changed from: ${oldRole} → ${newRole}`);
    
    return user;
  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
    throw error;
  }
};

// Main execution
const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'create':
        if (args.length < 4) {
          console.log('Usage: node admin-tool.js create <name> <email> <password>');
          process.exit(1);
        }
        await createAdminUser(args[1], args[2], args[3]);
        break;

      case 'list':
        await listAllUsers();
        break;

      case 'update':
        if (args.length < 3) {
          console.log('Usage: node admin-tool.js update <email> <role>');
          console.log('Roles: user, admin');
          process.exit(1);
        }
        await updateUserRole(args[1], args[2]);
        break;

      case 'demo':
        console.log('🚀 Creating demo admin user...');
        await createAdminUser('Admin Demo', 'admin@demo.com', 'admin123');
        await listAllUsers();
        break;

      default:
        console.log('🛠️  Admin User Management Tool');
        console.log('');
        console.log('Commands:');
        console.log('  create <name> <email> <password>  - Create new admin user');
        console.log('  list                              - List all users');
        console.log('  update <email> <role>             - Update user role');
        console.log('  demo                              - Create demo admin user');
        console.log('');
        console.log('Examples:');
        console.log('  node admin-tool.js create "John Admin" john@admin.com password123');
        console.log('  node admin-tool.js list');
        console.log('  node admin-tool.js update user@example.com admin');
        console.log('  node admin-tool.js demo');
        break;
    }
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
  } finally {
    mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
};

main();
