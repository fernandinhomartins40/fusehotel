
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { AccommodationsSection } from "@/components/sections/AccommodationsSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

const Index = () => {
  return (
    <div className="overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        <AccommodationsSection />
        <HighlightsSection />
        <GallerySection />
        <PartnersSection />
        <NewsletterSection />
      </main>
    </div>
  );
};

export default Index;
