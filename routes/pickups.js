const express = require('express');
const router = express.Router();
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/pickups - Get user's pickups
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const pickups = await Pickup.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pickup.countDocuments(filter);

    res.json({
      success: true,
      pickups,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/pickups - Schedule a pickup
router.post('/', protect, async (req, res) => {
  try {
    const { materialType, quantity, address, city, scheduledDate, timeSlot } = req.body;

    const pickup = new Pickup({
      user: req.user._id,
      materialType,
      quantity,
      address,
      city,
      scheduledDate,
      timeSlot
    });

    // Calculate rewards
    pickup.calculateRewards();
    await pickup.save();

    res.status(201).json({ success: true, pickup });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/pickups/:id - Get single pickup
router.get('/:id', protect, async (req, res) => {
  try {
    const pickup = await Pickup.findOne({ _id: req.params.id, user: req.user._id });
    if (!pickup) return res.status(404).json({ success: false, message: 'Pickup not found' });
    res.json({ success: true, pickup });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/pickups/:id/cancel - Cancel a pickup
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const pickup = await Pickup.findOne({ _id: req.params.id, user: req.user._id });
    if (!pickup) return res.status(404).json({ success: false, message: 'Pickup not found' });
    if (pickup.status === 'collected') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a collected pickup' });
    }
    pickup.status = 'cancelled';
    await pickup.save();
    res.json({ success: true, pickup });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/pickups/:id/collect - Mark as collected (admin/collector)
router.put('/:id/collect', protect, adminOnly, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

if (!pickup) {
  return res.status(404).json({
    success: false,
    message: 'Pickup not found'
  });
}

if (pickup.status === 'collected') {
  return res.status(400).json({
    success: false,
    message: 'Pickup has already been collected'
  });
}

if (pickup.status === 'cancelled') {
  return res.status(400).json({
    success: false,
    message: 'Cancelled pickups cannot be collected'
  });
}

pickup.status = 'collected';
    pickup.collectorNotes = req.body.notes || '';
    await pickup.save();

    // Credit rewards to user
    await User.findByIdAndUpdate(pickup.user, {
      $inc: {
        rewardPoints: pickup.pointsEarned,
        walletBalance: pickup.cashEarned,
        totalRecycled: pickup.quantity
      }
    });

    res.json({ success: true, pickup, message: `User credited ${pickup.pointsEarned} points and ₹${pickup.cashEarned}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/pickups/admin/all - Get all pickups (admin)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const pickups = await Pickup.find(filter)
      .populate('user', 'name email phone city')
      .sort({ createdAt: -1 });
    res.json({ success: true, pickups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
