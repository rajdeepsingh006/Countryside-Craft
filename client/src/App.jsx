import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BottomTabBar } from './components/common/BottomTabBar';

import { WhatsAppFloating } from './components/common/WhatsAppFloating';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SearchModal } from './components/common/SearchModal';
import { ReviewModal } from './components/common/ReviewModal';
import { ToastContainer } from './components/common/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Helper to parse route from the current URL path or fallback
const parseRouteFromUrl = () => {
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const searchParams = new URLSearchParams(window.location.search);
  const categoryParam = searchParams.get('category');

  if (!pathname || pathname === 'home') {
    return { view: 'home', param: undefined };
  }

  const parts = pathname.split('/');
  const base = parts[0];

  if (base === 'products' || base === 'collection') {
    return { view: 'products', param: parts[1] || categoryParam || undefined };
  }
  if (base === 'product' || base === 'product-detail') {
    return { view: 'product-detail', param: parts[1] || undefined };
  }
  if (base === 'cart' || base === 'bag') {
    return { view: 'cart', param: undefined };
  }
  if (base === 'checkout') {
    return { view: 'checkout', param: undefined };
  }
  if (base === 'order-confirmation' || base === 'order') {
    return { view: 'order-confirmation', param: parts[1] || undefined };
  }
  if (base === 'gallery' || base === 'workshops') {
    return { view: 'gallery', param: undefined };
  }
  if (base === 'about' || base === 'story' || base === 'craft') {
    return { view: 'about', param: undefined };
  }
  if (base === 'admin') {
    return { view: 'admin', param: undefined };
  }
  if (base === 'admin-login') {
    return { view: 'admin-login', param: undefined };
  }

  try {
    const saved = localStorage.getItem('cc_current_route');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.view) return parsed;
    }
  } catch {}

  return { view: 'home', param: undefined };
};

// Helper to compute clean URL path from route view & param
const getUrlForRoute = (view, param) => {
  if (view === 'home') return '/';
  if (view === 'products') return param ? `/products/${encodeURIComponent(param)}` : '/products';
  if (view === 'product-detail') return `/product/${encodeURIComponent(param || '')}`;
  if (view === 'cart') return '/cart';
  if (view === 'checkout') return '/checkout';
  if (view === 'order-confirmation') return param ? `/order-confirmation/${encodeURIComponent(param)}` : '/order-confirmation';
  if (view === 'gallery') return '/gallery';
  if (view === 'about') return '/about';
  if (view === 'admin') return '/admin';
  if (view === 'admin-login') return '/admin-login';
  return '/';
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(() => parseRouteFromUrl());
  const currentView = currentRoute.view;
  const viewParam = currentRoute.param;

  const handleNavigate = (view, param, replace = false) => {
    setCurrentRoute({ view, param });
    const url = getUrlForRoute(view, param);
    if (replace) {
      window.history.replaceState({ view, param }, '', url);
    } else {
      window.history.pushState({ view, param }, '', url);
    }
    try {
      localStorage.setItem('cc_current_route', JSON.stringify({ view, param }));
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync browser back & forward navigation
  useEffect(() => {
    const onPopState = (e) => {
      if (e.state && e.state.view) {
        setCurrentRoute({ view: e.state.view, param: e.state.param });
      } else {
        const route = parseRouteFromUrl();
        setCurrentRoute(route);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Update URL on initial mount if on root or custom path
  useEffect(() => {
    const url = getUrlForRoute(currentView, viewParam);
    if (window.location.pathname !== url && window.location.pathname === '/') {
      window.history.replaceState({ view: currentView, param: viewParam }, '', url);
    }
  }, []);

  // Guard admin routes
  useEffect(() => {
    if (currentView === 'admin' && !isAuthenticated) {
      handleNavigate('admin-login', undefined, true);
    }
  }, [currentView, isAuthenticated]);

  const isAdminView = currentView === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2D2A26] selection:bg-[#EADDC6] selection:text-[#241F18]">
      
      {/* Top Header & Integrated Navbar (Hidden on admin dashboard) */}
      {!isAdminView && (
        <Navbar currentView={currentView} onNavigate={handleNavigate} />
      )}

      {/* Main Routed View (pb-16 on mobile gives breathing room above the sticky bottom bar) */}
      <main className="flex-1 pb-16 md:pb-0">

        {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}
        
        {currentView === 'products' && (
          <ProductsPage initialCategory={viewParam} onNavigate={handleNavigate} />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage slug={viewParam || ''} onNavigate={handleNavigate} />
        )}

        {currentView === 'cart' && <CartPage onNavigate={handleNavigate} />}

        {currentView === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}

        {currentView === 'order-confirmation' && (
          <OrderConfirmationPage orderId={viewParam || ''} onNavigate={handleNavigate} />
        )}

        {currentView === 'gallery' && <GalleryPage onNavigate={handleNavigate} />}

        {currentView === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentView === 'admin-login' && (
          <AdminLoginPage
            onLoginSuccess={() => handleNavigate('admin')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onNavigateHome={() => handleNavigate('home')} />
        )}
      </main>

      {/* Footer (Hidden in admin dashboard) */}
      {!isAdminView && <Footer onNavigate={handleNavigate} />}

      {/* Global Slideout Drawers & Modals */}
      <CartDrawer onNavigate={handleNavigate} />
      <QuickViewModal onNavigate={handleNavigate} />
      <SearchModal onNavigate={handleNavigate} />
      <ReviewModal />
      <ToastContainer />

      {/* Floating WhatsApp Chat Button on Storefront */}
      {!isAdminView && <WhatsAppFloating currentView={currentView} />}

      {/* Sticky Bottom Tab Bar on Mobile Storefront */}
      {!isAdminView && (
        <BottomTabBar currentView={currentView} onNavigate={handleNavigate} />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
