
import React from 'react';

export const HighlightsSection: React.FC = () => {
  return (
    <section id="highlights" className="px-4 md:px-12 lg:px-24 py-20">
      <div className="container mx-auto">
        <h2 className="text-[#676C76] text-[12.8px] tracking-[2.7px] mb-2.5">
          EXPERIÊNCIAS INCRÍVEIS ESPERAM POR VOCÊ
        </h2>
        <h3 className="text-[#383C41] text-[56px] leading-[67.2px] tracking-[0.4px] mb-[13px]">
          DESTAQUES
        </h3>
        <p className="text-[#676C76] text-base leading-[27.2px] mb-10">
          Descubra as experiências que tornam nosso resort único. De relaxamento
          absoluto a aventuras emocionantes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070"
            alt="SPA de Luxo"
            className="w-full h-[333px] object-cover rounded-[5px]"
          />
          <img
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070"
            alt="Festas Incríveis"
            className="w-full h-[333px] object-cover rounded-[5px]"
          />
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070"
            alt="Gastronomia"
            className="w-full h-[333px] object-cover rounded-[5px]"
          />
          <img
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070"
            alt="Pé na Areia"
            className="w-full h-[333px] object-cover rounded-[5px]"
          />
        </div>
      </div>
    </section>
  );
};
