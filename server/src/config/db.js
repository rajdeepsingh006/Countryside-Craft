const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`\n⚠️  MongoDB connection error: ${error.message}`);
    console.warn(`👉 If using MongoDB Atlas, verify that your current IP address or '0.0.0.0/0' (Allow Access From Anywhere) is added to your Atlas IP Access List:`);
    console.warn(`   https://cloud.mongodb.com → Network Access → Add IP Address\n`);
    return false;
  }
};

// Graceful shutdown on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed on app termination');
  process.exit(0);
});

module.exports = connectDB;
