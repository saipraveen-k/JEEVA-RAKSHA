const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with their points (admin only)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email role points createdAt')
      .sort({ points: -1 });
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics (admin only)
// @access  Private (Admin)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      stats: {
        total: totalUsers,
        admins: adminUsers,
        users: regularUsers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/:id/points
// @desc    Add points to a user (admin only)
// @access  Private (Admin)
router.post('/:id/points', adminAuth, async (req, res) => {
  try {
    const { points } = req.body;
    
    if (!points || typeof points !== 'number' || points <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid points amount is required' 
      });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    user.points += points;
    await user.save();
    
    res.json({
      success: true,
      message: `Added ${points} points to ${user.name}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points
      }
    });
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get users leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({})
      .select('name points')
      .sort({ points: -1 })
      .limit(10);
    
    res.json({
      success: true,
      leaderboard: users.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        points: user.points
      }))
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
