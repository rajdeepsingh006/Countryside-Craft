import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Review, GalleryItem, Order, StoreSettings, AdminUser } from '../types';
import { storageService } from '../services/storageService';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  gallery: GalleryItem[];
  orders: Order[];
  settings: StoreSettings;
  admins: AdminUser[];
  activeQuickViewProduct: Product | null;
  isSearchOpen: boolean;
  isReviewModalOpen: boolean;
  reviewModalProduct: Product | null;
  toasts: ToastNotification[];
  refreshData: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openReviewModal: (product?: Product) => void;
  closeReviewModal: () => void;
  showToast: (message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
  // Product actions
  saveProduct: (productData: Partial<Product>) => Product;
  deleteProduct: (id: string) => void;
  // Order actions
  createOrder: (orderData: Omit<Order, '_id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (id: string, status: Order['status'], adminNotes?: string) => void;
  // Review actions
  submitReview: (reviewData: Omit<Review, '_id' | 'createdAt' | 'isApproved'>) => Review;
  approveReview: (id: string, isApproved: boolean) => void;
  deleteReview: (id: string) => void;
  // Gallery actions
  saveGalleryItem: (item: Partial<GalleryItem>) => GalleryItem;
  deleteGalleryItem: (id: string) => void;
  // Admin actions
  saveAdminUser: (admin: Partial<AdminUser>) => AdminUser;
  deleteAdminUser: (id: string) => boolean;
  // Settings actions
  updateSettings: (settings: StoreSettings) => void;
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(() => storageService.getSettings());
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const refreshData = () => {
    setProducts(storageService.getProducts());
    setCategories(storageService.getCategories());
    setReviews(storageService.getReviews());
    setGallery(storageService.getGallery());
    setOrders(storageService.getOrders());
    setSettings(storageService.getSettings());
    setAdmins(storageService.getAdmins());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (message: string, type: ToastNotification['type'] = 'success') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openQuickView = (product: Product) => setActiveQuickViewProduct(product);
  const closeQuickView = () => setActiveQuickViewProduct(null);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openReviewModal = (product?: Product) => {
    setReviewModalProduct(product || products[0] || null);
    setIsReviewModalOpen(true);
  };
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewModalProduct(null);
  };

  // Product CRUD
  const saveProduct = (productData: Partial<Product>) => {
    const saved = storageService.saveProduct(productData);
    refreshData();
    showToast(productData._id ? 'Product updated successfully' : 'New tote bag design added to catalog', 'success');
    return saved;
  };

  const deleteProduct = (id: string) => {
    storageService.deleteProduct(id);
    refreshData();
    showToast('Product removed from catalog', 'info');
  };

  // Order actions
  const createOrder = (orderData: Omit<Order, '_id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const order = storageService.createOrder(orderData);
    refreshData();
    return order;
  };

  const updateOrderStatus = (id: string, status: Order['status'], adminNotes?: string) => {
    storageService.updateOrderStatus(id, status, adminNotes);
    refreshData();
    showToast(`Order status updated to ${status.toUpperCase()}`, 'success');
  };

  // Review actions
  const submitReview = (reviewData: Omit<Review, '_id' | 'createdAt' | 'isApproved'>) => {
    const review = storageService.addReview(reviewData);
    refreshData();
    showToast('Thank you! Your review has been submitted and is pending approval.', 'success');
    return review;
  };

  const approveReview = (id: string, isApproved: boolean) => {
    storageService.updateReviewStatus(id, isApproved);
    refreshData();
    showToast(isApproved ? 'Review approved and published' : 'Review rejected / hidden', 'info');
  };

  const deleteReview = (id: string) => {
    storageService.deleteReview(id);
    refreshData();
    showToast('Review deleted', 'info');
  };

  // Gallery CRUD
  const saveGalleryItem = (item: Partial<GalleryItem>) => {
    const saved = storageService.saveGalleryItem(item);
    refreshData();
    showToast(item._id ? 'Gallery entry updated' : 'New workshop/event media added to gallery', 'success');
    return saved;
  };

  const deleteGalleryItem = (id: string) => {
    storageService.deleteGalleryItem(id);
    refreshData();
    showToast('Gallery item removed', 'info');
  };

  // Admin CRUD
  const saveAdminUser = (admin: Partial<AdminUser>) => {
    const saved = storageService.saveAdmin(admin);
    refreshData();
    showToast(admin._id ? 'Admin details updated' : 'New admin account created', 'success');
    return saved;
  };

  const deleteAdminUser = (id: string) => {
    const success = storageService.deleteAdmin(id);
    if (success) {
      refreshData();
      showToast('Admin account removed', 'info');
      return true;
    } else {
      showToast('Cannot delete primary main admin', 'error');
      return false;
    }
  };

  // Settings
  const updateSettings = (newSettings: StoreSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
    showToast('Store settings updated successfully', 'success');
  };

  const resetAllData = () => {
    storageService.resetToInitial();
    refreshData();
    showToast('All store data reset to default seed state', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        reviews,
        gallery,
        orders,
        settings,
        admins,
        activeQuickViewProduct,
        isSearchOpen,
        isReviewModalOpen,
        reviewModalProduct,
        toasts,
        refreshData,
        openQuickView,
        closeQuickView,
        openSearch,
        closeSearch,
        openReviewModal,
        closeReviewModal,
        showToast,
        removeToast,
        saveProduct,
        deleteProduct,
        createOrder,
        updateOrderStatus,
        submitReview,
        approveReview,
        deleteReview,
        saveGalleryItem,
        deleteGalleryItem,
        saveAdminUser,
        deleteAdminUser,
        updateSettings,
        resetAllData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
