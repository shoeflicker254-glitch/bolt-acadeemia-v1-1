import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Versions from './pages/Versions';
import Features from './pages/Features';
import Demo from './pages/Demo';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import Store from './pages/Store';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ProfilePage from './components/dashboard/ProfilePage';
import CMSLayout from './components/cms/CMSLayout';
import CMSDashboard from './components/cms/CMSDashboard';
import PagesManager from './components/cms/PagesManager';
import MediaManager from './components/cms/MediaManager';
import PricingManager from './components/cms/PricingManager';
import SectionsManager from './components/cms/SectionsManager';
import StoreLayout from './components/store/StoreLayout';
import StoreDashboard from './components/store/StoreDashboard';
import AddOnsManager from './components/store/AddOnsManager';
import OrdersManager from './components/store/OrdersManager';
import StoreAnalytics from './components/store/StoreAnalytics';
import TawkChat from './components/ui/TawkChat';
import CookieConsent from './components/ui/CookieConsent';
import PWAInstallPrompt from './components/ui/PWAInstallPrompt';
import PaymentSuccessPage from './components/ui/PaymentSuccessPage';
import FormsLayout from './components/dashboard/FormsLayout';
import DemoRequestsManager from './components/dashboard/DemoRequestsManager';
import ContactFormsManager from './components/dashboard/ContactFormsManager';
import SupportRequestsManager from './components/dashboard/SupportRequestsManager';
import EmailSupportRequestsManager from './components/dashboard/EmailSupportRequestsManager';
import NewsletterManager from './components/dashboard/NewsletterManager';
import CRMLayout from './components/crm/CRMLayout';
import CRMContacts from './components/crm/CRMContacts';
import CRMCompanies from './components/crm/CRMCompanies';
import CRMDeals from './components/crm/CRMDeals';
import CRMActivities from './components/crm/CRMActivities';
import CRMTasks from './components/crm/CRMTasks';
import CRMNotes from './components/crm/CRMNotes';
import CRMPipelines from './components/crm/CRMPipelines';
import CRMReports from './components/crm/CRMReports';
import CRMDashboard from './components/crm/CRMDashboard';

// Layout component for public pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
    <TawkChat />
    <CookieConsent />
    <PWAInstallPrompt />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            } />
          <Route path="/versions" element={
            <PublicLayout>
              <Versions />
            </PublicLayout>
          } />
          <Route path="/features" element={
            <PublicLayout>
              <Features />
            </PublicLayout>
          } />
          <Route path="/demo" element={
            <PublicLayout>
              <Demo />
            </PublicLayout>
          } />
          <Route path="/pricing" element={
            <PublicLayout>
              <Pricing />
            </PublicLayout>
          } />
          <Route path="/contact" element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          } />
          <Route path="/about" element={
            <PublicLayout>
              <About />
            </PublicLayout>
          } />
          <Route path="/terms" element={
            <PublicLayout>
              <Terms />
            </PublicLayout>
          } />
          <Route path="/privacy" element={
            <PublicLayout>
              <Privacy />
            </PublicLayout>
          } />
          <Route path="/faq" element={
            <PublicLayout>
              <FAQ />
            </PublicLayout>
          } />
          <Route path="/support" element={
            <PublicLayout>
              <Support />
            </PublicLayout>
          } />
          <Route path="/store" element={
            <PublicLayout>
              <Store />
            </PublicLayout>
          } />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/callback" element={<PaymentSuccessPage />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Newsletter Manager Route for Admin and Super Admin */}
            <Route path="newsletter" element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <NewsletterManager />
              </ProtectedRoute>
            } />

            {/* Support Requests Route for Admin and Super Admin */}
            <Route path="support" element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <SupportRequestsManager />
              </ProtectedRoute>
            } />

            {/* CRM Routes */}
            <Route path="crm" element={<CRMLayout />}>
              <Route index element={<CRMDashboard />} />
              <Route path="dashboard" element={<CRMDashboard />} />
              <Route path="contacts" element={<CRMContacts />} />
              <Route path="companies" element={<CRMCompanies />} />
              <Route path="deals" element={<CRMDeals />} />
              <Route path="activities" element={<CRMActivities />} />
              <Route path="tasks" element={<CRMTasks />} />
              <Route path="notes" element={<CRMNotes />} />
              <Route path="pipelines" element={<CRMPipelines />} />
              <Route path="reports" element={<CRMReports />} />
            </Route>

            {/* Super Admin Routes */}
            <Route path="super-admin" element={
              <ProtectedRoute requiredRole={['super_admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Super Admin Panel</h1>
                  <p className="text-gray-600">Manage all system operations from here.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="schools" element={
              <ProtectedRoute requiredRole={['super_admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Schools Management</h1>
                  <p className="text-gray-600">Manage all registered schools.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute requiredRole={['super_admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Users Management</h1>
                  <p className="text-gray-600">Manage all system users.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="subscriptions" element={
              <ProtectedRoute requiredRole={['super_admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Subscriptions</h1>
                  <p className="text-gray-600">Manage school subscriptions and billing.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="analytics" element={
              <ProtectedRoute requiredRole={['super_admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">System Analytics</h1>
                  <p className="text-gray-600">View system-wide analytics and reports.</p>
                </div>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="school" element={
              <ProtectedRoute requiredRole={['admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">School Management</h1>
                  <p className="text-gray-600">Manage your school settings and information.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="staff" element={
              <ProtectedRoute requiredRole={['admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Staff Management</h1>
                  <p className="text-gray-600">Manage teaching and administrative staff.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="finances" element={
              <ProtectedRoute requiredRole={['admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Financial Management</h1>
                  <p className="text-gray-600">Manage school finances and fee collection.</p>
                </div>
              </ProtectedRoute>
            } />

            {/* Teacher Routes */}
            <Route path="classes" element={
              <ProtectedRoute requiredRole={['admin', 'teacher']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Classes</h1>
                  <p className="text-gray-600">Manage your classes and students.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="students" element={
              <ProtectedRoute requiredRole={['admin', 'teacher', 'staff']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Students</h1>
                  <p className="text-gray-600">View and manage student information.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="schedule" element={
              <ProtectedRoute requiredRole={['teacher']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Class Schedule</h1>
                  <p className="text-gray-600">View your teaching schedule.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="assignments" element={
              <ProtectedRoute requiredRole={['teacher']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Assignments</h1>
                  <p className="text-gray-600">Create and manage student assignments.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="grades" element={
              <ProtectedRoute requiredRole={['teacher']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Grades</h1>
                  <p className="text-gray-600">Manage student grades and assessments.</p>
                </div>
              </ProtectedRoute>
            } />

            {/* Staff Routes */}
            <Route path="attendance" element={
              <ProtectedRoute requiredRole={['admin', 'teacher', 'staff']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Attendance</h1>
                  <p className="text-gray-600">Track student and staff attendance.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="records" element={
              <ProtectedRoute requiredRole={['staff']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Records Management</h1>
                  <p className="text-gray-600">Manage student and school records.</p>
                </div>
              </ProtectedRoute>
            } />

            {/* Common Routes */}
            <Route path="announcements" element={
              <ProtectedRoute requiredRole={['admin', 'teacher', 'staff']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Announcements</h1>
                  <p className="text-gray-600">View and manage school announcements.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute requiredRole={['admin', 'teacher']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Reports</h1>
                  <p className="text-gray-600">Generate and view various reports.</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="notifications" element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-gray-600">View your notifications and alerts.</p>
              </div>
            } />
            <Route path="documents" element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Documents</h1>
                <p className="text-gray-600">Access your documents and files.</p>
              </div>
            } />
            <Route path="settings" element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-gray-600">Configure your account and system settings.</p>
              </div>
            } />
            
            {/* Forms Management Routes - Super Admin Only */}
            <Route path="forms" element={
              <ProtectedRoute requiredRole={['super_admin']}>
                <FormsLayout />
              </ProtectedRoute>
            }>
              <Route path="demo-requests" element={<DemoRequestsManager />} />
              <Route path="contact-forms" element={<ContactFormsManager />} />
              <Route path="support-requests" element={<SupportRequestsManager />} />
              <Route path="email-support-requests" element={<EmailSupportRequestsManager />} />
            </Route>
            
            {/* CMS Routes - Super Admin Only */}
            <Route path="cms" element={
              <ProtectedRoute requiredRole={['super_admin']}>
                <CMSLayout />
              </ProtectedRoute>
            }>
              <Route index element={<CMSDashboard />} />
              <Route path="pages" element={<PagesManager />} />
              <Route path="media" element={<MediaManager />} />
              <Route path="pricing" element={<PricingManager />} />
              <Route path="addons" element={<AddOnsManager />} />
              <Route path="sections" element={<SectionsManager />} />
              <Route path="content" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Content Management</h1>
                  <p className="text-gray-600">Manage individual content items.</p>
                </div>
              } />
              <Route path="users" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">User Management</h1>
                  <p className="text-gray-600">Manage CMS users and permissions.</p>
                </div>
              } />
              <Route path="settings" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">CMS Settings</h1>
                  <p className="text-gray-600">Configure CMS settings and preferences.</p>
                </div>
              } />
            </Route>
            
            {/* Store Routes - Available to All Users */}
            <Route path="store" element={<StoreLayout />}>
              <Route index element={<StoreDashboard />} />
              <Route path="addons" element={<AddOnsManager />} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="analytics" element={<StoreAnalytics />} />
              <Route path="settings" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Store Settings</h1>
                  <p className="text-gray-600">Configure store settings and preferences.</p>
                </div>
              } />
            </Route>
          </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
