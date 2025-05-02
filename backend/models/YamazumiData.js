// backend/models/YamazumiData.js
const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nvaa: {
    type: Number,
    default: 0
  },
  vaa: {
    type: Number,
    default: 0
  },
  svaa: {
    type: Number,
    default: 0
  },
  unb: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  percentages: {
    nvaa: { type: Number, default: 0 },
    vaa: { type: Number, default: 0 },
    svaa: { type: Number, default: 0 },
    unb: { type: Number, default: 0 }
  }
});

const yamazumiDataSchema = new mongoose.Schema({
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
  stations: [stationSchema],
  totalData: {
    nvaa: { type: Number, default: 0 },
    vaa: { type: Number, default: 0 },
    svaa: { type: Number, default: 0 },
    unb: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate totals and percentages
yamazumiDataSchema.pre('save', function(next) {
  // Calculate totals for each station
  this.stations.forEach(station => {
    station.total = station.nvaa + station.vaa + station.svaa + station.unb;
    
    // Calculate percentages
    if (station.total > 0) {
      station.percentages.nvaa = Math.round((station.nvaa / station.total) * 100);
      station.percentages.vaa = Math.round((station.vaa / station.total) * 100);
      station.percentages.svaa = Math.round((station.svaa / station.total) * 100);
      station.percentages.unb = Math.round((station.unb / station.total) * 100);
    }
  });

  // Calculate total data
  this.totalData = {
    nvaa: this.stations.reduce((sum, station) => sum + station.nvaa, 0),
    vaa: this.stations.reduce((sum, station) => sum + station.vaa, 0),
    svaa: this.stations.reduce((sum, station) => sum + station.svaa, 0),
    unb: this.stations.reduce((sum, station) => sum + station.unb, 0),
    total: this.stations.reduce((sum, station) => sum + station.total, 0)
  };

  next();
});

// Ensure company-specific data
yamazumiDataSchema.index({ companyId: 1 });

module.exports = mongoose.model('YamazumiData', yamazumiDataSchema);