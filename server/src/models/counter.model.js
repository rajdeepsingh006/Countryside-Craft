const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

/**
 * Atomically increments and returns the next sequential integer for a given key.
 * Prevents race conditions during simultaneous order creation.
 * @param {string} sequenceName - Identifier for sequence (e.g. 'orderNumber')
 * @returns {Promise<number>}
 */
const getNextSequence = async (sequenceName) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

module.exports = { Counter, getNextSequence };
