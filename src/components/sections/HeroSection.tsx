
import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="h-[700px] bg-cover bg-center px-4 md:px-12 lg:px-24 py-[121px] max-md:py-10" 
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070")' }}>
      <div className="container mx-auto">
        <h2 className="text-white text-[12.8px] tracking-[2.7px] mb-5">
          O REFÚGIO PERFEITO PARA SE DESCONECTAR
        </h2>
        <h1 className="text-white text-[99.2px] leading-[119px] tracking-[0.4px] max-w-[494px] mb-2.5 max-sm:text-5xl max-sm:leading-[58px]">
          REFUGIO DOS SEUS SONHOS
        </h1>
        <p className="text-white text-base leading-[27.2px] max-w-[542px] mb-5">
          Desfrute de uma estadia inesquecível em nosso resort à beira-mar,
          com acomodações de luxo e paisagens deslumbrantes.
        </p>
        
        <button className="flex items-center gap-1.5 text-white text-[12.8px] w-fit bg-[#0466C8] mb-5 px-[45px] py-[17px] rounded-[50px]">
          <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7998 2.01003H9.59981V0.710034C9.59981 0.544359 9.46548 0.410034 9.29981 0.410034H8.29981C8.13413 0.410034 7.99981 0.544359 7.99981 0.710034V2.01003H4.79981V0.710034C4.79981 0.544359 4.66548 0.410034 4.4998 0.410034H3.4998C3.33413 0.410034 3.1998 0.544359 3.1998 0.710034V2.01003H1.9998C1.33705 2.01003 0.799805 2.54728 0.799805 3.21003V12.01C0.799805 12.6728 1.33705 13.21 1.9998 13.21H10.7998C11.4626 13.21 11.9998 12.6728 11.9998 12.01V3.21003C11.9998 2.54728 11.4626 2.01003 10.7998 2.01003Z" fill="white"/>
          </svg>
          AGENDAMENTO ONLINE
        </button>

        <div className="flex items-center gap-[15px]">
          <img
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=200"
            alt="Rating stars"
            className="w-[147px] h-[27px]"
          />
          <span className="text-white text-base">Mais de 1.000 avaliações</span>
        </div>
      </div>
    </section>
  );
};
