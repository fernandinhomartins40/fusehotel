
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoomCard } from '@/components/ui/RoomCard';
import { mockRooms } from '@/data/accommodationsData';

const Accommodations = () => {
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
              {mockRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
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
