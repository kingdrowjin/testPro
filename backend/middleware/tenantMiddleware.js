// backend/middleware/tenantMiddleware.js
const tenantFilter = (req, res, next) => {
    if (req.user.role === 'superadmin') {
      // Super admin can access all data
      next();
    } else {
      // Filter data by company for other users
      if (!req.query.companyId) {
        req.query.companyId = req.user.companyId;
      }
      
      // Ensure users can only access their company's data
      if (req.query.companyId !== req.user.companyId.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You can only access your company data.' 
        });
      }
      
      next();
    }
  };
  
  const ensureTenantData = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
      req.body.companyId = req.user.companyId;
    }
    next();
  };
  
  module.exports = { tenantFilter, ensureTenantData };