
import React from 'react';
import { Link } from 'react-router-dom';
import { usePromotions } from '@/hooks/usePromotions';
import { useLandingSettings } from '@/hooks/useLanding';
import { defaultPromotionsConfig } from '@/types/landing-config';
import { PromotionCard } from '@/components/ui/PromotionCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { hydrateBrandColors } from '@/lib/brand-theme';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

export const PromotionsSection = () => {
  const { data: promotions, isLoading, error } = usePromotions({
    isActive: true,
    isFeatured: true
  });

  const { data: settingsData } = useLandingSettings('promotions');
  const config = hydrateBrandColors(settingsData?.config || defaultPromotionsConfig);

  const featuredPromotions = promotions || [];

  // If loading, show loader
  if (isLoading) {
    return (
      <section className="py-16" style={{ backgroundColor: config.backgroundColor || '#F9F9F9' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg">Carregando promoções...</span>
          </div>
        </div>
      </section>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <section className="py-16" style={{ backgroundColor: config.backgroundColor || '#F9F9F9' }}>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">
              Erro ao carregar promoções. Por favor, tente novamente mais tarde.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // If there are no featured promotions, don't render the section
  if (featuredPromotions.length === 0) {
    return null;
  }

  return (
    <section className="py-16" style={{ backgroundColor: config.backgroundColor || '#F9F9F9' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {config.title && (
            <h2 className="text-3xl font-bold mb-2" style={{ color: config.titleColor || '#000000' }}>
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="max-w-2xl mx-auto mb-6" style={{ color: config.titleColor || '#000000' }}>
              {config.description}
            </p>
          )}
          <Button variant="outline" asChild>
            <Link to="/promocoes">Ver todas as promoções</Link>
          </Button>
        </div>

        {featuredPromotions.length <= 2 ? (
          // Show grid for 1-2 promotions with improved responsiveness
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {featuredPromotions.map((promotion) => (
              <div key={promotion.id} className="h-full">
                <PromotionCard promotion={promotion} config={config} />
              </div>
            ))}
          </div>
        ) : (
          // Show carousel for 3+ promotions with improved responsiveness
          <div className="max-w-5xl mx-auto">
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-4">
                {featuredPromotions.map((promotion) => (
                  <CarouselItem key={promotion.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="h-full">
                      <PromotionCard promotion={promotion} config={config} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8">
                <CarouselPrevious className="static translate-y-0 mr-2" />
                <CarouselNext className="static translate-y-0 ml-2" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};
