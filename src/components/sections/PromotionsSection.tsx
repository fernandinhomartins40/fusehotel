
import React from 'react';
import { Promotion, mockPromotions } from '@/models/promotion';
import { PromotionCard } from '@/components/ui/PromotionCard';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

export const PromotionsSection = () => {
  const featuredPromotions = mockPromotions.filter(p => p.active && p.featured);
  
  // If there are no featured promotions, don't render the section
  if (featuredPromotions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Pacotes e Promoções</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira nossas ofertas especiais para tornar sua estadia ainda mais memorável.
          </p>
        </div>

        {featuredPromotions.length <= 2 ? (
          // Show grid for 1-2 promotions
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {featuredPromotions.map((promotion) => (
              <div key={promotion.id}>
                <PromotionCard promotion={promotion} />
              </div>
            ))}
          </div>
        ) : (
          // Show carousel for 3+ promotions
          <div className="max-w-5xl mx-auto">
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-4">
                {featuredPromotions.map((promotion) => (
                  <CarouselItem key={promotion.id} className="pl-4 md:basis-1/2">
                    <PromotionCard promotion={promotion} />
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
