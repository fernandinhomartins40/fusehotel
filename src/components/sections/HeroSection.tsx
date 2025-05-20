
import React from 'react';
import { Calendar } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="h-[700px] bg-cover bg-center relative overflow-hidden" 
      style={{ 
        backgroundImage: 'linear-gradient(90deg, rgba(4, 34, 65, 0.8) 0%, rgba(4, 34, 65, 0.5) 45%, rgba(4, 34, 65, 0) 100%), url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070")'
      }}>
      <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 lg:px-24">
        <div className="container mx-auto flex flex-col items-start text-left">
          <h2 className="text-white text-[13px] tracking-[2.7px] font-medium mb-5 uppercase">
            O refúgio perfeito para se desconectar
          </h2>
          <h1 className="text-white text-[80px] leading-[1.0] tracking-[0.4px] max-w-[650px] font-bold mb-8 uppercase max-sm:text-5xl max-sm:leading-[1.1]">
            Refúgio dos seus sonhos
          </h1>
          <p className="text-white text-base leading-[1.7] max-w-[580px] mb-8">
            Desfrute de uma estadia inesquecível em nosso resort à beira-mar,
            com acomodações de luxo e paisagens deslumbrantes.
          </p>
          
          <button className="flex items-center gap-2.5 text-white font-medium text-sm bg-[#0466C8] mb-8 px-8 py-4 rounded-full">
            <Calendar size={18} />
            AGENDAMENTO ONLINE
          </button>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
              ))}
            </div>
            <span className="text-white text-base">Mais de 1.000 avaliações</span>
          </div>
        </div>
      </div>
    </section>
  );
};
