
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RoomDetail from "./pages/RoomDetail";
import Accommodations from "./pages/Accommodations";
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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/acomodacoes" element={<Accommodations />} />
            <Route path="/acomodacoes/:roomId" element={<RoomDetail />} />
            <Route path="/sobre-nos" element={<AboutUs />} />
            <Route path="/politicas-de-privacidade" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/servicos" element={<Services />} />
            
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
