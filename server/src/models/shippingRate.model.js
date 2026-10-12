const mongoose = require('mongoose');

const rateSlabSchema = new mongoose.Schema(
  {
    maxGrams: { type: Number, required: true },
    local: { type: Number, required: true },
    withinState: { type: Number, required: true },
    zoneMetro: { type: Number, required: true },
    otherStates: { type: Number, required: true },
  },
  { _id: false }
);

const versionLogSchema = new mongoose.Schema(
  {
    savedAt: { type: Date, default: Date.now },
    savedBy: { type: String, default: 'admin' },
    note: { type: String, default: 'Updated Speed Post tariffs' },
    slabsCount: { type: Number, default: 0 },
    zoneMetroStates: { type: [String], default: [] },
  },
  { _id: false }
);

const shippingRateSchema = new mongoose.Schema(
  {
    weightSlabs: {
      type: [rateSlabSchema],
      default: [],
    },
    zoneMetroStates: {
      type: [String],
      default: [],
    },
    storeOriginState: {
      type: String,
      default: 'Punjab',
    },
    storeOriginCity: {
      type: String,
      default: 'Sirhind',
    },
    lastUpdatedBy: {
      type: String,
      default: 'Admin',
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    previousVersions: {
      type: [versionLogSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShippingRate', shippingRateSchema);
