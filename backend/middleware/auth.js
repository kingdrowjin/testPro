// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      req.companyId = req.user.companyId;
      
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const roleHierarchy = {
      'superadmin': 4,
      'admin': 3,
      'editor': 2,
      'viewer': 1
    };

    const userRoleLevel = roleHierarchy[req.user.role];
    const hasPermission = roles.some(role => roleHierarchy[role] <= userRoleLevel);

    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }

    next();
  };
};

module.exports = { protect, authorize };