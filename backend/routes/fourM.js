// backend/routes/fourM.js
const express = require('express');
const router = express.Router();
const {
  createFourMData,
  getFourMData,
  getFourMDataById,
  updateFourMData,
  deleteFourMData
} = require('../controllers/fourMController');
const { protect, authorize } = require('../middleware/auth');
const { tenantFilter, ensureTenantData } = require('../middleware/tenantMiddleware');

router.use(protect);

router.route('/')
  .get(tenantFilter, getFourMData)
  .post(authorize('admin', 'editor'), ensureTenantData, createFourMData);

router.route('/:id')
  .get(tenantFilter, getFourMDataById)
  .put(authorize('admin', 'editor'), ensureTenantData, updateFourMData)
  .delete(authorize('admin'), deleteFourMData);

module.exports = router;