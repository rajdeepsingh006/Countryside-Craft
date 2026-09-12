const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Countryside Craft',
    },
    shippingNote: {
      type: String,
      default: 'Prices shown exclude shipping/delivery charges. Delivery charges will be confirmed on WhatsApp.',
    },
    announcementBarText: {
      type: String,
      default: '✦ FESTIVE SALE: Free Handmade Zipper Pouch on orders over ₹1,499 | Pan-India 48hr Dispatch ✦',
    },
    announcementText: {
      type: String,
      default: '✦ FESTIVE SALE: Free Handmade Zipper Pouch on orders over ₹1,499 | Pan-India 48hr Dispatch ✦',
    },
    whatsappNumber: {
      type: String,
      default: '917009361881',
    },
    email: {
      type: String,
      default: 'hello@countrysidecraft.in',
    },
    contactEmail: {
      type: String,
      default: 'hello@countrysidecraft.in',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    freeShippingThreshold: {
      type: Number,
      default: 1499,
    },
  },
  { timestamps: true }
);

// Singleton pattern — only one settings document ever exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
