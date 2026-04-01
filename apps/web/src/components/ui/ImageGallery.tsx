
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Main Carousel */}
      <Carousel 
        className="max-w-7xl mx-auto"
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                <img 
                  src={image} 
                  alt={`${title} - Imagem ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                {/* Image Counter Overlay */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {current + 1} / {images.length}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-5 md:-left-10 bg-white/90 hover:bg-white border-0 shadow-lg" />
        <CarouselNext className="-right-5 md:-right-10 bg-white/90 hover:bg-white border-0 shadow-lg" />
      </Carousel>

      {/* Thumbnails */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`thumb-${index}`}
              onClick={() => scrollToSlide(index)}
              className={cn(
                "flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                current === index 
                  ? "border-primary scale-105 shadow-md" 
                  : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
              )}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
