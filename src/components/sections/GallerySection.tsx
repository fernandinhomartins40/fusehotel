
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

export const GallerySection: React.FC = () => {
  const images = [
    "/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png",
    "/lovable-uploads/c69b73c8-38b5-4604-bfd2-a8757ed39926.png",
    "/lovable-uploads/fded9012-6848-480f-9d6b-4f1d657bc776.png",
    "/lovable-uploads/2b637749-b3cc-4943-8c7b-195634e4be2d.png",
    "/lovable-uploads/9ba14886-b3ce-4365-869f-8a6daaf9f6a7.png"
  ];

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
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-4/5 lg:basis-3/4">
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
            <CarouselPrevious className="left-4 bg-black/40 hover:bg-black/60 text-white border-none" />
            <CarouselNext className="right-4 bg-black/40 hover:bg-black/60 text-white border-none" />
          </Carousel>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
            {images.map((image, index) => (
              <div 
                key={`thumb-${index}`} 
                className="overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-24 object-cover transition-transform duration-300 hover:scale-105" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
