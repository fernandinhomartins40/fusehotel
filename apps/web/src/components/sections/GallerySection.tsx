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

  // Se não houver imagens, não renderizar a seção
  if (!galleryImages || galleryImages.length === 0) {
    return null;
  }

  return (
    <section
      id="gallery"
      className="text-center px-4 md:px-12 lg:px-24 py-20"
      style={{
        backgroundColor: config.backgroundColor || '#FFFFFF'
      }}
    >
      <div className="container mx-auto">
        <div className="text-left mb-10">
          {config.subtitle && (
            <h2
              className="text-[13px] uppercase tracking-[2px] mb-2 font-normal"
              style={{
                color: config.subtitleColor || '#676C76'
              }}
            >
              {config.subtitle}
            </h2>
          )}
          {config.title && (
            <h3
              className="text-[56px] font-bold mb-4 tracking-tight leading-none uppercase"
              style={{
                color: config.titleColor || '#1D1D1F'
              }}
            >
              {config.title}
            </h3>
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

        <div className="mt-10">
          <Carousel
            className="w-full"
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent>
              {galleryImages.map((image: GalleryImage, index: number) => (
                <CarouselItem key={image.id} className="basis-full">
                  <div className="p-1">
                    <div className="overflow-hidden rounded-[20px] shadow-xl">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-black/40 hover:bg-black/60 text-white border-none transition-all duration-300 hover:scale-110" />
            <CarouselNext className="right-4 bg-black/40 hover:bg-black/60 text-white border-none transition-all duration-300 hover:scale-110" />
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {galleryImages.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  current === index
                    ? "bg-[#1D1D1F] scale-125"
                    : "bg-[#676C76]/30 hover:bg-[#676C76]/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Functional Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
            {galleryImages.map((image: GalleryImage, index: number) => (
              <button
                key={`thumb-${image.id}`}
                onClick={() => scrollToSlide(index)}
                className={cn(
                  "overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 border-2",
                  current === index
                    ? "border-[#1D1D1F] scale-105"
                    : "border-transparent hover:border-[#676C76]/50"
                )}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-24 object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
            ))}
          </div>

          {/* Image Counter */}
          <div className="text-center mt-4">
            <span
              className="text-sm"
              style={{
                color: config.subtitleColor || '#676C76'
              }}
            >
              {current + 1} de {galleryImages.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
