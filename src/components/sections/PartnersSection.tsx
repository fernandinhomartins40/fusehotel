import React from 'react';

export const PartnersSection: React.FC = () => {
  return (
    <section className="text-center px-0 py-16">
      <h2 className="text-[#676C76] text-[12.8px] tracking-[2.7px] mb-2.5">
        PARCEIROS
      </h2>
      <div className="flex justify-center gap-[107px] mt-[30px] max-md:flex-wrap max-md:gap-10 max-sm:gap-5">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b20efb8a113d4770919dba3ba2e9730bee1c7f74" alt="Partner 1" className="h-[55px] max-sm:h-10" />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/333618a9d9d3938d38ca1824334a034b7f6d90a1" alt="Partner 2" className="h-[55px] max-sm:h-10" />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f957de88dc95c11043facf7728a693d1ec4bef9" alt="Partner 3" className="h-[55px] max-sm:h-10" />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/604bdc376d0c712d75268a4821eef54609583817" alt="Partner 4" className="h-[55px] max-sm:h-10" />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/92484c530a01c9bf1dd5eff2a74e6f337b976f13" alt="Partner 5" className="h-[55px] max-sm:h-10" />
      </div>
    </section>
  );
};
