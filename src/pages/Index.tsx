
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AccommodationsSection } from "@/components/sections/AccommodationsSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { useEffect } from "react";

const Index = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <Header />
      <main>
        <HeroSection />
        <div className="animate-on-scroll">
          <AccommodationsSection />
        </div>
        <div className="animate-on-scroll">
          <HighlightsSection />
        </div>
        <div className="animate-on-scroll">
          <GallerySection />
        </div>
        <div className="animate-on-scroll">
          <PartnersSection />
        </div>
        <div className="animate-on-scroll">
          <NewsletterSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
