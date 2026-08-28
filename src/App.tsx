import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Notification from '@/components/ui/Notification';

// Customer pages
import HomePage from '@/pages/customer/HomePage';
import ShopPage from '@/pages/customer/ShopPage';
import ProductDetailPage from '@/pages/customer/ProductDetailPage';
import CartPage from '@/pages/customer/CartPage';
import CheckoutPage from '@/pages/customer/CheckoutPage';
import OrderConfirmationPage from '@/pages/customer/OrderConfirmationPage';
import LoginPage from '@/pages/customer/LoginPage';
import WishlistPage from '@/pages/customer/WishlistPage';
import CustomerDashboardPage from '@/pages/customer/CustomerDashboardPage';
import OrderTrackingPage from '@/pages/customer/OrderTrackingPage';
import AboutPage from '@/pages/customer/AboutPage';
import ContactPage from '@/pages/customer/ContactPage';

// Admin pages
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminAddProduct from '@/pages/admin/AdminAddProduct';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminInventory from '@/pages/admin/AdminInventory';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminDiscounts from '@/pages/admin/AdminDiscounts';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminHomepageContent from '@/pages/admin/AdminHomepageContent';

import type { Category } from '@/data/mockData';

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  if (!state.isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Notification />
      <Routes>
        {/* Customer routes */}
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/shop" element={<CustomerLayout><ShopPage /></CustomerLayout>} />
        <Route path="/search" element={<CustomerLayout><ShopPage /></CustomerLayout>} />
        <Route path="/category/sanitary" element={<CustomerLayout><ShopPage filterCategory={'sanitary' as Category} /></CustomerLayout>} />
        <Route path="/category/hardware" element={<CustomerLayout><ShopPage filterCategory={'hardware' as Category} /></CustomerLayout>} />
        <Route path="/category/surgical" element={<CustomerLayout><ShopPage filterCategory={'surgical' as Category} /></CustomerLayout>} />
        <Route path="/category/household" element={<CustomerLayout><ShopPage filterCategory={'household' as Category} /></CustomerLayout>} />
        <Route path="/product/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
        <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
        <Route path="/order-confirmation/:id" element={<CustomerLayout><OrderConfirmationPage /></CustomerLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/wishlist" element={<CustomerLayout><WishlistPage /></CustomerLayout>} />
        <Route path="/account" element={<CustomerLayout><CustomerDashboardPage /></CustomerLayout>} />
        <Route path="/orders" element={<CustomerLayout><CustomerDashboardPage /></CustomerLayout>} />
        <Route path="/track/:id" element={<CustomerLayout><OrderTrackingPage /></CustomerLayout>} />
        <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
        <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="products/edit/:id" element={<AdminAddProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="discounts" element={<AdminDiscounts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="homepage" element={<AdminHomepageContent />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
