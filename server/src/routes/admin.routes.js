const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/adminAuth.middleware');
const upload = require('../middlewares/upload.middleware');

// Controllers
const { adminGetProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { adminGetOrders, adminGetOrderById, updateOrderStatus, markOrderPaidManual, exportOrders } = require('../controllers/order.controller');
const { adminGetReviews, createAdminReview, approveReview, deleteReview } = require('../controllers/review.controller');
const { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/gallery.controller');
const { listAdmins, createAdmin, updateAdmin, deleteAdmin } = require('../controllers/admin.controller');
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { uploadFiles } = require('../controllers/upload.controller');
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { getRates, updateRates, resetRates } = require('../controllers/shipping.controller');

// Validators
const { validate } = require('../middlewares/validateRequest.middleware');
const { createAdminSchema, updateAdminSchema } = require('../validators/auth.validator');

// All admin routes require JWT auth
router.use(authMiddleware);

// ─── Dashboard ───────────────────────────────────────────────────
router.get('/dashboard/stats', getDashboardStats);

// ─── Products ────────────────────────────────────────────────────
router.get('/products', adminGetProducts);
router.post('/products', upload.array('images', 10), createProduct);
router.put('/products/:id', upload.array('images', 10), updateProduct);
router.delete('/products/:id', requireRole('main_admin'), deleteProduct);

// ─── Categories ──────────────────────────────────────────────────
router.post('/categories', upload.single('image'), createCategory);
router.put('/categories/:id', upload.single('image'), updateCategory);
router.delete('/categories/:id', requireRole('main_admin'), deleteCategory);

// ─── Orders ──────────────────────────────────────────────────────
router.get('/orders/export', requireRole('main_admin'), exportOrders); // must be before /:id route
router.get('/orders', adminGetOrders);
router.get('/orders/:id', adminGetOrderById);
router.put('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/mark-paid', markOrderPaidManual);
router.post('/orders/:id/mark-paid', markOrderPaidManual);

// ─── Reviews ────────────────────────────────────────────────
router.get('/reviews', adminGetReviews);
router.post('/reviews', createAdminReview);
router.put('/reviews/:id/approve', approveReview);
router.patch('/reviews/:id/approve', approveReview);
router.delete('/reviews/:id', requireRole('main_admin'), deleteReview);

// ─── Gallery ─────────────────────────────────────────────────────
router.get('/gallery', getGallery);
router.post('/gallery', upload.array('media', 20), addGalleryItem);
router.put('/gallery/:id', upload.array('media', 20), updateGalleryItem);
router.delete('/gallery/:id', requireRole('main_admin'), deleteGalleryItem);

// ─── Settings (UPI ID, WhatsApp, Store Rates) ────────────────────
router.get('/settings', getSettings);
router.put('/settings', requireRole('main_admin'), updateSettings);

// ─── Shipping Rates (Phase 2 FR-11 to FR-16) ────────────────────
router.get('/shipping/rates', getRates);
router.put('/shipping/rates', requireRole('main_admin'), updateRates);
router.post('/shipping/rates/reset', requireRole('main_admin'), resetRates);

// ─── Admin Management (Main Admin only) ───────────────────────
router.use('/manage', requireRole('main_admin'));
router.get('/manage', listAdmins);
router.post('/manage', validate(createAdminSchema), createAdmin);
router.put('/manage/:id', validate(updateAdminSchema), updateAdmin);
router.delete('/manage/:id', deleteAdmin);

// ─── File Upload ─────────────────────────────────────────────────
router.post('/upload', upload.array('files', 10), uploadFiles);

module.exports = router;
