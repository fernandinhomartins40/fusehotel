import React from 'react';
import { RoomCard } from '../ui/RoomCard';

export const AccommodationsSection: React.FC = () => {
  const rooms = [
    {
      title: "Suíte Praia Dourada",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/cfce2894e96c61476407ac62943372bdacf07fc1",
      area: "50m²",
      capacity: "Até 4 pessoas",
      price: "R$699,00"
    },
    {
      title: "Suíte Paraíso Tropical",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/def130539eeb6591d5c48e528fa395cfe62b581c",
      area: "40m²",
      capacity: "Até 3 pessoas",
      price: "R$599,00"
    },
    {
      title: "Suíte Oceano Azul",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ea643081856c6b822bb5d24308bf88b9dfb15ab6",
      area: "30m²",
      capacity: "Até 2 pessoas",
      price: "R$499,00"
    }
  ];

  return (
    <section id="accommodations" className="px-[360px] py-20 max-md:px-5 max-md:py-10">
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
      
      <div className="flex gap-5 max-md:flex-col max-md:items-center">
        {rooms.map((room, index) => (
          <RoomCard key={index} {...room} />
        ))}
      </div>
    </section>
  );
};
