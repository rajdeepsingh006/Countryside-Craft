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
    pincode: Joi.string().trim().pattern(/^[1-9][0-9]{5}$/).allow('').max(10).optional()
      .messages({
        'string.pattern.base': 'Please enter a valid 6-digit Indian PIN code',
      }),
    email: Joi.string().email().allow('').max(150).optional(),
    note: Joi.string().trim().allow('').max(500).default(''),
  }).required(),

  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
          .messages({ 'string.pattern.base': 'Invalid product identifier format' }),
        quantity: Joi.number().integer().min(1).max(20).required(),
      })
    )
    .min(1)
    .max(50)
    .required(),

  paymentMethod: Joi.string().valid('razorpay', 'upi', 'whatsapp', 'cod', 'manual').default('whatsapp'),
  giftWrap: Joi.boolean().default(false),
  // Any client-supplied calculation/payment fields are stripped; server authoritatively computes all amounts
  amount: Joi.any().strip(),
  currency: Joi.any().strip(),
  receipt: Joi.any().strip(),
  notes: Joi.any().strip(),
  shippingCharge: Joi.any().strip(),
  shippingZone: Joi.any().strip(),
  totalWeightGrams: Joi.any().strip(),
  totalAmount: Joi.any().strip(),
});

module.exports = { createOrderSchema };
