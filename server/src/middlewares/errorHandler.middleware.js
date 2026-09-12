const { sendError } = require('../utils/apiResponse');

/**
 * Global error handler — must be the last middleware in app.js
 * Catches all errors thrown/passed via next(error)
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, messages.join('. '), 422);
  }

  // Mongoose duplicate key error (e.g. duplicate slug or username)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `A record with this ${field} already exists.`, 409);
  }

  // Mongoose cast error (e.g. invalid ObjectId in URL param)
  if (err.name === 'CastError') {
    return sendError(res, `Invalid value for field: ${err.path}`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token has expired.', 401);
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again.'
      : err.message;

  return sendError(res, message, statusCode);
};

module.exports = errorHandler;
