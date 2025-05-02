// backend/controllers/yamazumiController.js
const YamazumiData = require('../models/YamazumiData');

// @desc    Create new Yamazumi data
// @route   POST /api/yamazumi
// @access  Private/Editor/Admin
const createYamazumiData = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const yamazumiData = await YamazumiData.create(req.body);
    
    res.status(201).json({
      success: true,
      data: yamazumiData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all Yamazumi data
// @route   GET /api/yamazumi
// @access  Private
const getYamazumiData = async (req, res) => {
  try {
    let query;

    // If not superadmin, filter by company
    if (req.user.role !== 'superadmin') {
      query = YamazumiData.find({ companyId: req.user.companyId });
    } else {
      query = YamazumiData.find();
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

// @desc    Get single Yamazumi data
// @route   GET /api/yamazumi/:id
// @access  Private
const getYamazumiDataById = async (req, res) => {
  try {
    const yamazumiData = await YamazumiData.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('companyId', 'name');

    if (!yamazumiData) {
      return res.status(404).json({
        success: false,
        message: 'Yamazumi data not found'
      });
    }

    // Check if data belongs to user's company (for non-superadmin)
    if (req.user.role !== 'superadmin' && 
        yamazumiData.companyId._id.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this data'
      });
    }

    res.json({
      success: true,
      data: yamazumiData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update Yamazumi data
// @route   PUT /api/yamazumi/:id
// @access  Private/Editor/Admin
const updateYamazumiData = async (req, res) => {
  try {
    let yamazumiData = await YamazumiData.findById(req.params.id);

    if (!yamazumiData) {
      return res.status(404).json({
        success: false,
        message: 'Yamazumi data not found'
      });
    }

    // Check if data belongs to user's company (for non-superadmin)
    if (req.user.role !== 'superadmin' && 
        yamazumiData.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this data'
      });
    }

    req.body.lastUpdated = Date.now();
    
    yamazumiData = await YamazumiData.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: yamazumiData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete Yamazumi data
// @route   DELETE /api/yamazumi/:id
// @access  Private/Admin
const deleteYamazumiData = async (req, res) => {
  try {
    const yamazumiData = await YamazumiData.findById(req.params.id);

    if (!yamazumiData) {
      return res.status(404).json({
        success: false,
        message: 'Yamazumi data not found'
      });
    }

    // Check if data belongs to user's company (for non-superadmin)
    if (req.user.role !== 'superadmin' && 
        yamazumiData.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this data'
      });
    }

    await yamazumiData.remove();

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
  createYamazumiData,
  getYamazumiData,
  getYamazumiDataById,
  updateYamazumiData,
  deleteYamazumiData
};