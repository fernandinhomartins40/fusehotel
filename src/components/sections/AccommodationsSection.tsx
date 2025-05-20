
import React from 'react';
import { RoomCard } from '../ui/RoomCard';

export const AccommodationsSection: React.FC = () => {
  const rooms = [
    {
      title: "Suíte Praia Dourada",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
      area: "50m²",
      capacity: "Até 4 pessoas",
      price: "R$699,00"
    },
    {
      title: "Suíte Paraíso Tropical",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070",
      area: "40m²",
      capacity: "Até 3 pessoas",
      price: "R$599,00"
    },
    {
      title: "Suíte Oceano Azul",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070",
      area: "30m²",
      capacity: "Até 2 pessoas",
      price: "R$499,00"
    }
  ];

  return (
    <section id="accommodations" className="px-4 md:px-12 lg:px-24 py-20 bg-[#f9f9f9]">
      <div className="container mx-auto">
        <h2 className="text-gray-600 text-sm uppercase tracking-wider mb-2">
          CONFORTO, LUXO E SOFISTICAÇÃO
        </h2>
        <h3 className="text-[#2D2D2D] text-[46px] font-bold mb-4 uppercase">
          ACOMODAÇÕES
        </h3>
        <p className="text-gray-600 text-base mb-12 max-w-2xl">
          Nossas suítes foram projetadas para oferecer o máximo de
          conforto e privacidade, com vista para o mar.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <RoomCard key={index} {...room} />
          ))}
        </div>
      </div>
    </section>
  );
};
