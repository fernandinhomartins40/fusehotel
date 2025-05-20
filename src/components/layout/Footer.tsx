
import React from 'react';
import { Phone, MessageSquare, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png" 
            alt="Águas Claras" 
            className="h-12"
          />
        </div>
        
        {/* Contact Information */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-8">
          <a 
            href="tel:+551155555555" 
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
          >
            <Phone size={18} />
            <span>(11) 5555-5555</span>
          </a>
          
          <a 
            href="https://wa.me/5511999999999" 
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
          >
            <MessageSquare size={18} />
            <span>(11) 99999-9999</span>
          </a>
          
          <a 
            href="mailto:contato@aguasclaras.com" 
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
          >
            <Mail size={18} />
            <span>contato@aguasclaras.com</span>
          </a>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-sm">
          <p>ÁGUAS CLARAS 2.0 - TODOS OS DIREITOS RESERVADOS</p>
        </div>
      </div>
    </footer>
  );
};
