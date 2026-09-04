import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { SizeGuideModal } from './components/SizeGuideModal';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';

const AppContent: React.FC = () => {
  const { currentPage } = useShop();
  const { user, isAdmin, isLoading: isAuthLoading } = useAdminAuth();

  if (currentPage === 'admin') {
    if (isAuthLoading) {
      return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center font-sans">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-neutral-400 font-medium">Đang kiểm tra quyền hạn Quản trị viên...</p>
          </div>
        </div>
      );
    }

    // If not authenticated or not authorized as an explicit admin, show secure login page
    if (!user || !isAdmin) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
          <Toast />
          <AdminLoginPage />
        </div>
      );
    }

    // Authenticated admin view
    return (
      <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
        <Toast />
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Global Notifications & Modals */}
      <Toast />
      <SizeGuideModal />

      {/* Main Header */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'products' && <ProductsPage />}
        {currentPage === 'product-detail' && <ProductDetailPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'account' && <AccountPage />}
        {currentPage === 'my-orders' && <MyOrdersPage />}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AdminAuthProvider>
      <CustomerAuthProvider>
        <ShopProvider>
          <AppContent />
        </ShopProvider>
      </CustomerAuthProvider>
    </AdminAuthProvider>
  );
}
