// backend/models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  website: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for searching
companySchema.index({ name: 'text', address: 'text' });

module.exports = mongoose.model('Company', companySchema);