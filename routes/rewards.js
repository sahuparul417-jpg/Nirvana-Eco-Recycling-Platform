const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Redemption = require('../models/Redemption');
const { protect } = require('../middleware/authMiddleware');

// GET /api/rewards/stats - Get user reward stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('rewardPoints walletBalance totalRecycled name');
    const redemptions = await Redemption.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, stats: user, recentRedemptions: redemptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/rewards/redeem/cash - Redeem points for cash
router.post('/redeem/cash', protect, async (req, res) => {
  try {
    const { points } = req.body;
    if (!points || points < 100) {
      return res.status(400).json({ success: false, message: 'Minimum 100 points required for cash redemption' });
    }

    if (!Number.isInteger(points) || points < 100) {
  return res.status(400).json({
    success: false,
    message: 'Points must be a whole number of at least 100'
  });
}

const cashAmount = parseFloat((points * 0.1).toFixed(2));

const user = await User.findOneAndUpdate(
  {
    _id: req.user._id,
    rewardPoints: { $gte: points }
  },
  {
    $inc: {
      rewardPoints: -points,
      walletBalance: cashAmount
    }
  },
  {
    new: true
  }
);

if (!user) {
  return res.status(400).json({
    success: false,
    message: 'Insufficient reward points'
  });
}

    const redemption = await Redemption.create({
      user: req.user._id,
      type: 'cash',
      pointsUsed: points,
      cashAmount,
      status: 'completed'
    });

    res.json({ success: true, redemption, message: `₹${cashAmount} added to your wallet!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/rewards/redeem/product - Redeem points for eco product
router.post('/redeem/product', protect, async (req, res) => {
  try {
   const { productName, pointsCost } = req.body;

if (!productName || typeof productName !== 'string') {
  return res.status(400).json({
    success: false,
    message: 'Product name is required'
  });
}

if (!Number.isInteger(pointsCost) || pointsCost <= 0) {
  return res.status(400).json({
    success: false,
    message: 'Points cost must be a positive whole number'
  });
}

const user = await User.findOneAndUpdate(
  {
    _id: req.user._id,
    rewardPoints: { $gte: pointsCost }
  },
  {
    $inc: {
      rewardPoints: -pointsCost
    }
  },
  {
    new: true
  }
);

if (!user) {
  return res.status(400).json({
    success: false,
    message: 'Insufficient reward points'
  });
}

    const redemption = await Redemption.create({
      user: req.user._id,
      type: 'product',
      pointsUsed: pointsCost,
      productName: productName.trim(),
      status: 'pending'
    });

    res.json({ success: true, redemption, message: `${productName} redeemed successfully! We'll process it shortly.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/rewards/leaderboard - Top recyclers
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const leaders = await User.find({ role: 'user' })
      .select('name totalRecycled rewardPoints city')
      .sort({ totalRecycled: -1 })
      .limit(10);
    res.json({ success: true, leaderboard: leaders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
