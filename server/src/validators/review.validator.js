const Joi = require('joi');

const submitReviewSchema = Joi.object({
  productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  product: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  customerName: Joi.string().trim().min(2).max(60).required()
    .messages({
      'string.empty': 'Please provide your name',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 60 characters',
    }),
  customerLocation: Joi.string().trim().max(60).allow('').optional(),
  rating: Joi.number().integer().min(1).max(5).required()
    .messages({
      'number.min': 'Rating must be at least 1 star',
      'number.max': 'Rating cannot exceed 5 stars',
    }),
  comment: Joi.string().trim().min(5).max(500).required()
    .messages({
      'string.empty': 'Please provide a review comment',
      'string.min': 'Review comment must be at least 5 characters',
      'string.max': 'Review comment cannot exceed 500 characters',
    }),
  images: Joi.array().items(Joi.string().uri()).max(5).optional(),
  // Honeypot field for bot trapping: bots fill invisible fields, humans do not
  website: Joi.string().max(0).optional().messages({ 'string.max': 'Spam detected' }),
}).or('productId', 'product');

module.exports = { submitReviewSchema };
