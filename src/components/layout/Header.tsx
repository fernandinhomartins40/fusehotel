
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, Menu, X } from "lucide-react";
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow-md py-4" : "bg-transparent py-8"
    )}>
      <div className="container mx-auto px-4 md:px-12 lg:px-24 flex justify-between items-center">
        <div className="w-[210px]">
          <img 
            src="/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png" 
            alt="Águas Claras" 
            className="h-12"
          />
        </div>
        
        <button
          className="md:hidden text-hotel-darkgray"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={cn(
          "fixed md:static top-[72px] left-0 right-0 bg-white md:bg-transparent md:flex items-center gap-8 transition-all duration-300",
          mobileMenuOpen ? "flex flex-col py-4 shadow-md" : "hidden"
        )}>
          <a href="#accommodations" className="text-hotel-darkgray px-8 md:px-0 py-3 md:py-0 text-base hover:text-hotel-blue transition-colors">
            Acomodações
          </a>
          <a href="#highlights" className="text-hotel-darkgray px-8 md:px-0 py-3 md:py-0 text-base hover:text-hotel-blue transition-colors">
            Destaques
          </a>
          <a href="#gallery" className="text-hotel-darkgray px-8 md:px-0 py-3 md:py-0 text-base hover:text-hotel-blue transition-colors">
            Fotos
          </a>
          <a href="#contact" className="text-hotel-darkgray px-8 md:px-0 py-3 md:py-0 text-base hover:text-hotel-blue transition-colors">
            Contato
          </a>
        </nav>

        <Button 
          className={cn(
            "button-primary hidden md:flex",
            isScrolled ? "bg-hotel-blue" : "bg-white/20 hover:bg-white/30 backdrop-blur-md"
          )}
        >
          <User size={18} />
          <span className="uppercase font-medium">Área do cliente</span>
        </Button>
      </div>
    </header>
  );
};
