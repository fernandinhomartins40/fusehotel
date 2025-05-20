
import React from 'react';
import { RoomCard } from '../ui/RoomCard';

export const AccommodationsSection: React.FC = () => {
  const rooms = [
    {
      title: "Suíte Praia Dourada",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png",
      area: "50m²",
      capacity: "Até 4 pessoas",
      price: "R$699,00"
    },
    {
      title: "Suíte Paraíso Tropical",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "/lovable-uploads/e5ecb0e1-d687-4ba0-bddc-9a5649e7c187.png",
      area: "40m²",
      capacity: "Até 3 pessoas",
      price: "R$599,00"
    },
    {
      title: "Suíte Oceano Azul",
      description: "Perfeita para quem deseja uma vista panorâmica do mar, com varanda privativa e hidromassagem.",
      image: "/lovable-uploads/4861900e-89af-4479-9863-976662f284ca.png",
      area: "30m²",
      capacity: "Até 2 pessoas",
      price: "R$499,00"
    }
  ];

  return (
    <section id="accommodations" className="px-4 md:px-12 lg:px-24 py-24 bg-white">
      <div className="container mx-auto">
        <div className="text-left mb-16">
          <h2 className="section-title">
            CONFORTO, LUXO E SOFISTICAÇÃO
          </h2>
          <h3 className="section-heading font-playfair">
            ACOMODAÇÕES
          </h3>
          <p className="section-description">
            Nossas suites foram projetadas para oferecer o máximo de
            conforto e privacidade, com vista para o mar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div 
              key={index} 
              className="animate-fade-in" 
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <RoomCard {...room} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
