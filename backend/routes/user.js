// backend/routes/user.js
const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { tenantFilter } = require('../middleware/tenantMiddleware');

router.use(protect);

router.route('/')
  .get(authorize('superadmin', 'admin'), tenantFilter, getUsers)
  .post(authorize('superadmin', 'admin'), createUser);

router.route('/:id')
  .get(authorize('superadmin', 'admin'), getUser)
  .put(authorize('superadmin', 'admin'), updateUser)
  .delete(authorize('superadmin', 'admin'), deleteUser);

module.exports = router;