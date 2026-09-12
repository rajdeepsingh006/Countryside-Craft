const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerLocation: {
      type: String,
      default: 'India',
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// After saving a review, update the product's cached rating stats
reviewSchema.post('save', async function () {
  await updateProductRating(this.product);
});

// Also update when approval status or fields change (findOneAndUpdate / findByIdAndUpdate)
reviewSchema.post('findOneAndUpdate', async function (doc) {
  if (doc && doc.product) {
    await updateProductRating(doc.product);
  }
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc && doc.product) {
    await updateProductRating(doc.product);
  }
});

async function updateProductRating(productId) {
  try {
    const Review = mongoose.model('Review');
    const Product = mongoose.model('Product');

    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
      {
        $group: {
          _id: '$product',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        ratingAverage: Math.round(stats[0].avgRating * 10) / 10,
        ratingCount: stats[0].count,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        ratingAverage: 5.0,
        ratingCount: 0,
      });
    }
  } catch (err) {
    console.error('Error updating product rating stats:', err);
  }
}

module.exports = mongoose.model('Review', reviewSchema);
