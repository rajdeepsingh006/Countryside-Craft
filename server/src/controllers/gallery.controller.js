const GalleryItem = require('../models/galleryItem.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// GET /api/gallery — Public & Admin gallery listing
const getGallery = async (req, res) => {
  const { page = 1, limit = 100, mediaType, category } = req.query;
  const filter = {};
  if (mediaType) filter.mediaType = mediaType;
  if (category && category !== 'all') filter.category = category;

  const items = await GalleryItem.find(filter)
    .sort({ eventDate: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await GalleryItem.countDocuments(filter);
  return sendSuccess(res, { items, total, page: Number(page), totalPages: Math.ceil(total / limit) });
};

// POST /api/admin/gallery — Upload or create gallery item (supports multiple photos/files)
const addGalleryItem = async (req, res) => {
  const {
    title,
    description,
    eventDate,
    mediaType,
    mediaUrl,
    images,
    thumbnailUrl,
    category,
    location,
    tags,
  } = req.body;

  if (!title || !title.trim()) {
    return sendError(res, 'Title is required.', 422);
  }

  // Parse images array from body if provided
  let collectedImages = [];
  if (Array.isArray(images)) {
    collectedImages = images.filter((img) => typeof img === 'string' && img.trim().length > 0);
  } else if (typeof images === 'string' && images.trim()) {
    collectedImages = images.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  }

  if (mediaUrl && mediaUrl.trim() && !collectedImages.includes(mediaUrl.trim())) {
    collectedImages.unshift(mediaUrl.trim());
  }

  let finalMediaType = mediaType || 'image';
  let primaryPublicId = '';

  // If multiple files were uploaded via multipart/form-data
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const isVideo = file.mimetype.startsWith('video/');
      const rType = isVideo ? 'video' : 'image';
      if (isVideo) finalMediaType = 'video';
      try {
        const uploaded = await uploadToCloudinary(file.buffer, 'gallery', rType);
        collectedImages.push(uploaded.url);
        if (!primaryPublicId) primaryPublicId = uploaded.publicId;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
      }
    }
  } else if (req.file) {
    const isVideo = req.file.mimetype.startsWith('video/');
    if (isVideo) finalMediaType = 'video';
    try {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'gallery', isVideo ? 'video' : 'image');
      collectedImages.push(uploaded.url);
      primaryPublicId = uploaded.publicId;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
    }
  }

  if (collectedImages.length === 0) {
    return sendError(res, 'At least one photo URL or file is required.', 422);
  }

  const primaryMediaUrl = collectedImages[0];
  const item = await GalleryItem.create({
    title: title.trim(),
    description: description ? description.trim() : '',
    mediaType: finalMediaType,
    mediaUrl: primaryMediaUrl,
    images: collectedImages,
    thumbnailUrl: thumbnailUrl && thumbnailUrl.trim() ? thumbnailUrl.trim() : primaryMediaUrl,
    category: category || 'workshops',
    location: location || 'India',
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : []),
    cloudinaryPublicId: primaryPublicId,
    eventDate: eventDate ? new Date(eventDate) : new Date(),
  });

  return sendSuccess(res, { item }, 'Gallery workshop item added successfully', 201);
};

// PUT /api/admin/gallery/:id — Update existing gallery item
const updateGalleryItem = async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) return sendError(res, 'Gallery item not found.', 404);

  const {
    title,
    description,
    eventDate,
    mediaType,
    mediaUrl,
    images,
    thumbnailUrl,
    category,
    location,
    tags,
  } = req.body;

  let collectedImages = [];
  if (Array.isArray(images)) {
    collectedImages = images.filter((img) => typeof img === 'string' && img.trim().length > 0);
  } else if (typeof images === 'string' && images.trim()) {
    collectedImages = images.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  }

  if (mediaUrl && mediaUrl.trim() && !collectedImages.includes(mediaUrl.trim())) {
    collectedImages.unshift(mediaUrl.trim());
  }

  // If new files were uploaded via multipart/form-data
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const isVideo = file.mimetype.startsWith('video/');
      const rType = isVideo ? 'video' : 'image';
      try {
        const uploaded = await uploadToCloudinary(file.buffer, 'gallery', rType);
        collectedImages.push(uploaded.url);
      } catch (err) {
        console.error('Cloudinary upload error:', err);
      }
    }
  }

  if (title) item.title = title.trim();
  if (description !== undefined) item.description = description.trim();
  if (mediaType) item.mediaType = mediaType;
  if (category) item.category = category;
  if (location) item.location = location;
  if (eventDate) item.eventDate = new Date(eventDate);
  if (tags) {
    item.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  if (collectedImages.length > 0) {
    item.images = collectedImages;
    item.mediaUrl = collectedImages[0];
    item.thumbnailUrl = thumbnailUrl && thumbnailUrl.trim() ? thumbnailUrl.trim() : collectedImages[0];
  } else if (thumbnailUrl) {
    item.thumbnailUrl = thumbnailUrl.trim();
  }

  await item.save();
  return sendSuccess(res, { item }, 'Gallery workshop item updated successfully');
};

// DELETE /api/admin/gallery/:id — Remove gallery item
const deleteGalleryItem = async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) return sendError(res, 'Gallery item not found.', 404);

  if (item.cloudinaryPublicId) {
    try {
      await deleteFromCloudinary(item.cloudinaryPublicId, item.mediaType);
    } catch (err) {
      console.warn('Cloudinary delete warning:', err.message);
    }
  }

  await item.deleteOne();
  return sendSuccess(res, null, 'Gallery item deleted');
};

module.exports = { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem };
