import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AccommodationsSection } from "@/components/sections/AccommodationsSection";
import { PromotionsSection } from "@/components/sections/PromotionsSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { useLandingSettings } from "@/hooks/useLanding";
import { defaultHeaderConfig } from "@/types/landing-config";

const Index = () => {
  const { data: headerSettings } = useLandingSettings("header");
  const browserTitle =
    headerSettings?.config?.browserTitle || defaultHeaderConfig.browserTitle || "Águas Claras";

  useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  return (
    <div className="w-full">
      <Header />
      <main>
        <HeroSection />
        <AccommodationsSection />
        <PromotionsSection />
        <HighlightsSection />
        <GallerySection />
        <PartnersSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
