
import React, { useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  CarouselApi
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export const GallerySection: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const images = [
    "/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png",
    "/lovable-uploads/c69b73c8-38b5-4604-bfd2-a8757ed39926.png",
    "/lovable-uploads/fded9012-6848-480f-9d6b-4f1d657bc776.png",
    "/lovable-uploads/2b637749-b3cc-4943-8c7b-195634e4be2d.png",
    "/lovable-uploads/9ba14886-b3ce-4365-869f-8a6daaf9f6a7.png"
  ];

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section id="gallery" className="text-center px-4 md:px-12 lg:px-24 py-20 bg-white">
      <div className="container mx-auto">
        <div className="text-left mb-10">
          <h2 className="text-[#676C76] text-[13px] uppercase tracking-[2px] mb-2 font-normal">
            EXPLORE CADA DETALHE DO NOSSO RESORT
          </h2>
          <h3 className="text-[#1D1D1F] text-[56px] font-bold mb-4 tracking-tight leading-none uppercase">
            GALERIA DE FOTOS
          </h3>
          <p className="text-[#676C76] text-base leading-relaxed max-w-2xl">
            Veja as paisagens deslumbrantes, acomodações luxuosas e experiências
            incríveis que aguardam você.
          </p>
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
              {images.map((image, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="p-1">
                    <div className="overflow-hidden rounded-[20px] shadow-xl">
                      <img
                        src={image}
                        alt={`Resort Scenery ${index + 1}`}
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
            {images.map((_, index) => (
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
            {images.map((image, index) => (
              <button
                key={`thumb-${index}`}
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
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-24 object-cover transition-transform duration-300 hover:scale-105" 
                />
              </button>
            ))}
          </div>

          {/* Image Counter */}
          <div className="text-center mt-4">
            <span className="text-[#676C76] text-sm">
              {current + 1} de {images.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
