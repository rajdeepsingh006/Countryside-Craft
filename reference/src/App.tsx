import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
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

type ViewType =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'gallery'
  | 'about'
  | 'admin-login'
  | 'admin';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view as ViewType);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user tries to access admin directly without login
  useEffect(() => {
    if (currentView === 'admin' && !isAuthenticated) {
      setCurrentView('admin-login');
    }
  }, [currentView, isAuthenticated]);

  const isAdminView = currentView === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2D2A26] selection:bg-[#EADDC6] selection:text-[#241F18]">
      
      {/* Top Announcements & Header (Hidden on admin dashboard) */}
      {!isAdminView && (
        <>
          <AnnouncementBar onNavigate={handleNavigate} />
          <Navbar currentView={currentView} onNavigate={handleNavigate} />
        </>
      )}

      {/* Main Routed View */}
      <main className="flex-1">
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
            onLoginSuccess={() => setCurrentView('admin')}
            onNavigateHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onNavigateHome={() => setCurrentView('home')} />
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
      {!isAdminView && <WhatsAppFloating />}

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
