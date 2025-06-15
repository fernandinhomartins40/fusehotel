
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import Index from "./pages/Index";
import RoomDetail from "./pages/RoomDetail";
import Accommodations from "./pages/Accommodations";
import Promotions from "./pages/Promotions";
import PromotionDetail from "./pages/PromotionDetail";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAccommodations from "./pages/admin/Accommodations";
import Reservations from "./pages/admin/Reservations";
import Settings from "./pages/admin/Settings";
import PackagesPromotions from "./pages/admin/PackagesPromotions";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Services from "./pages/Services";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer area pages
import Dashboard from "./pages/customer/Dashboard";
import CustomerReservations from "./pages/customer/Reservations";
import Favorites from "./pages/customer/Favorites";
import Profile from "./pages/customer/Profile";

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
              <Route path="/sobre-nos" element={<AboutUs />} />
              <Route path="/politicas-de-privacidade" element={<PrivacyPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/servicos" element={<Services />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              
              {/* Customer area routes (protected) */}
              <Route path="/area-do-cliente" element={
                <AuthGuard>
                  <CustomerLayout />
                </AuthGuard>
              }>
                <Route index element={<Dashboard />} />
                <Route path="reservas" element={<CustomerReservations />} />
                <Route path="favoritos" element={<Favorites />} />
                <Route path="perfil" element={<Profile />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/accommodations" element={<AdminAccommodations />} />
              <Route path="/admin/reservations" element={<Reservations />} />
              <Route path="/admin/packages-promotions" element={<PackagesPromotions />} />
              <Route path="/admin/settings" element={<Settings />} />
              
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
