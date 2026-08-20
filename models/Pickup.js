const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  materialType: {
    type: String,
    required: true,
    enum: ['plastic', 'paper', 'metal', 'glass', 'electronics', 'cardboard', 'rubber', 'textile']
  },
  quantity: {
  type: Number,
  required: [true, 'Quantity is required'],
  min: [0.1, 'Quantity must be at least 0.1 kg'],
  max: [1000, 'Quantity cannot exceed 1000 kg']
},
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: ['9AM-12PM', '12PM-3PM', '3PM-6PM']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'collected', 'cancelled'],
    default: 'pending'
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  cashEarned: {
    type: Number,
    default: 0
  },
  collectorNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Points per kg for each material type
const POINTS_PER_KG = {
  plastic: 20,
  paper: 10,
  metal: 30,
  glass: 15,
  electronics: 50,
  cardboard: 8,
  rubber: 12,
  textile: 10
};

// Cash per kg (in INR)
const CASH_PER_KG = {
  plastic: 5,
  paper: 3,
  metal: 15,
  glass: 4,
  electronics: 25,
  cardboard: 2,
  rubber: 6,
  textile: 3
};

pickupSchema.methods.calculateRewards = function() {
  const pointsPerKg = POINTS_PER_KG[this.materialType];
  const cashPerKg = CASH_PER_KG[this.materialType];

  if (pointsPerKg === undefined || cashPerKg === undefined) {
    throw new Error('Invalid material type');
  }

  if (!Number.isFinite(this.quantity) || this.quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  this.pointsEarned = Math.round(
    this.quantity * pointsPerKg
  );

  this.cashEarned = parseFloat(
    (this.quantity * cashPerKg).toFixed(2)
  );

  return {
    points: this.pointsEarned,
    cash: this.cashEarned
  };
};

module.exports = mongoose.model('Pickup', pickupSchema);
module.exports.POINTS_PER_KG = POINTS_PER_KG;
module.exports.CASH_PER_KG = CASH_PER_KG;
