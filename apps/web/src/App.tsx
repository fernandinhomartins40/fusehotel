
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
import Settings from "./pages/admin/Settings";
import PackagesPromotions from "./pages/admin/PackagesPromotions";
import Customers from "./pages/admin/Customers";
import LandingCustomizer from "./pages/admin/LandingCustomizer";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Services from "./pages/Services";

const App = () => {
  console.log('App component rendered');
  
  // Create QueryClient inside component to avoid SSR issues
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
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
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/servicos" element={<Services />} />

              {/* Admin Login - Public */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin routes - Protected */}
              <Route
                path="/admin"
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
                path="/admin/reservations"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <Reservations />
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
                    <Settings />
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

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
