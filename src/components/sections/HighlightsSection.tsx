import React from 'react';

export const HighlightsSection: React.FC = () => {
  return (
    <section id="highlights" className="px-[360px] py-20 max-md:px-5 max-md:py-10">
      <h2 className="text-[#676C76] text-[12.8px] tracking-[2.7px] mb-2.5">
        EXPERIÊNCIAS INCRÍVEIS ESPERAM POR VOCÊ
      </h2>
      <h3 className="text-[#383C41] text-[56px] leading-[67.2px] tracking-[0.4px] mb-[13px]">
        DESTAQUES
      </h3>
      <p className="text-[#676C76] text-base leading-[27.2px] mb-10">
        Descubra as experiências que tornam nosso resort único. De relaxamento
        absoluto a aventuras emocionantes.
      </p>
      
      <div className="grid grid-cols-[repeat(2,1fr)] gap-5 max-md:grid-cols-[1fr]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/59d9d18d9913d360a9e377d9c3006809d4e13707"
          alt="SPA de Luxo"
          className="w-full h-[333px] object-cover rounded-[5px]"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc43505e21bd54ececee1beeea096261ad58d694"
          alt="Festas Incríveis"
          className="w-full h-[333px] object-cover rounded-[5px]"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/33f401d619f58e770e09f55c8e8ef9cdaa3922ca"
          alt="Gastronomia"
          className="w-full h-[333px] object-cover rounded-[5px]"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff396a3f4cd86f9bb142f7aac43919405b7d351e"
          alt="Pé na Areia"
          className="w-full h-[333px] object-cover rounded-[5px]"
        />
      </div>
    </section>
  );
};
