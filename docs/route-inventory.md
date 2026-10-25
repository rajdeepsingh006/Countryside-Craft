# API Route Inventory

**Date:** October 25, 2026  
**Server Architecture:** Express 4.21.1 / Node.js  
**Source Files Analyzed:** `server/src/app.js`, `server/src/routes/*.routes.js`

---

## Executive Summary & Vulnerability Observations

1. **Unprotected Public Mutating Endpoints:**  
   - Multiple public endpoints accept write requests (`POST /api/reviews`, `POST /api/create-order`, `POST /api/verify-payment`, `POST /api/cart/*`) without schema validation (Joi) or specialized rate limiting.
   - `POST /api/create-order` allows client-specified order totals, leading directly to price tampering (C1).
   - `POST /api/reviews` automatically creates approved reviews with `isVerifiedPurchase: true` without authentication or proof of purchase (C7).
2. **Duplicate Route Mounts:**  
   - Payments are mounted at both `/api` and `/api/razorpay`.
   - Authentication is mounted at both `/api/auth` and `/api/admin/auth`.
   - These duplicates expand the attack surface and should be consolidated.
3. **Privilege Gaps:**  
   - Sensitive admin endpoints (`/api/admin/settings`, `/api/admin/orders/export`, `/api/admin/shipping/rates`, and product/category deletion) require only the generic `admin` role, not `main_admin` (C4).

---

## Route Inventory Table

| Method | Full Route Path | Auth Middleware | Input Validator | Rate Limiter | Controller Function | Public Mutating? |
|---|---|---|---|---|---|---|
| `GET` | `/api/health` | `none` | None | Global (500/15m) | Inline handler | No |
| `GET` | `/api/products` | `none` | None | Global (500/15m) | `product.controller.getProducts` | No |
| `GET` | `/api/products/:slug` | `none` | None | Global (500/15m) | `product.controller.getProductBySlug` | No |
| `GET` | `/api/categories` | `none` | None | Global (500/15m) | `category.controller.getCategories` | No |
| `GET` | `/api/reviews` | `none` | None | Global (500/15m) | `review.controller.getAllApprovedReviews` | No |
| `POST` | `/api/reviews` | `none` | None | Global (500/15m) | `review.controller.submitReview` | ⚠️ **YES (Public Write - No Joi)** |
| `GET` | `/api/products/:id/reviews` | `none` | None | Global (500/15m) | `review.controller.getProductReviews` | No |
| `POST` | `/api/products/:id/reviews` | `none` | None | Global (500/15m) | `review.controller.submitReview` | ⚠️ **YES (Public Write - No Joi)** |
| `GET` | `/api/cart` | `none` (Session) | None | Global (500/15m) | `cart.controller.getCart` | No |
| `POST` | `/api/cart/add` | `none` (Session) | None | Global (500/15m) | `cart.controller.addToCart` | ⚠️ **YES (Public Write - Session)** |
| `PUT` | `/api/cart/update` | `none` (Session) | None | Global (500/15m) | `cart.controller.updateCartItem` | ⚠️ **YES (Public Write - Session)** |
| `PATCH` | `/api/cart/update` | `none` (Session) | None | Global (500/15m) | `cart.controller.updateCartItem` | ⚠️ **YES (Public Write - Session)** |
| `DELETE` | `/api/cart/remove/:productId` | `none` (Session) | None | Global (500/15m) | `cart.controller.removeFromCart` | ⚠️ **YES (Public Write - Session)** |
| `DELETE` | `/api/cart/clear` | `none` (Session) | None | Global (500/15m) | `cart.controller.clearCart` | ⚠️ **YES (Public Write - Session)** |
| `POST` | `/api/orders` | `none` (Session) | `validate(createOrderSchema)` | `orderLimiter` (20/hr) + Global | `order.controller.createOrder` | ⚠️ **YES (Public Write - Joi Validated)** |
| `GET` | `/api/gallery` | `none` | None | Global (500/15m) | `gallery.controller.getGallery` | No |
| `POST` | `/api/shipping/calculate` | `none` | None | Global (500/15m) | `shipping.controller.calculate` | No (Calculation read-only) |
| `GET` | `/api/shipping/rates` | `none` | None | Global (500/15m) | `shipping.controller.getRates` | No |
| `POST` | `/api/create-order` | `none` | None | Global (500/15m) | `payment.controller.createRazorpayOrder` | ⚠️ **YES (Public Write - Price Tampering Risk)** |
| `POST` | `/api/verify-payment` | `none` | None | Global (500/15m) | `payment.controller.verifyRazorpayPayment` | ⚠️ **YES (Public Write - Payment State)** |
| `POST` | `/api/razorpay/create-order` | `none` | None | Global (500/15m) | `payment.controller.createRazorpayOrder` | ⚠️ **YES (Duplicate Mount - Public Write)** |
| `POST` | `/api/razorpay/verify-payment` | `none` | None | Global (500/15m) | `payment.controller.verifyRazorpayPayment` | ⚠️ **YES (Duplicate Mount - Public Write)** |
| `POST` | `/api/auth/login` | `none` | `validate(loginSchema)` | `loginLimiter` (10/15m) + Global | `auth.controller.login` | ⚠️ **YES (Public Write - Auth)** |
| `POST` | `/api/auth/refresh` | `none` (Cookie) | None | Global (500/15m) | `auth.controller.refreshToken` | ⚠️ **YES (Public Write - Token Refresh)** |
| `POST` | `/api/auth/logout` | `none` | None | Global (500/15m) | `auth.controller.logout` | ⚠️ **YES (Public Write - Cookie Clear)** |
| `POST` | `/api/admin/auth/login` | `none` | `validate(loginSchema)` | `loginLimiter` (10/15m) + Global | `auth.controller.login` | ⚠️ **YES (Duplicate Mount - Auth)** |
| `POST` | `/api/admin/auth/refresh` | `none` (Cookie) | None | Global (500/15m) | `auth.controller.refreshToken` | ⚠️ **YES (Duplicate Mount - Token Refresh)** |
| `POST` | `/api/admin/auth/logout` | `none` | None | Global (500/15m) | `auth.controller.logout` | ⚠️ **YES (Duplicate Mount - Cookie Clear)** |
| `GET` | `/api/admin/dashboard/stats` | `admin` (JWT) | None | Global (500/15m) | `dashboard.controller.getDashboardStats` | No |
| `GET` | `/api/admin/products` | `admin` (JWT) | None | Global (500/15m) | `product.controller.adminGetProducts` | No |
| `POST` | `/api/admin/products` | `admin` (JWT) | None (Multer 10 files) | Global (500/15m) | `product.controller.createProduct` | No (Admin only) |
| `PUT` | `/api/admin/products/:id` | `admin` (JWT) | None (Multer 10 files) | Global (500/15m) | `product.controller.updateProduct` | No (Admin only) |
| `DELETE` | `/api/admin/products/:id` | `admin` (JWT) | None | Global (500/15m) | `product.controller.deleteProduct` | No (Admin only) |
| `POST` | `/api/admin/categories` | `admin` (JWT) | None (Multer 1 file) | Global (500/15m) | `category.controller.createCategory` | No (Admin only) |
| `PUT` | `/api/admin/categories/:id` | `admin` (JWT) | None (Multer 1 file) | Global (500/15m) | `category.controller.updateCategory` | No (Admin only) |
| `DELETE` | `/api/admin/categories/:id` | `admin` (JWT) | None | Global (500/15m) | `category.controller.deleteCategory` | No (Admin only) |
| `GET` | `/api/admin/orders/export` | `admin` (JWT) | None | Global (500/15m) | `order.controller.exportOrders` | No (Exposes PII to any admin) |
| `GET` | `/api/admin/orders` | `admin` (JWT) | None | Global (500/15m) | `order.controller.adminGetOrders` | No |
| `GET` | `/api/admin/orders/:id` | `admin` (JWT) | None | Global (500/15m) | `order.controller.adminGetOrderById` | No |
| `PUT` | `/api/admin/orders/:id/status` | `admin` (JWT) | None | Global (500/15m) | `order.controller.updateOrderStatus` | No (Admin only) |
| `PATCH` | `/api/admin/orders/:id/status` | `admin` (JWT) | None | Global (500/15m) | `order.controller.updateOrderStatus` | No (Admin only) |
| `GET` | `/api/admin/reviews` | `admin` (JWT) | None | Global (500/15m) | `review.controller.adminGetReviews` | No |
| `POST` | `/api/admin/reviews` | `admin` (JWT) | None | Global (500/15m) | `review.controller.createAdminReview` | No (Admin only) |
| `PUT` | `/api/admin/reviews/:id/approve` | `admin` (JWT) | None | Global (500/15m) | `review.controller.approveReview` | No (Admin only) |
| `PATCH` | `/api/admin/reviews/:id/approve` | `admin` (JWT) | None | Global (500/15m) | `review.controller.approveReview` | No (Admin only) |
| `DELETE` | `/api/admin/reviews/:id` | `admin` (JWT) | None | Global (500/15m) | `review.controller.deleteReview` | No (Admin only) |
| `GET` | `/api/admin/gallery` | `admin` (JWT) | None | Global (500/15m) | `gallery.controller.getGallery` | No |
| `POST` | `/api/admin/gallery` | `admin` (JWT) | None (Multer 20 files) | Global (500/15m) | `gallery.controller.addGalleryItem` | No (Admin only) |
| `PUT` | `/api/admin/gallery/:id` | `admin` (JWT) | None (Multer 20 files) | Global (500/15m) | `gallery.controller.updateGalleryItem` | No (Admin only) |
| `DELETE` | `/api/admin/gallery/:id` | `admin` (JWT) | None | Global (500/15m) | `gallery.controller.deleteGalleryItem` | No (Admin only) |
| `GET` | `/api/admin/settings` | `admin` (JWT) | None | Global (500/15m) | `settings.controller.getSettings` | No |
| `PUT` | `/api/admin/settings` | `admin` (JWT) | None | Global (500/15m) | `settings.controller.updateSettings` | No (Admin only - UPI ID risk) |
| `GET` | `/api/admin/shipping/rates` | `admin` (JWT) | None | Global (500/15m) | `shipping.controller.getRates` | No |
| `PUT` | `/api/admin/shipping/rates` | `admin` (JWT) | None | Global (500/15m) | `shipping.controller.updateRates` | No (Admin only) |
| `POST` | `/api/admin/shipping/rates/reset` | `admin` (JWT) | None | Global (500/15m) | `shipping.controller.resetRates` | No (Admin only) |
| `GET` | `/api/admin/manage` | `main_admin` (JWT) | None | Global (500/15m) | `admin.controller.listAdmins` | No |
| `POST` | `/api/admin/manage` | `main_admin` (JWT) | `validate(createAdminSchema)` | Global (500/15m) | `admin.controller.createAdmin` | No (Main Admin only) |
| `PUT` | `/api/admin/manage/:id` | `main_admin` (JWT) | `validate(updateAdminSchema)` | Global (500/15m) | `admin.controller.updateAdmin` | No (Main Admin only) |
| `DELETE` | `/api/admin/manage/:id` | `main_admin` (JWT) | None | Global (500/15m) | `admin.controller.deleteAdmin` | No (Main Admin only) |
| `POST` | `/api/admin/upload` | `admin` (JWT) | None (Multer 10 files) | Global (500/15m) | `upload.controller.uploadFiles` | No (Admin only) |

---

## Public Mutating Routes Requiring Immediate Hardening

1. **`POST /api/reviews` & `POST /api/products/:id/reviews`**:
   - Currently allows unauthenticated arbitrary reviews with zero Joi validation.
   - Automatically sets `isVerifiedPurchase: true` and approves immediately.
2. **`POST /api/create-order` & `POST /api/razorpay/create-order`**:
   - Accepts amount, currency, and receipt from client request body.
   - Allows attacker to pay ₹1 for arbitrary cart contents.
3. **`POST /api/verify-payment` & `POST /api/razorpay/verify-payment`**:
   - Swallows database write failures (`catch (dbErr) { console.warn(...) }`).
   - Does not verify captured amount matches order total in database.
4. **`POST /api/cart/add`, `PUT /api/cart/update`, `DELETE /api/cart/remove/:productId`**:
   - Allows manipulation of session quantities without upper limits (e.g., negative or million quantities).
   - Generates database session documents unconditionally.
