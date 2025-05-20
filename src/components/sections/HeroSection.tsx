
import React from 'react';
import { Calendar } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="h-screen min-h-[700px] bg-cover bg-center relative overflow-hidden flex items-center" 
      style={{ 
        backgroundImage: 'linear-gradient(90deg, rgba(4, 34, 65, 0.85) 0%, rgba(4, 34, 65, 0.6) 45%, rgba(4, 34, 65, 0.3) 100%), url("/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png")'
      }}>
      <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 lg:px-24">
        <div className="container mx-auto flex flex-col items-start text-left">
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-white text-[13px] tracking-[2.7px] font-medium mb-5 uppercase">
              O refúgio perfeito para se desconectar
            </h2>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h1 className="text-white text-[60px] md:text-[80px] leading-[1.1] tracking-[0.4px] max-w-[650px] font-bold mb-8 uppercase font-playfair">
              Refúgio dos seus sonhos
            </h1>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <p className="text-white text-base leading-[1.7] max-w-[580px] mb-8">
              Desfrute de uma estadia inesquecível em nosso resort à beira-mar,
              com acomodações de luxo e paisagens deslumbrantes.
            </p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <button className="button-primary mb-8 px-8 py-4 group">
              <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
              AGENDAMENTO ONLINE
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2 animate-fade-in" style={{ animationDelay: "1.1s" }}>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#C7994B">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
              ))}
            </div>
            <span className="text-white text-base">Mais de 1.000 avaliações</span>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-white text-xs mb-2">SCROLL</span>
          <div className="h-10 w-0.5 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
