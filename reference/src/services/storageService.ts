import { Product, Category, Review, GalleryItem, Order, AdminUser, StoreSettings, CartItem } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_GALLERY,
  INITIAL_ORDERS,
  INITIAL_ADMINS,
  INITIAL_SETTINGS
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'vana_products_v1',
  CATEGORIES: 'vana_categories_v1',
  REVIEWS: 'vana_reviews_v1',
  GALLERY: 'vana_gallery_v1',
  ORDERS: 'vana_orders_v1',
  ADMINS: 'vana_admins_v1',
  SETTINGS: 'vana_settings_v1',
  SESSION_TOKEN: 'vana_guest_session_token',
  CART: 'vana_cart_items_v1',
  ADMIN_AUTH: 'vana_admin_auth_v1'
};

// Initialize Storage Helper
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const storageService = {
  // Session management
  getSessionToken(): string {
    let token = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    if (!token) {
      token = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
    }
    return token;
  },

  // Products
  getProducts(): Product[] {
    return getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug || p._id === slug);
  },

  saveProduct(productData: Partial<Product>): Product {
    const products = this.getProducts();
    let updated: Product;

    if (productData._id) {
      // Update
      const index = products.findIndex((p) => p._id === productData._id);
      if (index !== -1) {
        updated = {
          ...products[index],
          ...productData,
          updatedAt: new Date().toISOString()
        } as Product;
        products[index] = updated;
      } else {
        updated = {
          ...productData,
          _id: productData._id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Product;
        products.push(updated);
      }
    } else {
      // Create new
      const newId = 'prod-' + Date.now();
      const slug = productData.name
        ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : 'product-' + newId;

      updated = {
        _id: newId,
        slug,
        name: productData.name || 'New Tote Bag',
        tagline: productData.tagline || '',
        description: productData.description || '',
        detailedStory: productData.detailedStory || '',
        images: productData.images?.length
          ? productData.images
          : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
        video: productData.video || '',
        price: Number(productData.price) || 699,
        originalPrice: Number(productData.originalPrice) || (Number(productData.price) ? Number(productData.price) * 1.3 : 999),
        discountPercent: Number(productData.discountPercent) || 0,
        stock: Number(productData.stock) || 10,
        category: productData.category || 'everyday-canvas',
        categoryName: productData.categoryName || 'Everyday Canvas',
        tags: productData.tags || ['Handcrafted'],
        isFeatured: Boolean(productData.isFeatured),
        isBestseller: Boolean(productData.isBestseller),
        isNewArrival: Boolean(productData.isNewArrival),
        ratingAverage: 5.0,
        ratingCount: 1,
        dimensions: productData.dimensions || '16" H x 14" W x 4" Gusset',
        material: productData.material || '450 GSM Heavy Canvas',
        handleLength: productData.handleLength || '11" Shoulder Drop',
        closureType: productData.closureType || 'Zipper + Magnetic Button',
        features: productData.features || ['Spacious main compartment', 'Inside zip pocket'],
        isActive: productData.isActive !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      products.unshift(updated);
    }

    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return updated;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p._id !== id);
    saveToStorage(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },

  // Categories
  getCategories(): Category[] {
    return getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  saveCategory(catData: Partial<Category>): Category {
    const categories = this.getCategories();
    let updated: Category;
    if (catData._id) {
      const idx = categories.findIndex((c) => c._id === catData._id);
      if (idx !== -1) {
        updated = { ...categories[idx], ...catData };
        categories[idx] = updated;
      } else {
        updated = { ...catData, _id: catData._id } as Category;
        categories.push(updated);
      }
    } else {
      updated = {
        _id: 'cat-' + Date.now(),
        name: catData.name || 'New Category',
        slug: (catData.name || 'cat').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: catData.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        description: catData.description || '',
        itemCount: 0
      };
      categories.push(updated);
    }
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return updated;
  },

  // Reviews
  getReviews(productId?: string): Review[] {
    const reviews = getFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return reviews.filter((r) => r.productId === productId);
    }
    return reviews;
  },

  addReview(reviewData: Omit<Review, '_id' | 'createdAt' | 'isApproved'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...reviewData,
      _id: 'rev-' + Date.now(),
      isApproved: false, // Default pending approval per PRD FR-16/FR-26
      createdAt: new Date().toISOString()
    };
    reviews.unshift(newReview);
    saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
  },

  updateReviewStatus(id: string, isApproved: boolean): boolean {
    const reviews = this.getReviews();
    const idx = reviews.findIndex((r) => r._id === id);
    if (idx !== -1) {
      reviews[idx].isApproved = isApproved;
      saveToStorage(STORAGE_KEYS.REVIEWS, reviews);

      // Recompute average rating for product
      const prodId = reviews[idx].productId;
      const prodReviews = reviews.filter((r) => r.productId === prodId && r.isApproved);
      if (prodReviews.length > 0) {
        const sum = prodReviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avg = parseFloat((sum / prodReviews.length).toFixed(1));
        const products = this.getProducts();
        const pIdx = products.findIndex((p) => p._id === prodId);
        if (pIdx !== -1) {
          products[pIdx].ratingAverage = avg;
          products[pIdx].ratingCount = prodReviews.length;
          saveToStorage(STORAGE_KEYS.PRODUCTS, products);
        }
      }
      return true;
    }
    return false;
  },

  deleteReview(id: string): boolean {
    const reviews = this.getReviews();
    const filtered = reviews.filter((r) => r._id !== id);
    saveToStorage(STORAGE_KEYS.REVIEWS, filtered);
    return true;
  },

  // Gallery
  getGallery(): GalleryItem[] {
    return getFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  },

  saveGalleryItem(itemData: Partial<GalleryItem>): GalleryItem {
    const gallery = this.getGallery();
    let updated: GalleryItem;
    if (itemData._id) {
      const idx = gallery.findIndex((g) => g._id === itemData._id);
      if (idx !== -1) {
        updated = { ...gallery[idx], ...itemData };
        gallery[idx] = updated;
      } else {
        updated = { ...itemData, _id: itemData._id } as GalleryItem;
        gallery.push(updated);
      }
    } else {
      updated = {
        _id: 'gal-' + Date.now(),
        title: itemData.title || 'Workshop Event',
        category: itemData.category || 'workshops',
        description: itemData.description || '',
        mediaType: itemData.mediaType || 'image',
        mediaUrl: itemData.mediaUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: itemData.thumbnailUrl,
        eventDate: itemData.eventDate || new Date().toISOString().split('T')[0],
        location: itemData.location || 'Vana Artisan Studio',
        attendeesCount: itemData.attendeesCount || 20
      };
      gallery.unshift(updated);
    }
    saveToStorage(STORAGE_KEYS.GALLERY, gallery);
    return updated;
  },

  deleteGalleryItem(id: string): boolean {
    const gallery = this.getGallery();
    const filtered = gallery.filter((g) => g._id !== id);
    saveToStorage(STORAGE_KEYS.GALLERY, filtered);
    return true;
  },

  // Orders
  getOrders(): Order[] {
    return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o._id === id || o.orderNumber === id);
  },

  createOrder(orderData: Omit<Order, '_id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getOrders();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `VANA-2026-${randomSeq}`;

    const newOrder: Order = {
      ...orderData,
      _id: 'ord-' + Date.now(),
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status'], adminNotes?: string): Order | null {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o._id === orderId || o.orderNumber === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      if (adminNotes !== undefined) {
        orders[idx].adminNotes = adminNotes;
      }
      orders[idx].updatedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.ORDERS, orders);
      return orders[idx];
    }
    return null;
  },

  // Cart Persistence
  getCart(): CartItem[] {
    return getFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  saveCart(cart: CartItem[]): void {
    saveToStorage(STORAGE_KEYS.CART, cart);
  },

  clearCart(): void {
    saveToStorage(STORAGE_KEYS.CART, []);
  },

  // Settings
  getSettings(): StoreSettings {
    return getFromStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  saveSettings(settings: StoreSettings): StoreSettings {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // Admins
  getAdmins(): AdminUser[] {
    return getFromStorage<AdminUser[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
  },

  saveAdmin(adminData: Partial<AdminUser>): AdminUser {
    const admins = this.getAdmins();
    let updated: AdminUser;
    if (adminData._id) {
      const idx = admins.findIndex((a) => a._id === adminData._id);
      if (idx !== -1) {
        updated = { ...admins[idx], ...adminData };
        admins[idx] = updated;
      } else {
        updated = { ...adminData, _id: adminData._id } as AdminUser;
        admins.push(updated);
      }
    } else {
      updated = {
        _id: 'admin-' + Date.now(),
        name: adminData.name || 'New Staff Admin',
        username: adminData.username || `admin_${Date.now()}`,
        email: adminData.email || '',
        role: adminData.role || 'admin',
        isActive: adminData.isActive !== false,
        createdBy: adminData.createdBy || 'admin-1',
        createdAt: new Date().toISOString()
      };
      admins.push(updated);
    }
    saveToStorage(STORAGE_KEYS.ADMINS, admins);
    return updated;
  },

  deleteAdmin(id: string): boolean {
    const admins = this.getAdmins();
    // Do not allow deleting the main admin
    const target = admins.find((a) => a._id === id);
    if (target && target.username === 'admin') {
      return false;
    }
    const filtered = admins.filter((a) => a._id !== id);
    saveToStorage(STORAGE_KEYS.ADMINS, filtered);
    return true;
  },

  // Reset all data to initial seed
  resetToInitial(): void {
    saveToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    saveToStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    saveToStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    saveToStorage(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    saveToStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    saveToStorage(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
    saveToStorage(STORAGE_KEYS.CART, []);
  }
};
