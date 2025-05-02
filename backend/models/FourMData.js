// backend/models/FourMData.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['OK', 'KO'],
    default: 'OK'
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  }
});

const fourMDataSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  problemDescription: {
    type: String,
    required: true
  },
  categories: {
    method: [itemSchema],
    machine: [itemSchema],
    design: [itemSchema],
    man: [itemSchema],
    material: [itemSchema]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure company-specific data
fourMDataSchema.index({ companyId: 1 });

module.exports = mongoose.model('FourMData', fourMDataSchema);