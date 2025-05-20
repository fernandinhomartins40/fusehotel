
import React from 'react';

export const HighlightsSection: React.FC = () => {
  const highlights = [
    {
      image: "/lovable-uploads/bca108a5-820b-418c-bb37-1fdfb497dc24.png",
      title: "SPA DE LUXO",
      subtitle: "Relaxamento e Rejuvenescimento"
    },
    {
      image: "/lovable-uploads/1e861110-a179-4f1f-aa1a-caeb85c10609.png",
      title: "FESTAS INCRÍVEIS",
      subtitle: "Diversão para toda família"
    },
    {
      image: "/lovable-uploads/a7433b3a-710f-49d8-b286-8066127891b0.png",
      title: "GASTRONOMIA",
      subtitle: "Experiência culinária internacional"
    },
    {
      image: "/lovable-uploads/6cff717e-9bcc-4de2-8466-11400c267a66.png",
      title: "PÉ NA AREIA",
      subtitle: "Um mergulho no Paraíso"
    }
  ];

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
          {highlights.map((highlight, index) => (
            <div key={index} className="relative overflow-hidden rounded-[5px]">
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-[333px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-left">
                <h4 className="text-white text-4xl font-bold mb-1">{highlight.title}</h4>
                <p className="text-white text-lg">{highlight.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
