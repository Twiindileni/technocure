import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { MainLayout } from "./layouts/MainLayout";
import { PortalLayout } from "./layouts/PortalLayout";
import { AdminLayout, TechLayout } from "./layouts/AdminLayout";
import { ProtectedRoute, AdminRoute, TechnicianRoute, PublicRoute } from "./routes/guards";
import { LoadingState } from "./components/ui/Spinner";

// ── Lazy-loaded pages ──
const HomePage         = lazy(() => import("./pages/public/HomePage"));
const ServicesPage     = lazy(() => import("./pages/public/ServicesPage"));
const AboutPage        = lazy(() => import("./pages/public/AboutPage"));
const ContactPage      = lazy(() => import("./pages/public/ContactPage"));

const LoginPage        = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage     = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPage       = lazy(() => import("./pages/auth/ForgotPasswordPage"));

const NewTicketPage    = lazy(() => import("./pages/tickets/NewTicketPage"));
const TrackTicketPage  = lazy(() => import("./pages/tickets/TrackTicketPage"));

const PrintersPage     = lazy(() => import("./pages/shop/PrintersPage"));
const PrinterDetail    = lazy(() => import("./pages/shop/PrinterDetailPage"));
const PartsPage        = lazy(() => import("./pages/shop/PartsPage"));
const PartDetail       = lazy(() => import("./pages/shop/PartDetailPage"));
const RequestPartPage  = lazy(() => import("./pages/parts/RequestPartPage"));
const RequestQuotePage = lazy(() => import("./pages/quotes/RequestQuotePage"));

const PortalDashboard  = lazy(() => import("./pages/portal/PortalDashboard"));
const PortalTickets    = lazy(() => import("./pages/portal/PortalTicketsPage"));
const PortalProfile    = lazy(() => import("./pages/portal/PortalProfilePage"));
const PortalOrders     = lazy(() => import("./pages/portal/PortalOrdersPage"));
const PortalPartReqs   = lazy(() => import("./pages/portal/PortalPartRequestsPage"));

const AdminDashboard   = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminTickets     = lazy(() => import("./pages/admin/tickets/AdminTicketsPage"));
const AdminTicketDetail= lazy(() => import("./pages/admin/tickets/AdminTicketDetailPage"));
const AdminPrinters    = lazy(() => import("./pages/admin/inventory/AdminPrintersPage"));
const AdminParts       = lazy(() => import("./pages/admin/inventory/AdminPartsPage"));
const AdminCustomers   = lazy(() => import("./pages/admin/customers/AdminCustomersPage"));
const AdminCustomerDetail = lazy(() => import("./pages/admin/customers/CustomerDetailPage"));
const AdminQuotes      = lazy(() => import("./pages/admin/quotes/AdminQuotesPage"));
const AdminPartReqs    = lazy(() => import("./pages/admin/partRequests/AdminPartRequestsPage"));

const TechDashboard    = lazy(() => import("./pages/technician/TechDashboard"));
const TechTicketDetail = lazy(() => import("./pages/technician/TechTicketDetailPage"));

const Fallback = () => <div className="p-8"><LoadingState /></div>;

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} containerStyle={{ zIndex: 999999 }} />
          <Suspense fallback={<Fallback />}>
            <Routes>

              {/* ── Public ── */}
              <Route element={<MainLayout />}>
                <Route path="/"          element={<HomePage />} />
                <Route path="/services"  element={<ServicesPage />} />
                <Route path="/about"     element={<AboutPage />} />
                <Route path="/contact"   element={<ContactPage />} />

                <Route path="/tickets/new"   element={<NewTicketPage />} />
                <Route path="/tickets/track" element={<TrackTicketPage />} />

                <Route path="/shop/printers"     element={<PrintersPage />} />
                <Route path="/shop/printers/:id" element={<PrinterDetail />} />
                <Route path="/shop/parts"        element={<PartsPage />} />
                <Route path="/shop/parts/:id"    element={<PartDetail />} />
                <Route path="/parts/request"     element={<RequestPartPage />} />
                <Route path="/quotes/new"        element={<RequestQuotePage />} />

                {/* Auth */}
                <Route path="/auth/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/auth/register"        element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/auth/forgot-password" element={<ForgotPage />} />
              </Route>

              {/* ── Customer Portal ── */}
              <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
                <Route index          element={<PortalDashboard />} />
                <Route path="tickets" element={<PortalTickets />} />
                <Route path="orders"  element={<PortalOrders />} />
                <Route path="part-requests" element={<PortalPartReqs />} />
                <Route path="profile" element={<PortalProfile />} />
              </Route>

              {/* ── Admin ── */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index                         element={<AdminDashboard />} />
                <Route path="tickets"                element={<AdminTickets />} />
                <Route path="tickets/:id"            element={<AdminTicketDetail />} />
                <Route path="inventory/printers"     element={<AdminPrinters />} />
                <Route path="inventory/parts"        element={<AdminParts />} />
                <Route path="customers"              element={<AdminCustomers />} />
                <Route path="customers/:id"          element={<AdminCustomerDetail />} />
                <Route path="quotes"                 element={<AdminQuotes />} />
                <Route path="part-requests"          element={<AdminPartReqs />} />
              </Route>

              {/* ── Technician ── */}
              <Route path="/technician" element={<TechnicianRoute><TechLayout /></TechnicianRoute>}>
                <Route index           element={<TechDashboard />} />
                <Route path="tickets/:id" element={<TechTicketDetail />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
