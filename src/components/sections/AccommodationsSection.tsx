
import React from 'react';
import { RoomCard } from '../ui/RoomCard';

export const AccommodationsSection: React.FC = () => {
  const rooms = [
    {
      title: "Suíte Praia Dourada",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070",
      area: "50m²",
      capacity: "Até 4 pessoas",
      price: "R$699,00"
    },
    {
      title: "Suíte Paraíso Tropical",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=2070",
      area: "40m²",
      capacity: "Até 3 pessoas",
      price: "R$599,00"
    },
    {
      title: "Suíte Oceano Azul",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070",
      area: "30m²",
      capacity: "Até 2 pessoas",
      price: "R$499,00"
    }
  ];

  return (
    <section id="accommodations" className="px-4 md:px-12 lg:px-24 py-20">
      <div className="container mx-auto">
        <h2 className="text-[#676C76] text-[12.8px] tracking-[2.7px] mb-2.5">
          CONFORTO, LUXO E SOFISTICAÇÃO
        </h2>
        <h3 className="text-[#383C41] text-[56px] leading-[67.2px] tracking-[0.4px] mb-[13px]">
          ACOMODAÇÕES
        </h3>
        <p className="text-[#676C76] text-base leading-[27.2px] mb-10">
          Nossas suítes foram projetadas para oferecer o máximo de conforto e
          privacidade, com vista para o mar.
        </p>
        
        <div className="flex flex-col md:flex-row gap-5 max-md:items-center">
          {rooms.map((room, index) => (
            <RoomCard key={index} {...room} />
          ))}
        </div>
      </div>
    </section>
  );
};
