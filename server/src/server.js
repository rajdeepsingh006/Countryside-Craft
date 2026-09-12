const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

const startServer = async () => {
  try {
    await connectDB();
    const Product = require('./models/product.model');
    await Product.updateMany(
      { $or: [{ video: /kJQP7kiw5Fk/i }, { video: /despacito/i }] },
      { $set: { video: '', videoThumbnail: '' } }
    );

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🌿 Countryside Craft API running on port ${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n⚠️  Port ${PORT} is already in use by another process.`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('❌ Failed to connect to database or start server:', err);
  }
};

startServer();
