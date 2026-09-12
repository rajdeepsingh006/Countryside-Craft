const { sendError } = require('../utils/apiResponse');

/**
 * Request validation middleware factory.
 * Usage: validate(joiSchema) — validates req.body against the schema.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,   // Return all errors, not just the first
      stripUnknown: true,  // Remove unknown keys from req.body
    });

    if (error) {
      const messages = error.details.map((d) => d.message).join('. ');
      return sendError(res, messages, 422);
    }

    req.body = value; // Replace body with sanitized values
    next();
  };
};

module.exports = { validate };
