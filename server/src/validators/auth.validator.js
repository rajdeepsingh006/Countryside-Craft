const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().trim().lowercase().required(),
  password: Joi.string().min(6).required(),
});

const createAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  username: Joi.string().trim().lowercase().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
  }),
  role: Joi.string().valid('admin', 'main_admin').default('admin'),
});

const updateAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  isActive: Joi.boolean(),
  role: Joi.string().valid('admin', 'main_admin'),
}).min(1);

module.exports = { loginSchema, createAdminSchema, updateAdminSchema };
