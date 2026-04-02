import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AccommodationsSection } from "@/components/sections/AccommodationsSection";
import { PromotionsSection } from "@/components/sections/PromotionsSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
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
