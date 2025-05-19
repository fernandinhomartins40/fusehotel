import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-white px-[360px] py-[37px] max-md:px-5 max-md:py-10 max-sm:p-5">
      <div className="w-[210px] h-[46px]">
        <div dangerouslySetInnerHTML={{
          __html: "<svg id=\"2:6\" layer-name=\"Logo-colorida-1.svg\" width=\"210\" height=\"47\" viewBox=\"0 0 210 47\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"logo-image\"> <g clip-path=\"url(#clip0_2_6)\"> <path d=\"M0.568787 45.4843L3.79189 12.1157H15.1107L18.2769 45.4843H11.9634L11.4894 40.0999H7.47003L7.05292 45.4843H0.568787ZM7.94401 34.7722H10.9775L9.51765 17.8035H9.2143L7.94401 34.7722ZM4.89155 11.1109V6.88286L13.8973 2.74971V9.32864L4.89155 11.1109ZM27.2068 45.7877C22.4417 45.7877 20.0591 42.375 20.0591 35.5496V21.1593C20.0591 14.928 22.7893 11.8123 28.2496 11.8123C30.4995 11.8123 32.2247 12.2674 33.4255 13.1774C34.6263 14.0748 35.4542 15.3893 35.9092 17.121C36.3642 18.8526 36.5918 20.9634 36.5918 23.4534H30.0697V20.4958C30.0697 19.7753 29.9686 19.175 29.7663 18.6946C29.5767 18.2017 29.1723 17.9552 28.5529 17.9552C27.7819 17.9552 27.27 18.2143 27.0172 18.7325C26.7771 19.2507 26.657 19.8195 26.657 20.4389V36.6113C26.657 37.5087 26.7708 38.2418 26.9982 38.8106C27.2384 39.3667 27.6998 39.6448 28.3823 39.6448C29.0901 39.6448 29.5578 39.3667 29.7853 38.8106C30.0255 38.2418 30.1455 37.4961 30.1455 36.5734V31.8146H28.3633V26.0509H36.5159V45.4843H33.8426L32.7051 42.6784C31.5422 44.7512 29.7094 45.7877 27.2068 45.7877Z\" fill=\"#202020\"></path></g></svg>"
        }} />
      </div>
      
      <nav className="flex gap-[18px] max-sm:hidden">
        <a href="#accommodations" className="text-[#0466C8] text-[13.9px] leading-5">
          Acomodações
        </a>
        <a href="#highlights" className="text-[#0466C8] text-[13.9px] leading-5">
          Destaques
        </a>
        <a href="#gallery" className="text-[#0466C8] text-[13.9px] leading-5">
          Fotos
        </a>
        <a href="#contact" className="text-[#0466C8] text-[13.9px] leading-5">
          Contato
        </a>
      </nav>

      <button className="flex items-center gap-1.5 text-white text-[12.8px] bg-[#0466C8] px-[45px] py-[17px] rounded-[50px]">
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.69986 8.1C7.98236 8.1 7.63736 8.5 6.45986 8.5C5.28236 8.5 4.93986 8.1 4.21986 8.1C2.36486 8.1 0.859863 9.605 0.859863 11.46V12.1C0.859863 12.7625 1.39736 13.3 2.05986 13.3H10.8599C11.5224 13.3 12.0599 12.7625 12.0599 12.1V11.46C12.0599 9.605 10.5549 8.1 8.69986 8.1Z" fill="black"/>
        </svg>
        ÁREA DO CLIENTE
      </button>
    </header>
  );
};
