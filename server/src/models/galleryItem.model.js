const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'workshops',
    },
    location: {
      type: String,
      default: 'India',
    },
    tags: {
      type: [String],
      default: [],
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
