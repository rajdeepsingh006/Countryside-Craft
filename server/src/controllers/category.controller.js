const mongoose = require('mongoose');
const Category = require('../models/category.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { uploadToCloudinary } = require('../services/cloudinary.service');
const { DEFAULT_CATEGORIES } = require('../data/defaultProducts');

// GET /api/categories — Public list of all categories
const getCategories = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, { categories: DEFAULT_CATEGORIES });
  }

  const categories = await Category.find().sort({ name: 1 });
  if (categories.length === 0) {
    return sendSuccess(res, { categories: DEFAULT_CATEGORIES });
  }
  return sendSuccess(res, { categories });
};

// POST /api/admin/categories — Create category
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return sendError(res, 'Category name is required.', 422);

  let imageUrl = '';
  if (req.file) {
    const { url } = await uploadToCloudinary(req.file.buffer, 'categories', 'image');
    imageUrl = url;
  }

  const category = await Category.create({ name, description, image: imageUrl });
  return sendSuccess(res, { category }, 'Category created', 201);
};

// PUT /api/admin/categories/:id — Update category
const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (description !== undefined) updates.description = description;

  if (req.file) {
    const { url } = await uploadToCloudinary(req.file.buffer, 'categories', 'image');
    updates.image = url;
  }

  const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!category) return sendError(res, 'Category not found.', 404);
  return sendSuccess(res, { category }, 'Category updated');
};

// DELETE /api/admin/categories/:id — Delete category
const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return sendError(res, 'Category not found.', 404);
  return sendSuccess(res, null, 'Category deleted');
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
