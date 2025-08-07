import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Versions from './pages/Versions';
import Features from './pages/Features';
import Demo from './pages/Demo';
import Pricing from './pages/Pricing';
import Store from './pages/Store';
import About from './pages/About';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import LoginPage from './components/auth/LoginPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ProfilePage from './components/dashboard/ProfilePage';
import FormsLayout from './components/dashboard/FormsLayout';
import DemoRequestsManager from './components/dashboard/DemoRequestsManager';
import ContactFormsManager from './components/dashboard/ContactFormsManager';
import SupportRequestsManager from './components/dashboard/SupportRequestsManager';
import CMSLayout from './components/cms/CMSLayout';
import CMSDashboard from './components/cms/CMSDashboard';
import PagesManager from './components/cms/PagesManager';
import SectionsManager from './components/cms/SectionsManager';
import ContentManager from './components/cms/ContentManager';
import MediaManager from './components/cms/MediaManager';
import PricingManager from './components/cms/PricingManager';
import AddOnsManager from './components/cms/AddOnsManager';
import CMSSettings from './components/cms/CMSSettings';
import StoreLayout from './components/store/StoreLayout';
import StoreDashboard from './components/store/StoreDashboard';
import StoreAddOnsManager from './components/store/AddOnsManager';
import OrdersManager from './components/store/OrdersManager';
import StoreAnalytics from './components/store/StoreAnalytics';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CookieConsent from './components/ui/CookieConsent';
import PWAInstallPrompt from './components/ui/PWAInstallPrompt';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Main Website Routes */}
              <Route path="/*" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/versions" element={<Versions />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/demo" element={<Demo />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/store" element={<Store />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/faq" element={<FAQ />} />
                    </Routes>
                  </main>
                  <Footer />
                  <CookieConsent />
                  <PWAInstallPrompt />
                </>
              } />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardHome />} />
                <Route path="profile" element={<ProfilePage />} />
                
                {/* Forms Management Routes */}
                <Route path="forms" element={
                  <ProtectedRoute requiredRole={['super_admin']}>
                    <FormsLayout />
                  </ProtectedRoute>
                }>
                  <Route path="demo-requests" element={<DemoRequestsManager />} />
                  <Route path="contact-forms" element={<ContactFormsManager />} />
                  <Route path="support-requests" element={<SupportRequestsManager />} />
                </Route>
                
                {/* CMS Routes */}
                <Route path="cms" element={
                  <ProtectedRoute requiredRole={['super_admin']}>
                    <CMSLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<CMSDashboard />} />
                  <Route path="pages" element={<PagesManager />} />
                  <Route path="sections" element={<SectionsManager />} />
                  <Route path="content" element={<ContentManager />} />
                  <Route path="media" element={<MediaManager />} />
                  <Route path="pricing" element={<PricingManager />} />
                  <Route path="addons" element={<AddOnsManager />} />
                  <Route path="settings" element={<CMSSettings />} />
                </Route>
                
                {/* Store Management Routes */}
                <Route path="store" element={
                  <ProtectedRoute requiredRole={['super_admin', 'admin', 'teacher', 'staff']}>
                    <StoreLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<StoreDashboard />} />
                  <Route path="addons" element={<StoreAddOnsManager />} />
                  <Route path="orders" element={<OrdersManager />} />
                  <Route path="analytics" element={<StoreAnalytics />} />
                </Route>
              </Route>
            </Routes>
          </div>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;