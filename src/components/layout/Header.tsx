
import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { MobileMenu } from './MobileMenu';

export const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="flex justify-between items-center bg-white px-4 md:px-12 lg:px-24 py-8 border-b border-gray-200">
      <div className="w-[210px]">
        <Link to="/">
          <img 
            src="/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png" 
            alt="Águas Claras" 
            className="h-12"
          />
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => scrollToSection('accommodations')} 
          className="text-gray-600 text-base hover:text-[#0466C8] cursor-pointer"
        >
          Acomodações
        </button>
        <Link to="/servicos" className="text-gray-600 text-base hover:text-[#0466C8]">
          Serviços
        </Link>
        <Link to="/sobre-nos" className="text-gray-600 text-base hover:text-[#0466C8]">
          Sobre Nós
        </Link>
        <Link to="/faq" className="text-gray-600 text-base hover:text-[#0466C8]">
          FAQ
        </Link>
        <Link to="/contato" className="text-gray-600 text-base hover:text-[#0466C8]">
          Contato
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Button 
          className="hidden md:flex bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full px-6 py-2 items-center gap-2"
        >
          <User size={18} />
          <span className="uppercase font-medium">Área do cliente</span>
        </Button>
        
        <Button 
          className="md:hidden bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full p-2"
        >
          <User size={18} />
        </Button>
        
        <MobileMenu />
      </div>
    </header>
  );
};
