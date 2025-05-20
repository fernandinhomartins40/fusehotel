
import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-white px-4 md:px-12 lg:px-24 py-6 border-b border-gray-200">
      <div className="w-[210px]">
        <div dangerouslySetInnerHTML={{
          __html: "<svg id=\"2:6\" layer-name=\"Logo-colorida-1.svg\" width=\"210\" height=\"47\" viewBox=\"0 0 210 47\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"logo-image\"> <g clip-path=\"url(#clip0_2_6)\"> <path d=\"M0.568787 45.4843L3.79189 12.1157H15.1107L18.2769 45.4843H11.9634L11.4894 40.0999H7.47003L7.05292 45.4843H0.568787ZM7.94401 34.7722H10.9775L9.51765 17.8035H9.2143L7.94401 34.7722ZM4.89155 11.1109V6.88286L13.8973 2.74971V9.32864L4.89155 11.1109ZM27.2068 45.7877C22.4417 45.7877 20.0591 42.375 20.0591 35.5496V21.1593C20.0591 14.928 22.7893 11.8123 28.2496 11.8123C30.4995 11.8123 32.2247 12.2674 33.4255 13.1774C34.6263 14.0748 35.4542 15.3893 35.9092 17.121C36.3642 18.8526 36.5918 20.9634 36.5918 23.4534H30.0697V20.4958C30.0697 19.7753 29.9686 19.175 29.7663 18.6946C29.5767 18.2017 29.1723 17.9552 28.5529 17.9552C27.7819 17.9552 27.27 18.2143 27.0172 18.7325C26.7771 19.2507 26.657 19.8195 26.657 20.4389V36.6113C26.657 37.5087 26.7708 38.2418 26.9982 38.8106C27.2384 39.3667 27.6998 39.6448 28.3823 39.6448C29.0901 39.6448 29.5578 39.3667 29.7853 38.8106C30.0255 38.2418 30.1455 37.4961 30.1455 36.5734V31.8146H28.3633V26.0509H36.5159V45.4843H33.8426L32.7051 42.6784C31.5422 44.7512 29.7094 45.7877 27.2068 45.7877Z\" fill=\"#202020\"></path></g></svg>"
        }} />
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <a href="#accommodations" className="text-gray-600 text-base hover:text-[#0466C8]">
          Acomodações
        </a>
        <a href="#highlights" className="text-gray-600 text-base hover:text-[#0466C8]">
          Destaques
        </a>
        <a href="#gallery" className="text-gray-600 text-base hover:text-[#0466C8]">
          Fotos
        </a>
        <a href="#contact" className="text-gray-600 text-base hover:text-[#0466C8]">
          Contato
        </a>
      </nav>

      <Button 
        className="bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full px-6 py-2 flex items-center gap-2"
      >
        <User size={18} />
        <span className="hidden md:inline uppercase font-medium">Área do cliente</span>
      </Button>
    </header>
  );
};
