import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { BrowserBranding } from "@/components/layout/BrowserBranding";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import RoomDetail from "./pages/RoomDetail";
import Accommodations from "./pages/Accommodations";
import Promotions from "./pages/Promotions";
import PromotionDetail from "./pages/PromotionDetail";
import CustomerArea from "./pages/CustomerArea";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAccommodations from "./pages/admin/Accommodations";
import Reservations from "./pages/admin/Reservations";
import SettingsNew from "./pages/admin/SettingsNew";
import PackagesPromotions from "./pages/admin/PackagesPromotions";
import Customers from "./pages/admin/Customers";
import LandingCustomizer from "./pages/admin/LandingCustomizer";
import ServicesCustomizer from "./pages/admin/ServicesCustomizer";
import AboutCustomizer from "./pages/admin/AboutCustomizer";
import FAQCustomizer from "./pages/admin/FAQCustomizer";
import ContactCustomizer from "./pages/admin/ContactCustomizer";
import Frontdesk from "./pages/admin/Frontdesk";
import RoomUnits from "./pages/admin/RoomUnits";
import Housekeeping from "./pages/admin/Housekeeping";
import Maintenance from "./pages/admin/Maintenance";
import POS from "./pages/admin/POS";
import Products from "./pages/admin/Products";
import PMSCentral from "./pages/admin/PMSCentral";
import Reports from "./pages/admin/Reports";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ResetPassword from "./pages/ResetPassword";
import TermsOfService from "./pages/TermsOfService";
import PreCheckIn from "./pages/PreCheckIn";

const App = () => {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserBranding />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/acomodacoes" element={<Accommodations />} />
              <Route path="/acomodacoes/:roomId" element={<RoomDetail />} />
              <Route path="/promocoes" element={<Promotions />} />
              <Route path="/promocoes/:promotionId" element={<PromotionDetail />} />
              <Route path="/area-do-cliente" element={<CustomerArea />} />
              <Route path="/sobre-nos" element={<AboutUs />} />
              <Route path="/politicas-de-privacidade" element={<PrivacyPolicy />} />
              <Route path="/termos-de-uso" element={<TermsOfService />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/pre-check-in/:token" element={<PreCheckIn />} />

              <Route path="/admin/login" element={<AdminLogin />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <PMSCentral />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/accommodations"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <AdminAccommodations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/frontdesk"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Frontdesk />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reservations"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Reservations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/room-units"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <RoomUnits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/schedule"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Navigate to="/admin/reservations" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/housekeeping"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Housekeeping />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/maintenance"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Maintenance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/central"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Navigate to="/admin" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pos"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <POS />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/packages-promotions"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <PackagesPromotions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SettingsNew />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/landing-customizer"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <LandingCustomizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services-customizer"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <ServicesCustomizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/about-customizer"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <AboutCustomizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/faq-customizer"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <FAQCustomizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/contact-customizer"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <ContactCustomizer />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
