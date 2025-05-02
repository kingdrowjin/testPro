// backend/controllers/companyController.js
const Company = require('../models/Company');

// @desc    Create new company
// @route   POST /api/companies
// @access  Private/Superadmin
const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    
    res.status(201).json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private/Superadmin
const getCompanies = async (req, res) => {
  try {
    let query;

    // Search functionality
    if (req.query.search) {
      query = Company.find({
        $text: { $search: req.query.search }
      });
    } else {
      query = Company.find();
    }

    const companies = await query.sort('-createdAt');

    res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Private/Admin
const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/Superadmin
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/Superadmin
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    await company.remove();

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
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany
};