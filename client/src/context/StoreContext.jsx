import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { galleryService } from '../services/galleryService';
import { reviewService } from '../services/reviewService';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from '../data/defaultProducts';
import { DEFAULT_GALLERY } from '../data/defaultGallery';

const STORE_SETTINGS = {
  storeName: 'Countryside Craft',
  tagline: 'Handcrafted Printed Totes & Sustainable Goods',
  announcementBarText: '✦ FESTIVE SALE: Free Handmade Zipper Pouch on orders over ₹1,499 | Pan-India 48hr Dispatch ✦',
  announcementEnabled: true,
  whatsappNumber: '917009361881',
  shippingNote: 'Prices exclude shipping/delivery charges (confirmed via WhatsApp based on exact pincode)',
  currencySymbol: '₹',
  contactEmail: 'hello@countrysidecraft.in',
  contactPhone: '+91 70093 61881',
  address: 'Punjab, India',
  instagramUrl: 'https://instagram.com/countryside_craft',
  facebookUrl: 'https://facebook.com/countrysidecraft',
  pinterestUrl: 'https://pinterest.com/countrysidecraft',
  freeShippingThreshold: 1499,
};

const defaultStoreContext = {
  products: DEFAULT_PRODUCTS,
  setProducts: () => {},
  categories: DEFAULT_CATEGORIES,
  setCategories: () => {},
  reviews: [],
  setReviews: () => {},
  gallery: DEFAULT_GALLERY,
  setGallery: () => {},
  settings: STORE_SETTINGS,
  setSettings: () => {},
  loading: false,
  activeQuickViewProduct: null,
  isSearchOpen: false,
  isReviewModalOpen: false,
  reviewModalProduct: null,
  toasts: [],
  refreshData: async () => {},
  openQuickView: () => {},
  closeQuickView: () => {},
  openSearch: () => {},
  closeSearch: () => {},
  openReviewModal: () => {},
  closeReviewModal: () => {},
  showToast: () => {},
  removeToast: () => {},
};

export const StoreContext = createContext(defaultStoreContext);

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState(DEFAULT_GALLERY);
  const [settings, setSettings] = useState(STORE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalProduct, setReviewModalProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  const refreshData = useCallback(async () => {
    try {
      const [prodsRes, catsRes, galRes, revsRes] = await Promise.allSettled([
        productService.getProducts({ limit: 100 }),
        productService.getCategories(),
        galleryService.getGallery(),
        reviewService.getApprovedReviews ? reviewService.getApprovedReviews() : Promise.resolve([]),
      ]);

      const rawProds = prodsRes.status === 'fulfilled' ? (prodsRes.value?.products || (Array.isArray(prodsRes.value) ? prodsRes.value : [])) : [];
      const rawCats = catsRes.status === 'fulfilled' ? (catsRes.value?.categories || (Array.isArray(catsRes.value) ? catsRes.value : [])) : [];
      const rawGal = galRes.status === 'fulfilled' ? (galRes.value?.items || (Array.isArray(galRes.value) ? galRes.value : [])) : [];
      const rawRevs = revsRes.status === 'fulfilled' ? (revsRes.value?.reviews || (Array.isArray(revsRes.value) ? revsRes.value : [])) : [];

      if (rawProds.length > 0) {
        // Normalize products so category and categoryName are always safe primitive strings
        const normalizedProducts = rawProds.map((p) => {
          const catObj = typeof p.category === 'object' && p.category !== null ? p.category : null;
          const catSlug = catObj?.slug || (typeof p.category === 'string' ? p.category : 'all');
          const catName = catObj?.name || p.categoryName || (typeof p.category === 'string' ? p.category : 'Handcrafted Item');

          return {
            ...p,
            category: catSlug,
            categoryName: catName,
            categoryObj: catObj,
            ratingAverage: p.ratingAverage || 5.0,
            ratingCount: p.ratingCount || 1,
            images: Array.isArray(p.images) ? p.images : [],
          };
        });

        // Attach itemCount to categories based on normalized products
        const baseCats = rawCats.length > 0 ? rawCats : DEFAULT_CATEGORIES;
        const catsWithCount = baseCats.map((cat) => ({
          ...cat,
          itemCount: normalizedProducts.filter((p) =>
            p.category === cat.slug || p.categoryObj?._id === cat._id
          ).length,
          image: cat.image || '',
        }));

        setProducts(normalizedProducts);
        setCategories(catsWithCount);
      } else {
        // Fall back to default 4 products if backend is empty/offline
        setProducts(DEFAULT_PRODUCTS);
        setCategories(DEFAULT_CATEGORIES);
      }

      setGallery(rawGal.length > 0 ? rawGal : DEFAULT_GALLERY);
      if (rawRevs.length > 0) setReviews(rawRevs);
    } catch (err) {
      console.error('Failed to load store data:', err);
      setProducts(DEFAULT_PRODUCTS);
      setCategories(DEFAULT_CATEGORIES);
      setGallery(DEFAULT_GALLERY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const showToast = (message, type = 'success') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const openQuickView = (product) => setActiveQuickViewProduct(product);
  const closeQuickView = () => setActiveQuickViewProduct(null);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);
  const openReviewModal = (product) => {
    setReviewModalProduct(product || products[0] || null);
    setIsReviewModalOpen(true);
  };
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewModalProduct(null);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        categories,
        setCategories,
        reviews,
        setReviews,
        gallery,
        setGallery,
        settings,
        setSettings,
        loading,
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  return ctx || defaultStoreContext;
};
