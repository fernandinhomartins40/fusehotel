import React, { useState } from 'react';
import { Calendar } from "lucide-react";
import { useHeroSlides, useLandingSettings } from '@/hooks/useLanding';
import { defaultHeroConfig } from '@/types/landing-config';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { hydrateBrandColors } from '@/lib/brand-theme';

export const HeroSection: React.FC = () => {
  const { data: slides, isLoading } = useHeroSlides();
  const { data: settingsData } = useLandingSettings('hero');
  const config = hydrateBrandColors(settingsData?.config || defaultHeroConfig);
  const [, setApi] = useState<CarouselApi>();
  const themedSlides = (slides || []).map((slide: any) => hydrateBrandColors(slide));

  const plugin = React.useRef(
    Autoplay({ delay: (config.autoplaySpeed || 5) * 1000, stopOnInteraction: true })
  );

  if (isLoading) {
    return (
      <section className="h-[700px] bg-gray-200 relative overflow-hidden flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </section>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <section className="page-section-hero h-[700px] bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(4, 34, 65, 0.8) 0%, rgba(4, 34, 65, 0.5) 45%, rgba(4, 34, 65, 0) 100%), url("/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png")'
        }}>
        <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 lg:px-24">
          <div className="page-container flex flex-col items-start text-left">
            <h2 className="text-white text-[13px] tracking-[2.7px] font-medium mb-5 uppercase">
              O refúgio perfeito para se desconectar
            </h2>
            <h1 className="text-white text-[80px] leading-[1.0] tracking-[0.4px] max-w-[650px] font-bold mb-8 uppercase max-sm:text-5xl max-sm:leading-[1.1]">
              Refúgio dos seus sonhos
            </h1>
            <p className="text-white text-base leading-[1.7] max-w-[580px] mb-8">
              Desfrute de uma estadia inesquecível em nosso resort à beira-mar,
              com acomodações de luxo e paisagens deslumbrantes.
            </p>

            <button className="flex items-center gap-2.5 text-primary-foreground font-medium text-sm bg-primary mb-8 px-8 py-4 rounded-full">
              <Calendar size={18} />
              AGENDAMENTO ONLINE
            </button>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
              <span className="text-white text-base">Mais de 1.000 avaliações</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      className="w-full"
      opts={{ loop: true }}
    >
      <CarouselContent>
        {themedSlides.map((slide: any) => {
          const overlayColor = slide.overlayColor || '#042241';
          const overlayOpacity = slide.overlayOpacity ?? 0.6;
          const slideHeight = config.height || '700px';

          // Converter cor hex para rgba
          const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : { r: 4, g: 34, b: 65 };
          };

          const rgb = hexToRgb(overlayColor);
          const overlayGradient = `linear-gradient(90deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${overlayOpacity}) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${overlayOpacity * 0.625}) 45%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 100%)`;

          return (
          <CarouselItem key={slide.id}>
            <section
              className="bg-cover bg-center relative overflow-hidden"
              style={{
                height: slideHeight,
                backgroundImage: `${overlayGradient}, url("${slide.backgroundValue}")`
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 lg:px-24">
                <div className="page-container flex flex-col items-start text-left">
                  {slide.showSubtitle && slide.subtitle && (
                    <h2 className="text-white text-[13px] tracking-[2.7px] font-medium mb-5 uppercase">
                      {slide.subtitle}
                    </h2>
                  )}

                  {slide.showTitle && slide.title && (
                    <h1
                      className="text-[80px] leading-[1.0] tracking-[0.4px] max-w-[650px] font-bold mb-8 uppercase max-sm:text-5xl max-sm:leading-[1.1]"
                      style={{ color: slide.textColor || '#FFFFFF' }}
                    >
                      {slide.title}
                    </h1>
                  )}

                  {slide.showDescription && slide.description && (
                    <p
                      className="text-base leading-[1.7] max-w-[580px] mb-8"
                      style={{ color: slide.textColor || '#FFFFFF' }}
                    >
                      {slide.description}
                    </p>
                  )}

                  {slide.showButton && slide.buttonText && (
                    <button
                      className="flex items-center gap-2.5 text-primary-foreground font-medium text-sm mb-8 px-8 py-4 rounded-full"
                      style={{ backgroundColor: slide.buttonColor || 'hsl(var(--primary))' }}
                    >
                      <Calendar size={18} />
                      {slide.buttonText}
                    </button>
                  )}

                  {slide.showRating && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-white text-base">Mais de 1.000 avaliações</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-4 bg-black/40 hover:bg-black/60 text-white border-none" />
      <CarouselNext className="right-4 bg-black/40 hover:bg-black/60 text-white border-none" />
    </Carousel>
  );
};
