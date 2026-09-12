const Joi = require('joi');

const createOrderSchema = Joi.object({
  customer: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    phone: Joi.string()
      .custom((value, helpers) => {
        // Strip non-digits
        const digits = value.replace(/\D/g, '');
        // Extract 10-digit Indian phone (strip leading 91 or 0)
        let normalized = digits;
        if (digits.length === 12 && digits.startsWith('91')) {
          normalized = digits.slice(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
          normalized = digits.slice(1);
        }
        if (!/^[6-9]\d{9}$/.test(normalized)) {
          return helpers.error('string.pattern.base');
        }
        return normalized;
      })
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)',
      }),
    address: Joi.string().trim().min(5).max(500).required(),
    city: Joi.string().trim().allow('').max(100).optional(),
    state: Joi.string().trim().allow('').max(100).optional(),
    pincode: Joi.string().trim().allow('').max(10).optional(),
    email: Joi.string().email().allow('').max(150).optional(),
    giftWrap: Joi.boolean().optional(),
    note: Joi.string().trim().allow('').max(500).default(''),
  })
    .unknown(true)
    .required(),
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        name: Joi.string().optional(),
        price: Joi.number().optional(),
        image: Joi.string().allow('').optional(),
      }).unknown(true)
    )
    .min(1)
    .required(),
}).unknown(true);

module.exports = { createOrderSchema };
