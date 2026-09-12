const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary.service');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');
const { DEFAULT_PRODUCTS } = require('../data/defaultProducts');

// ─── PUBLIC ─────────────────────────────────────────────────────

// GET /api/products  — List products with filter, sort, pagination
const getProducts = async (req, res) => {
  const { page = 1, limit = 100, sort = 'newest', category, tag, featured, search } = req.query;

  // Graceful fallback if database connection is pending or disconnected
  if (mongoose.connection.readyState !== 1) {
    let list = [...DEFAULT_PRODUCTS];
    if (category) {
      list = list.filter((p) => p.category?.slug === category || p.categorySlug === category);
    }
    if (tag) {
      list = list.filter((p) => p.tags.includes(tag));
    }
    if (featured === 'true') {
      list = list.filter((p) => p.isFeatured);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return sendSuccess(res, {
      products: list,
      pagination: {
        total: list.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(list.length / limit) || 1,
      },
    });
  }

  const filter = { isActive: true };
  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const foundCat = await Category.findOne({ slug: category });
      if (foundCat) filter.category = foundCat._id;
    }
  }
  if (tag) filter.tags = tag;
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    popular: { ratingCount: -1 },
  };

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sortOptions[sort] || sortOptions.newest)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  // If database is empty, return default 4 products
  if (products.length === 0 && total === 0) {
    return sendSuccess(res, {
      products: DEFAULT_PRODUCTS,
      pagination: {
        total: DEFAULT_PRODUCTS.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: 1,
      },
    });
  }

  return sendSuccess(res, {
    products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
};

// GET /api/products/:slug  — Single product detail
const getProductBySlug = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const product = DEFAULT_PRODUCTS.find((p) => p.slug === req.params.slug || p._id === req.params.slug);
    if (!product) return sendError(res, 'Product not found.', 404);
    return sendSuccess(res, { product });
  }

  const query = mongoose.Types.ObjectId.isValid(req.params.slug)
    ? { _id: req.params.slug, isActive: true }
    : { slug: req.params.slug, isActive: true };

  let product = await Product.findOne(query).populate('category', 'name slug');
  if (!product) {
    product = DEFAULT_PRODUCTS.find((p) => p.slug === req.params.slug || p._id === req.params.slug);
  }
  if (!product) return sendError(res, 'Product not found.', 404);
  return sendSuccess(res, { product });
};

// ─── ADMIN ──────────────────────────────────────────────────────

// GET /api/admin/products — All products (incl. inactive)
const adminGetProducts = async (req, res) => {
  const { page = 1, limit = 100, search, isActive } = req.query;
  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);
  return sendSuccess(res, { products, total, page: Number(page), totalPages: Math.ceil(total / limit) });
};

// POST /api/admin/products — Create product
const createProduct = async (req, res) => {
  const { error, value } = createProductSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return sendError(res, error.details.map((d) => d.message).join('. '), 422);

  // Resolve Category ID if a slug or name was sent
  let categoryId = value.category;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const foundCat = await Category.findOne({
      $or: [{ slug: categoryId }, { name: categoryId }],
    });
    if (foundCat) {
      categoryId = foundCat._id;
    } else {
      // Fallback to first available category
      const anyCat = await Category.findOne();
      if (anyCat) categoryId = anyCat._id;
      else return sendError(res, 'No valid category found. Please create a category first.', 422);
    }
  }
  value.category = categoryId;

  // Handle uploaded images and explicit image URLs
  let imageUrls = Array.isArray(value.images) ? [...value.images] : [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const { url } = await uploadToCloudinary(file.buffer, 'products', 'image');
      imageUrls.push(url);
    }
  }
  if (imageUrls.length === 0) {
    imageUrls = ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'];
  }

  const product = await Product.create({ ...value, images: imageUrls });
  await product.populate('category', 'name slug');
  return sendSuccess(res, { product }, 'Product created successfully', 201);
};

// PUT /api/admin/products/:id — Update product
const updateProduct = async (req, res) => {
  const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return sendError(res, error.details.map((d) => d.message).join('. '), 422);

  const product = await Product.findById(req.params.id);
  if (!product) return sendError(res, 'Product not found.', 404);

  // Resolve Category ID if needed
  if (value.category && !mongoose.Types.ObjectId.isValid(value.category)) {
    const foundCat = await Category.findOne({
      $or: [{ slug: value.category }, { name: value.category }],
    });
    if (foundCat) value.category = foundCat._id;
  }

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    const newImageUrls = [];
    for (const file of req.files) {
      const { url } = await uploadToCloudinary(file.buffer, 'products', 'image');
      newImageUrls.push(url);
    }
    value.images = [...(value.images || product.images || []), ...newImageUrls];
  }

  Object.assign(product, value);
  await product.save();
  await product.populate('category', 'name slug');
  return sendSuccess(res, { product }, 'Product updated successfully');
};

// DELETE /api/admin/products/:id — Soft delete (deactivate)
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) return sendError(res, 'Product not found.', 404);
  return sendSuccess(res, null, 'Product deactivated successfully');
};

module.exports = {
  getProducts,
  getProductBySlug,
  adminGetProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
