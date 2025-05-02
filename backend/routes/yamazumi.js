// backend/routes/yamazumi.js
const express = require('express');
const router = express.Router();
const {
  createYamazumiData,
  getYamazumiData,
  getYamazumiDataById,
  updateYamazumiData,
  deleteYamazumiData
} = require('../controllers/yamazumiController');
const { protect, authorize } = require('../middleware/auth');
const { tenantFilter, ensureTenantData } = require('../middleware/tenantMiddleware');

router.use(protect);

router.route('/')
  .get(tenantFilter, getYamazumiData)
  .post(authorize('admin', 'editor'), ensureTenantData, createYamazumiData);

router.route('/:id')
  .get(tenantFilter, getYamazumiDataById)
  .put(authorize('admin', 'editor'), ensureTenantData, updateYamazumiData)
  .delete(authorize('admin'), deleteYamazumiData);

module.exports = router;