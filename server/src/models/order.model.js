const mongoose = require('mongoose');

// Snapshot schema — captures product info at time of order
// so order history stays accurate even if product is later edited/deleted
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' }, // snapshot of first image
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    customer: {
      name: { type: String, required: [true, 'Customer name is required'] },
      phone: { type: String, required: [true, 'Phone number is required'] },
      address: { type: String, required: [true, 'Address is required'] },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      email: { type: String, default: '' },
      note: { type: String, default: '' },
    },
    giftWrap: {
      type: Boolean,
      default: false,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingZone: {
      type: String,
      default: '',
    },
    totalWeightGrams: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      weightGrams: { type: Number, default: 150 },
      zone: { type: String, default: 'otherStates' },
      charge: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: [
        'pending',
        'pending_payment',
        'payment_pending_manual',
        'pending_whatsapp',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending_payment',
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'razorpay', 'cod', 'whatsapp', 'manual'],
      default: 'whatsapp',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'pending_manual', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: { type: String, default: '', index: true },
    razorpayPaymentId: { type: String, default: '' },
    manualPayment: {
      markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      markedAt: { type: Date },
      utrReference: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    stockRestored: {
      type: Boolean,
      default: false,
    },
    whatsappMessageSent: {
      type: Boolean,
      default: false,
    },
    sessionToken: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

const { getNextSequence } = require('./counter.model');

// Performance & Lookup Indexes
orderSchema.index({ razorpayOrderId: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Auto-generate human-readable order number atomically (ORD-00001, ORD-00002, ...)
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const seq = await getNextSequence('orderNumber');
    this.orderNumber = `ORD-${String(seq).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
