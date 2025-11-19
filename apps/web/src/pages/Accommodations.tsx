
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoomCard } from '@/components/ui/RoomCard';

const Accommodations = () => {
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
    <div className="w-full">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#0466C8] to-[#0355A6] text-white py-20">
          <div className="container mx-auto px-4 md:px-12 lg:px-24">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 uppercase">
              Acomodações
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl">
              Descubra nossas suítes luxuosas com vista para o mar, 
              cada uma projetada para oferecer o máximo conforto e elegância.
            </p>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="py-20 bg-[#f9f9f9]">
          <div className="container mx-auto px-4 md:px-12 lg:px-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => (
                <RoomCard key={index} {...room} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Accommodations;
