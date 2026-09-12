require('express-async-errors'); // Must be first — patches async error handling
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { CLIENT_URL, ADMIN_URL, SESSION_COOKIE_SECRET } = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler.middleware');

// Route imports
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const reviewRoutes = require('./routes/review.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const galleryRoutes = require('./routes/gallery.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ─── Security Middleware ─────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost ports (5173, 5174, etc.) and requests with no origin
      if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true, // Required for cookies (session, refresh token)
  })
);

// Global rate limit (protects all endpoints)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ─── Core Middleware ─────────────────────────────────────────────
app.use(logger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(SESSION_COOKIE_SECRET));

// ─── Health Check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Countryside Craft API is running 🌿', timestamp: new Date() });
});

// ─── Public Routes ───────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', reviewRoutes);          // /api/products/:id/reviews
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/gallery', galleryRoutes);

// ─── Admin & Auth Routes ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Global Error Handler (must be last) ────────────────────────
app.use(errorHandler);

module.exports = app;
