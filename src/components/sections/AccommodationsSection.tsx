
import React from 'react';
import { RoomCard } from '../ui/RoomCard';

export const AccommodationsSection: React.FC = () => {
  const rooms = [
    {
      title: "Suíte Praia Dourada",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png",
      area: "50 m²",
      capacity: "Até 4 Pessoas",
      price: "R$699/diária"
    },
    {
      title: "Suíte Paraíso Tropical",
      description: "Proporciona uma imersão total na natureza, sendo cercada por palmeiras e jardins tropicais que criam uma atmosfera tranquila e relaxante.",
      image: "/lovable-uploads/e5ecb0e1-d687-4ba0-bddc-9a5649e7c187.png",
      area: "40 m²",
      capacity: "Até 3 Pessoas",
      price: "R$599/diária"
    },
    {
      title: "Suíte Oceano Azul",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "/lovable-uploads/4861900e-89af-4479-9863-976662f284ca.png",
      area: "30 m²",
      capacity: "Até 2 Pessoas",
      price: "R$499/diária"
    }
  ];

  return (
    <section id="accommodations" className="px-4 md:px-12 lg:px-24 py-20 bg-[#f9f9f9]">
      <div className="container mx-auto">
        <div className="text-left">
          <h2 className="text-[#676C76] text-[13px] uppercase tracking-[2px] mb-2 font-normal">
            CONFORTO, LUXO E SOFISTICAÇÃO
          </h2>
          <h3 className="text-[#1D1D1F] text-[56px] font-bold mb-4 tracking-tight leading-none uppercase">
            ACOMODAÇÕES
          </h3>
          <p className="text-[#676C76] text-base leading-relaxed mb-12 max-w-2xl">
            Nossas suites foram projetadas para oferecer o máximo de
            conforto e privacidade, com vista para o mar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <RoomCard key={index} {...room} />
          ))}
        </div>
      </div>
    </section>
  );
};
