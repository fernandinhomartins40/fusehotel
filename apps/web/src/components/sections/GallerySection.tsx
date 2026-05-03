import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useGalleryImages, useLandingSettings } from '@/hooks/useLanding';
import { defaultGalleryConfig } from '@/types/landing-config';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export const GallerySection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: settingsData } = useLandingSettings('gallery');
  const { data: galleryImages = [] } = useGalleryImages();

  const config = settingsData?.config || defaultGalleryConfig;

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  if (!galleryImages || galleryImages.length === 0) {
    return null;
  }

  return (
    <section
      id="gallery"
      className="py-20 md:py-32"
      style={{
        backgroundColor: config.backgroundColor || '#F5F5F0'
      }}
    >
      {/* Header inside container */}
      <div className="page-container mb-12">
        <div className="text-center">
          {config.subtitle && (
            <span
              className="page-kicker"
              style={{ color: config.subtitleColor || '#676C76' }}
            >
              {config.subtitle}
            </span>
          )}
          {config.title && (
            <h2
              className="section-title"
              style={{ color: config.titleColor || '#1D1D1F' }}
            >
              {config.title}
            </h2>
          )}
        </div>
      </div>

      {/* Full-bleed carousel - no container constraint */}
      <div className="px-4 md:px-8 lg:px-16">
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {galleryImages.map((image: GalleryImage) => (
              <CarouselItem key={image.id} className="basis-full md:basis-4/5 lg:basis-3/4 pl-4">
                <div className="overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-[400px] md:h-[550px] lg:h-[600px] object-cover transition-transform duration-[1.2s] ease-out hover:scale-105"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-8 md:left-12 h-12 w-12 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-lg transition-all duration-300" />
          <CarouselNext className="right-8 md:right-12 h-12 w-12 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-lg transition-all duration-300" />
        </Carousel>
      </div>

      {/* Dots & counter */}
      <div className="page-container mt-8">
        <div className="flex justify-center items-center gap-6">
          <div className="flex space-x-2">
            {galleryImages.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={cn(
                  "rounded-full transition-all duration-500",
                  current === index
                    ? "w-10 h-2 bg-gray-900"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <span
            className="text-sm font-medium tabular-nums"
            style={{ color: config.subtitleColor || '#676C76' }}
          >
            {current + 1} / {galleryImages.length}
          </span>
        </div>
      </div>
    </section>
  );
};
