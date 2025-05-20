
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
    <section id="highlights" className="px-4 md:px-12 lg:px-24 py-24 bg-hotel-sand">
      <div className="container mx-auto">
        <div className="text-left mb-16">
          <h2 className="section-title">
            EXPERIÊNCIAS INCRÍVEIS ESPERAM POR VOCÊ
          </h2>
          <h3 className="section-heading font-playfair">
            DESTAQUES
          </h3>
          <p className="section-description">
            Descubra as experiências que tornam nosso resort único. De relaxamento
            absoluto a aventuras emocionantes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.map((highlight, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden rounded-lg card-shadow group transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-[333px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-left">
                <h4 className="text-white text-3xl md:text-4xl font-bold mb-1 font-playfair">{highlight.title}</h4>
                <p className="text-white text-lg">{highlight.subtitle}</p>
                
                <div className="mt-4 overflow-hidden h-0 group-hover:h-8 transition-all duration-300">
                  <button className="text-hotel-gold hover:text-white transition-colors flex items-center gap-2 text-sm uppercase font-medium">
                    Saiba mais 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
