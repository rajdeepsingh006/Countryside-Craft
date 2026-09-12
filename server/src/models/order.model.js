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
    status: {
      type: String,
      enum: ['pending', 'pending_whatsapp', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
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

// Auto-generate human-readable order number before saving (ORD-00001, ORD-00002, ...)
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const Order = mongoose.model('Order');
    const count = await Order.countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
