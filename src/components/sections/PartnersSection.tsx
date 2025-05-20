
import React from 'react';

export const PartnersSection: React.FC = () => {
  return (
    <section className="text-center px-4 md:px-12 lg:px-24 py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-[#676C76] text-[12.8px] tracking-[2.7px] mb-2.5">
          PARCEIROS
        </h2>
        <div className="flex justify-center flex-wrap gap-8 md:gap-[107px] mt-[30px]">
          <img src="https://via.placeholder.com/150x55/cccccc/666666?text=Partner+1" alt="Partner 1" className="h-[55px] max-sm:h-10" />
          <img src="https://via.placeholder.com/150x55/cccccc/666666?text=Partner+2" alt="Partner 2" className="h-[55px] max-sm:h-10" />
          <img src="https://via.placeholder.com/150x55/cccccc/666666?text=Partner+3" alt="Partner 3" className="h-[55px] max-sm:h-10" />
          <img src="https://via.placeholder.com/150x55/cccccc/666666?text=Partner+4" alt="Partner 4" className="h-[55px] max-sm:h-10" />
          <img src="https://via.placeholder.com/150x55/cccccc/666666?text=Partner+5" alt="Partner 5" className="h-[55px] max-sm:h-10" />
        </div>
      </div>
    </section>
  );
};
