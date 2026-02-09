import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { HeaderCustomizer } from '@/components/admin/landing/HeaderCustomizer';
import { HeroCustomizer } from '@/components/admin/landing/HeroCustomizer';
import { AccommodationsCustomizer } from '@/components/admin/landing/AccommodationsCustomizer';
import { PromotionsCustomizer } from '@/components/admin/landing/PromotionsCustomizer';
import { HighlightsCustomizer } from '@/components/admin/landing/HighlightsCustomizer';
import { GalleryCustomizer } from '@/components/admin/landing/GalleryCustomizer';
import { PartnersCustomizer } from '@/components/admin/landing/PartnersCustomizer';
import { NewsletterCustomizer } from '@/components/admin/landing/NewsletterCustomizer';
import { FooterCustomizer } from '@/components/admin/landing/FooterCustomizer';

const LandingCustomizer = () => {
  const [activeTab, setActiveTab] = useState('header');

  const handlePreviewLandingPage = () => {
    window.open('/', '_blank');
  };

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        {/* Header com título e botão de preview */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Landing Page Customizer</h2>
            <p className="text-muted-foreground">
              Personalize cada seção da sua landing page
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={handlePreviewLandingPage}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Visualizar Landing Page
          </Button>
        </div>

        {/* Tabs com todos os customizers */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 lg:grid-cols-9 w-full">
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="accommodations">Acomodações</TabsTrigger>
            <TabsTrigger value="promotions">Promoções</TabsTrigger>
            <TabsTrigger value="highlights">Destaques</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="partners">Parceiros</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>

          <TabsContent value="header">
            <HeaderCustomizer />
          </TabsContent>

          <TabsContent value="hero">
            <HeroCustomizer />
          </TabsContent>

          <TabsContent value="accommodations">
            <AccommodationsCustomizer />
          </TabsContent>

          <TabsContent value="promotions">
            <PromotionsCustomizer />
          </TabsContent>

          <TabsContent value="highlights">
            <HighlightsCustomizer />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryCustomizer />
          </TabsContent>

          <TabsContent value="partners">
            <PartnersCustomizer />
          </TabsContent>

          <TabsContent value="newsletter">
            <NewsletterCustomizer />
          </TabsContent>

          <TabsContent value="footer">
            <FooterCustomizer />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default LandingCustomizer;
