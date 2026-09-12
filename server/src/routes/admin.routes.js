const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/adminAuth.middleware');
const upload = require('../middlewares/upload.middleware');

// Controllers
const { adminGetProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { adminGetOrders, adminGetOrderById, updateOrderStatus, exportOrders } = require('../controllers/order.controller');
const { adminGetReviews, createAdminReview, approveReview, deleteReview } = require('../controllers/review.controller');
const { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/gallery.controller');
const { listAdmins, createAdmin, updateAdmin, deleteAdmin } = require('../controllers/admin.controller');
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { uploadFiles } = require('../controllers/upload.controller');
const { getSettings, updateSettings } = require('../controllers/settings.controller');

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
router.delete('/products/:id', deleteProduct);

// ─── Categories ──────────────────────────────────────────────────
router.post('/categories', upload.single('image'), createCategory);
router.put('/categories/:id', upload.single('image'), updateCategory);
router.delete('/categories/:id', deleteCategory);

// ─── Orders ──────────────────────────────────────────────────────
router.get('/orders/export', exportOrders); // must be before /:id route
router.get('/orders', adminGetOrders);
router.get('/orders/:id', adminGetOrderById);
router.put('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/status', updateOrderStatus);

// ─── Reviews ────────────────────────────────────────────────
router.get('/reviews', adminGetReviews);
router.post('/reviews', createAdminReview);
router.put('/reviews/:id/approve', approveReview);
router.patch('/reviews/:id/approve', approveReview);
router.delete('/reviews/:id', deleteReview);

// ─── Gallery ─────────────────────────────────────────────────────
router.get('/gallery', getGallery);
router.post('/gallery', upload.array('media', 20), addGalleryItem);
router.put('/gallery/:id', upload.array('media', 20), updateGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

// ─── Settings ────────────────────────────────────────────────────
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// ─── Admin Management (Main Admin only) ───────────────────────
router.use('/manage', requireRole('main_admin'));
router.get('/manage', listAdmins);
router.post('/manage', validate(createAdminSchema), createAdmin);
router.put('/manage/:id', validate(updateAdminSchema), updateAdmin);
router.delete('/manage/:id', deleteAdmin);

// ─── File Upload ─────────────────────────────────────────────────
router.post('/upload', upload.array('files', 10), uploadFiles);

module.exports = router;
