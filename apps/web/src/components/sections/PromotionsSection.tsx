
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

  if (isLoading) {
    return (
      <section className="page-section" style={{ backgroundColor: config.backgroundColor || '#F9F9F9' }}>
        <div className="page-container">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg text-muted-foreground">Carregando promoções...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section" style={{ backgroundColor: config.backgroundColor || '#F9F9F9' }}>
        <div className="page-container">
          <div className="text-center py-16">
            <p className="text-red-600 text-lg">
              Erro ao carregar promoções. Por favor, tente novamente mais tarde.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredPromotions.length === 0) {
    return null;
  }

  return (
    <section className="page-section" style={{ backgroundColor: config.backgroundColor || '#F9F9F9' }}>
      <div className="page-container">
        <div className="text-center mb-14">
          {config.title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: config.titleColor || '#000000' }}>
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="max-w-2xl mx-auto mb-6 text-muted-foreground" style={{ color: config.titleColor || '#000000' }}>
              {config.description}
            </p>
          )}
          <Button variant="outline" className="rounded-full transition-all duration-300 hover:shadow-sm" asChild>
            <Link to="/promocoes">Ver todas as promoções</Link>
          </Button>
        </div>

        {featuredPromotions.length <= 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto stagger-children">
            {featuredPromotions.map((promotion) => (
              <div key={promotion.id} className="h-full">
                <PromotionCard promotion={promotion} config={config} />
              </div>
            ))}
          </div>
        ) : (
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
