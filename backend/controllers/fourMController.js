// backend/controllers/fourMController.js
const FourMData = require('../models/FourMData');

// @desc    Create new 4M data
// @route   POST /api/fourm
// @access  Private/Editor/Admin
const createFourMData = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const fourMData = await FourMData.create(req.body);
    
    res.status(201).json({
      success: true,
      data: fourMData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all 4M data
// @route   GET /api/fourm
// @access  Private
const getFourMData = async (req, res) => {
  try {
    let query;

    // If not superadmin, filter by company
    if (req.user.role !== 'superadmin') {
      query = FourMData.find({ companyId: req.user.companyId });
    } else {
      query = FourMData.find();
    }

    // Filter by company if specified
    if (req.query.companyId) {
      query = query.find({ companyId: req.query.companyId });
    }

    // Filter by project name if specified
    if (req.query.projectName) {
      query = query.find({ projectName: req.query.projectName });
    }

    const data = await query
      .populate('userId', 'name email')
      .populate('companyId', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single 4M data
// @route   GET /api/fourm/:id
// @access  Private
const getFourMDataById = async (req, res) => {
  try {
    const fourMData = await FourMData.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('companyId', 'name');

    if (!fourMData) {
      return res.status(404).json({
        success: false,
        message: '4M data not found'
      });
    }

    // Check if data belongs to user's company (for non-superadmin)
    if (req.user.role !== 'superadmin' && 
        fourMData.companyId._id.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this data'
      });
    }

    res.json({
      success: true,
      data: fourMData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update 4M data
// @route   PUT /api/fourm/:id
// @access  Private/Editor/Admin
const updateFourMData = async (req, res) => {
  try {
    let fourMData = await FourMData.findById(req.params.id);

    if (!fourMData) {
      return res.status(404).json({
        success: false,
        message: '4M data not found'
      });
    }

    // Check if data belongs to user's company (for non-superadmin)
    if (req.user.role !== 'superadmin' && 
        fourMData.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this data'
      });
    }

    req.body.lastUpdated = Date.now();
    
    fourMData = await FourMData.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: fourMData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete 4M data
// @route   DELETE /api/fourm/:id
// @access  Private/Admin
const deleteFourMData = async (req, res) => {
  try {
    const fourMData = await FourMData.findById(req.params.id);

    if (!fourMData) {
      return res.status(404).json({
        success: false,
        message: '4M data not found'
      });
    }

    // Check if data belongs to user's company (for non-superadmin)
    if (req.user.role !== 'superadmin' && 
        fourMData.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this data'
      });
    }

    await fourMData.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createFourMData,
  getFourMData,
  getFourMDataById,
  updateFourMData,
  deleteFourMData
};