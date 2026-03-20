const express = require('express');
const multer = require('multer');
const Case = require('../models/Case');
const { auth, adminAuth } = require('../middleware/auth');
const { validateCaseInput } = require('../middleware/validation');

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

// @route   POST /api/cases
// @desc    Create a new case
// @access  Private
router.post('/', auth, validateCaseInput, upload.single('image'), async (req, res) => {
  try {
    const { animalType, description, location } = req.body;
    
    let imageData = null;
    if (req.file) {
      // Convert image to base64
      imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const newCase = new Case({
      animalType,
      description,
      location: JSON.parse(location),
      image: imageData,
      createdBy: req.user._id
    });

    await newCase.save();
    await newCase.populate('createdBy', 'name email');

    // Emit real-time update to admin room
    const io = req.app.get('io');
    io.to('admin-room').emit('new-case', newCase);

    res.status(201).json({
      success: true,
      case: newCase
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cases
// @desc    Get all cases (admin) or user's cases (user)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cases;
    
    if (req.user.role === 'admin') {
      cases = await Case.find()
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    } else {
      cases = await Case.find({ createdBy: req.user._id })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      cases
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cases/map/locations
// @desc    Get all case locations for map
// @access  Private
router.get('/map/locations', auth, async (req, res) => {
  try {
    const cases = await Case.find({
      location: { $exists: true }
    }).select('location status priority animalType createdAt');

    res.json({
      success: true,
      cases
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cases/:id
// @desc    Get single case
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid case ID format' });
    }

    const caseItem = await Case.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check if user has access to this case
    if (req.user.role !== 'admin' && caseItem.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      case: caseItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cases/:id
// @desc    Update case status (admin can update any case, user can update their own cases)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid case ID format' });
    }

    const { status, priority, notes } = req.body;
    
    console.log('🔧 UPDATE CASE REQUEST:', {
      caseId: req.params.id,
      userId: req.user._id,
      userRole: req.user.role,
      requestedStatus: status,
      requestedPriority: priority
    });

    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      console.log('❌ Case not found:', req.params.id);
      return res.status(404).json({ message: 'Case not found' });
    }

    console.log('✅ Case found:', {
      caseId: caseItem._id,
      currentStatus: caseItem.status,
      createdBy: caseItem.createdBy,
      requestingUser: req.user._id
    });

    // Check permissions: admin can update any case, user can only update their own cases' status
    if (req.user.role !== 'admin' && caseItem.createdBy.toString() !== req.user._id.toString()) {
      console.log('❌ Access denied: User trying to update other user case');
      return res.status(403).json({ message: 'Access denied. You can only update your own cases.' });
    }

    // Users can only update status, admins can update everything
    if (req.user.role !== 'admin') {
      // Users can only update status to 'in_progress' or 'resolved'
      if (status && !['in_progress', 'resolved'].includes(status)) {
        console.log('❌ Invalid status for user:', status);
        return res.status(403).json({ message: 'Users can only mark cases as in progress or resolved.' });
      }
      // Users cannot change priority or add notes
      if (priority || notes) {
        console.log('❌ User trying to change priority or add notes');
        return res.status(403).json({ message: 'Only admins can change priority or add notes.' });
      }
    }

    // Update fields
    if (status) {
      console.log('🔄 Updating status from', caseItem.status, 'to', status);
      caseItem.status = status;
    }
    if (priority && req.user.role === 'admin') {
      console.log('🔄 Updating priority to', priority);
      caseItem.priority = priority;
    }
    if (status === 'in_progress' && !caseItem.assignedTo && req.user.role === 'admin') {
      caseItem.assignedTo = req.user._id;
    }

    // Add note if provided (admin only)
    if (notes && req.user.role === 'admin') {
      caseItem.notes.push({
        content: notes,
        addedBy: req.user._id,
        addedAt: new Date()
      });
    }

    caseItem.updatedAt = new Date();
    await caseItem.save();
    await caseItem.populate('createdBy', 'name email');
    await caseItem.populate('assignedTo', 'name email');
    await caseItem.populate('notes.addedBy', 'name email');

    console.log('✅ Case updated successfully:', {
      caseId: caseItem._id,
      newStatus: caseItem.status,
      newPriority: caseItem.priority
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.to('admin-room').emit('case-updated', caseItem);

    res.json({
      success: true,
      case: caseItem,
      message: `Case ${status === 'in_progress' ? 'started' : status === 'resolved' ? 'resolved' : 'updated'} successfully`
    });
  } catch (error) {
    console.error('❌ ERROR updating case:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/cases/:id
// @desc    Delete case (admin only)
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    await Case.findByIdAndDelete(req.params.id);

    // Emit real-time update
    const io = req.app.get('io');
    io.to('admin-room').emit('case-deleted', req.params.id);

    res.json({
      success: true,
      message: 'Case deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
