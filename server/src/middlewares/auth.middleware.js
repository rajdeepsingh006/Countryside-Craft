const { verifyAccessToken } = require('../utils/generateToken');
const { sendError } = require('../utils/apiResponse');

/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches decoded payload to req.admin on success.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.admin = decoded; // { id, username, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid or malformed token.', 401);
  }
};

module.exports = authMiddleware;
