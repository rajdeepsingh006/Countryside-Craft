const { sendError } = require('../utils/apiResponse');

/**
 * Role-based authorization middleware.
 * Must be used AFTER authMiddleware.
 * Usage: requireRole('main_admin') or requireRole(['main_admin', 'admin'])
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return sendError(res, 'Authentication required.', 401);
    }

    const allowedRoles = roles.flat();
    if (!allowedRoles.includes(req.admin.role)) {
      return sendError(
        res,
        'You do not have permission to perform this action.',
        403
      );
    }

    next();
  };
};

module.exports = { requireRole };
