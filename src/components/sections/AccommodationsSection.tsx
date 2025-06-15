
import React from 'react';
import { RoomCard } from '../ui/RoomCard';
import { mockRooms } from '@/data/accommodationsData';

export const AccommodationsSection: React.FC = () => {
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
          {mockRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
};
