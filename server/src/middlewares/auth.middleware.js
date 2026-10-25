const { verifyAccessToken } = require('../utils/generateToken');
const { sendError } = require('../utils/apiResponse');
const Admin = require('../models/admin.model');

/**
 * Verifies the JWT access token from the Authorization header,
 * confirms active admin status, and validates tokenVersion against revocation.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return sendError(res, 'Admin account not found or deactivated.', 401);
    }

    // Verify token version against revocation
    if (decoded.tokenVersion !== undefined && admin.tokenVersion !== undefined) {
      if (decoded.tokenVersion !== admin.tokenVersion) {
        return sendError(res, 'Session revoked. Please log in again.', 401);
      }
    }

    req.admin = {
      id: admin._id.toString(),
      username: admin.username,
      role: admin.role,
      tokenVersion: admin.tokenVersion,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid or malformed token.', 401);
  }
};

module.exports = authMiddleware;
