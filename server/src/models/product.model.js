const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    detailedStory: {
      type: String,
      default: '',
    },
    material: {
      type: String,
      default: '450 GSM Heavyweight Organic Canvas',
    },
    dimensions: {
      type: String,
      default: '16" H x 15" W x 4" Gusset',
    },
    handleLength: {
      type: String,
      default: '11" Shoulder Drop',
    },
    closureType: {
      type: String,
      default: 'Antiqued Brass Zipper',
    },
    features: {
      type: [String],
      default: [],
    },
    images: {
      type: [String], // Image URLs
      default: [],
    },
    video: {
      type: String, // Video URL (optional)
      default: '',
    },
    videoThumbnail: {
      type: String, // Custom Video Thumbnail/Poster URL (optional)
      default: '',
    },
    weightGrams: {
      type: Number,
      required: true,
      default: 150, // Default 150g matching lightweight pouches & bags (PRD FR-1)
      min: [1, 'Weight must be at least 1 gram'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    ratingAverage: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingCount: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual: effectivePrice is the actual selling price (real price, not reduced)
productSchema.virtual('effectivePrice').get(function () {
  return this.price;
});

// Virtual: displayOriginalPrice is the increased strikethrough price
productSchema.virtual('displayOriginalPrice').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return this.originalPrice;
  }
  if (this.discountPercent > 0) {
    return Math.round(this.price / (1 - this.discountPercent / 100));
  }
  return this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Auto-generate slug from name before saving if not provided
productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
