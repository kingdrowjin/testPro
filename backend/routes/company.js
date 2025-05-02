// backend/routes/company.js
const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('superadmin', 'admin'), getCompanies)
  .post(authorize('superadmin'), createCompany);

router.route('/:id')
  .get(authorize('superadmin', 'admin'), getCompany)
  .put(authorize('superadmin'), updateCompany)
  .delete(authorize('superadmin'), deleteCompany);

module.exports = router;