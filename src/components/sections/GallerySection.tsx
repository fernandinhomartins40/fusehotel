
import React, { useState } from 'react';

export const GallerySection: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ["https://cdn.builder.io/api/v1/image/assets/TEMP/8f328a720a9e8888e753935d9c13cf2e68f91413"]; // Add more images as needed

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="gallery" className="text-center px-0 py-20">
      <h2 className="text-[#676C76] text-[12.8px] tracking-[2.7px] mb-2.5">
        EXPLORE CADA DETALHE DO NOSSO RESORT
      </h2>
      <h3 className="text-[#383C41] text-[56px] leading-[67.2px] tracking-[0.4px] mb-[13px]">
        GALERIA DE FOTOS
      </h3>
      <p className="text-[#676C76] text-base leading-[27.2px] mb-10">
        Veja as paisagens deslumbrantes, acomodações luxuosas e experiências
        incríveis que aguardam você.
      </p>

      <div className="relative mt-10">
        <img
          src={images[currentImage]}
          alt="Resort Gallery"
          className="w-[1200px] h-[650px] object-cover rounded-[20px] max-md:w-full"
        />
        
        <button
          onClick={prevImage}
          className="absolute top-1/2 transform -translate-y-1/2 left-10 cursor-pointer"
          aria-label="Previous image"
        >
          <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.15 4.06494C15.725 4.06494 15.325 4.26494 15.1 4.48994L7.69999 11.9899C7.39999 12.2899 7.29999 12.7149 7.29999 13.1149C7.29999 13.5399 7.39999 13.9649 7.69999 14.2649L15.1 22.2899C15.425 22.6149 15.725 22.8149 16.15 22.8149C16.575 22.8149 16.975 22.7149 17.3 22.3899C17.6 22.0899 17.825 21.6649 17.825 21.2399C17.825 20.8399 17.7 20.4149 17.3 20.1149L10.95 13.1149L17.3 6.56494C17.5 6.36494 17.7 6.03994 17.7 5.61494C17.7 5.21494 17.6 4.78994 17.3 4.48994C16.875 4.16494 16.575 4.06494 16.15 4.06494Z" fill="#EEEEEE" fillOpacity="0.9"/>
          </svg>
        </button>

        <button
          onClick={nextImage}
          className="absolute top-1/2 transform -translate-y-1/2 right-10 cursor-pointer"
          aria-label="Next image"
        >
          <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.4 14.2649C17.7 13.9649 17.825 13.5399 17.825 13.1149C17.825 12.7149 17.7 12.2899 17.4 12.0899L10 4.58994C9.70001 4.26494 9.37501 4.06494 8.85001 4.06494C8.45001 4.06494 8.12501 4.16494 7.82501 4.48994C7.50001 4.78994 7.30001 5.21494 7.30001 5.61494C7.30001 6.03994 7.50001 6.36494 7.70001 6.56494L14.05 13.1149L7.70001 20.1149C7.30001 20.4149 7.17501 20.8399 7.17501 21.2399C7.17501 21.6649 7.40001 22.0899 7.70001 22.3899C8.02501 22.7149 8.42501 22.8149 8.85001 22.8149C9.27501 22.8149 9.57501 22.6149 9.90001 22.2899L17.4 14.2649Z" fill="#EEEEEE" fillOpacity="0.9"/>
          </svg>
        </button>
      </div>
    </section>
  );
};
