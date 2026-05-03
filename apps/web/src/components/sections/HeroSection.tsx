import React, { useState } from 'react';
import { Calendar, ChevronDown } from "lucide-react";
import { useHeroSlides, useLandingSettings } from '@/hooks/useLanding';
import { defaultHeroConfig } from '@/types/landing-config';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { hydrateBrandColors, resolveHeroColor } from '@/lib/brand-theme';

export const HeroSection: React.FC = () => {
  const { data: slides, isLoading } = useHeroSlides();
  const { data: settingsData } = useLandingSettings('hero');
  const config = hydrateBrandColors(settingsData?.config || defaultHeroConfig);
  const [, setApi] = useState<CarouselApi>();
  const themedSlides = (slides || []).map((slide: any) => hydrateBrandColors(slide));

  const plugin = React.useRef(
    Autoplay({ delay: (config.autoplaySpeed || 5) * 1000, stopOnInteraction: true })
  );

  const scrollToContent = () => {
    const el = document.getElementById('accommodations');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section className="h-screen bg-gray-900 relative overflow-hidden flex items-center justify-center">
        <div className="text-white/40 animate-pulse text-lg">Carregando...</div>
      </section>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <section
        className="h-screen relative overflow-hidden"
        style={{ backgroundColor: resolveHeroColor(undefined) }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: 'url("/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png")',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-start px-4 md:px-12 lg:px-24 pt-36 pb-16 md:pt-44 md:pb-20 lg:pt-48 xl:pt-52">
          <div className="page-container flex flex-col items-start text-left">
            <div className="animate-fade-in-up">
              <div className="line-accent" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
              <h2 className="text-white/60 text-[11px] md:text-[13px] tracking-[4px] font-medium mb-6 uppercase">
                O refúgio perfeito para se desconectar
              </h2>
              <h1 className="text-white text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-[800px] font-bold mb-8">
                Refúgio dos
                <br />
                seus sonhos
              </h1>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-[500px] mb-12">
                Desfrute de uma estadia inesquecível em nosso resort à beira-mar,
                com acomodações de luxo e paisagens deslumbrantes.
              </p>

              <button className="group flex items-center gap-3 text-white font-medium text-sm bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-500 hover:scale-[1.03]">
                <Calendar size={18} />
                AGENDAMENTO ONLINE
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80 transition-all duration-300 animate-bounce"
        >
          <ChevronDown size={28} />
        </button>
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
          const slideBackgroundType = slide.backgroundType === 'image' ? 'image' : 'color';
          const overlayColor = resolveHeroColor(slide.overlayColor);
          const overlayOpacity = slide.overlayOpacity ?? 0.6;
          const hasImageBackground =
            slideBackgroundType === 'image' &&
            typeof slide.backgroundValue === 'string' &&
            !slide.backgroundValue.startsWith('#') &&
            !slide.backgroundValue.startsWith('hsl(') &&
            !slide.backgroundValue.includes('gradient');
          const slideBackgroundColor = slideBackgroundType === 'color'
            ? resolveHeroColor(
                typeof slide.backgroundValue === 'string' && slide.backgroundValue.includes('gradient')
                  ? undefined
                  : slide.backgroundValue,
                overlayColor
              )
            : overlayColor;

          return (
          <CarouselItem key={slide.id}>
            <section
              className="relative overflow-hidden h-screen"
              style={{
                backgroundColor: slideBackgroundColor,
              }}
            >
              {hasImageBackground && (
                <div
                  className="absolute inset-0 bg-cover bg-center scale-110"
                  style={{ backgroundImage: `url("${slide.backgroundValue}")` }}
                />
              )}
              {slideBackgroundType === 'image' && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, ${overlayColor}4D 0%, ${overlayColor}80 60%, ${overlayColor}B3 100%)`,
                    opacity: overlayOpacity,
                  }}
                />
              )}
              <div className="absolute inset-0 flex flex-col justify-start px-4 md:px-12 lg:px-24 pt-36 pb-16 md:pt-44 md:pb-20 lg:pt-48 xl:pt-52">
                <div className="page-container flex flex-col items-start text-left">
                  {slide.showSubtitle && slide.subtitle && (
                    <h2 className="text-white/60 text-[11px] md:text-[13px] tracking-[4px] font-medium mb-6 uppercase">
                      {slide.subtitle}
                    </h2>
                  )}

                  {slide.showTitle && slide.title && (
                    <h1
                      className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-[800px] font-bold mb-8"
                      style={{ color: slide.textColor || '#FFFFFF' }}
                    >
                      {slide.title}
                    </h1>
                  )}

                  {slide.showDescription && slide.description && (
                    <p
                      className="text-base md:text-lg leading-relaxed max-w-[500px] mb-12"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {slide.description}
                    </p>
                  )}

                  {slide.showButton && slide.buttonText && (
                    <button
                      className="group flex items-center gap-3 text-white font-medium text-sm bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-500 hover:scale-[1.03]"
                    >
                      <Calendar size={18} />
                      {slide.buttonText}
                    </button>
                  )}

                  {slide.showRating && (
                    <div className="flex items-center gap-3 mt-10">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#FFD700">
                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-white/50 text-sm">Mais de 1.000 avaliações</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scroll indicator */}
              <button
                onClick={scrollToContent}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-all duration-300 animate-bounce"
              >
                <ChevronDown size={28} />
              </button>
            </section>
          </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-6 h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 glass transition-all duration-300" />
      <CarouselNext className="right-6 h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 glass transition-all duration-300" />
    </Carousel>
  );
};
