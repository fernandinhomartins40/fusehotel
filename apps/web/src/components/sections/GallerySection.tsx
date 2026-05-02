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
      className="page-section"
      style={{
        backgroundColor: config.backgroundColor || '#FFFFFF'
      }}
    >
      <div className="page-container">
        <div className="mb-12">
          {config.subtitle && (
            <span
              className="page-kicker"
              style={{
                color: config.subtitleColor || '#676C76'
              }}
            >
              {config.subtitle}
            </span>
          )}
          {config.title && (
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight leading-none"
              style={{
                color: config.titleColor || '#1D1D1F'
              }}
            >
              {config.title}
            </h2>
          )}
          {config.description && (
            <p
              className="text-base leading-relaxed max-w-2xl"
              style={{
                color: config.subtitleColor || '#676C76'
              }}
            >
              {config.description}
            </p>
          )}
        </div>

        <div className="mt-8">
          <Carousel
            className="w-full"
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent>
              {galleryImages.map((image: GalleryImage) => (
                <CarouselItem key={image.id} className="basis-full">
                  <div className="p-1">
                    <div className="overflow-hidden rounded-2xl shadow-lg">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-[500px] object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/15 hover:bg-white/25 text-white border-none glass transition-all duration-300 hover:scale-110" />
            <CarouselNext className="right-4 bg-white/15 hover:bg-white/25 text-white border-none glass transition-all duration-300 hover:scale-110" />
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {galleryImages.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  current === index
                    ? "w-8 h-2.5 bg-[#1D1D1F]"
                    : "w-2.5 h-2.5 bg-[#676C76]/25 hover:bg-[#676C76]/40"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Functional Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
            {galleryImages.map((image: GalleryImage, index: number) => (
              <button
                key={`thumb-${image.id}`}
                onClick={() => scrollToSlide(index)}
                className={cn(
                  "overflow-hidden rounded-lg cursor-pointer transition-all duration-300 border-2",
                  current === index
                    ? "border-[#1D1D1F] shadow-md scale-[1.02]"
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-[#676C76]/30"
                )}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>

          {/* Image Counter */}
          <div className="text-center mt-4">
            <span
              className="text-sm font-medium tabular-nums"
              style={{
                color: config.subtitleColor || '#676C76'
              }}
            >
              {current + 1} / {galleryImages.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
