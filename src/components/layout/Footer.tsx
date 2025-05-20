
import React from 'react';
import { Phone, MessageSquare, Mail, LayoutDashboard, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-hotel-darkgray text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: About */}
          <div className="flex flex-col animate-fade-in">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png" 
                alt="Águas Claras" 
                className="h-14"
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Bem-vindo ao Águas Claras, onde conforto e natureza se encontram para proporcionar uma experiência única de hospedagem. Nosso hotel oferece acomodações de qualidade em um ambiente tranquilo e acolhedor.
            </p>
            <div className="flex space-x-5 mt-2">
              <a href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-hotel-lightblue transition-colors bg-white/10 p-2.5 rounded-full">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-hotel-lightblue transition-colors bg-white/10 p-2.5 rounded-full">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-white hover:text-hotel-lightblue transition-colors bg-white/10 p-2.5 rounded-full">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Links Rápidos */}
          <div className="flex flex-col animate-fade-in" style={{animationDelay: "0.1s"}}>
            <h3 className="font-playfair font-semibold text-xl mb-6 border-b border-hotel-gold pb-3 inline-block">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-hotel-gold transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-hotel-gold rounded-full"></span>
                  Início
                </Link>
              </li>
              <li>
                <Link to="#accommodations" className="text-gray-300 hover:text-hotel-gold transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-hotel-gold rounded-full"></span>
                  Acomodações
                </Link>
              </li>
              <li>
                <Link to="#gallery" className="text-gray-300 hover:text-hotel-gold transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-hotel-gold rounded-full"></span>
                  Galeria
                </Link>
              </li>
              <li>
                <Link to="#services" className="text-gray-300 hover:text-hotel-gold transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-hotel-gold rounded-full"></span>
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="#newsletter" className="text-gray-300 hover:text-hotel-gold transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-hotel-gold rounded-full"></span>
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contato */}
          <div className="flex flex-col animate-fade-in" style={{animationDelay: "0.2s"}}>
            <h3 className="font-playfair font-semibold text-xl mb-6 border-b border-hotel-gold pb-3 inline-block">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-hotel-gold" />
                <span className="text-gray-300">Rua das Águas, 123, Centro<br/>Águas Claras - SP, 12345-678</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0 text-hotel-gold" />
                <a href="tel:+551155555555" className="text-gray-300 hover:text-white transition-colors">(11) 5555-5555</a>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="flex-shrink-0 text-hotel-gold" />
                <a href="https://wa.me/5511999999999" className="text-gray-300 hover:text-white transition-colors">(11) 99999-9999</a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0 text-hotel-gold" />
                <a href="mailto:contato@aguasclaras.com" className="text-gray-300 hover:text-white transition-colors">contato@aguasclaras.com</a>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-1 flex-shrink-0 text-hotel-gold" />
                <div className="text-gray-300">
                  <p>Segunda - Sexta: 8h às 22h</p>
                  <p>Sábado - Domingo: 10h às 20h</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 4: Mapa */}
          <div className="flex flex-col animate-fade-in" style={{animationDelay: "0.3s"}}>
            <h3 className="font-playfair font-semibold text-xl mb-6 border-b border-hotel-gold pb-3 inline-block">Localização</h3>
            <div className="h-48 bg-gray-700 rounded-md overflow-hidden relative card-shadow">
              {/* Placeholder for a real map integration */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <MapPin size={32} className="text-hotel-gold" />
                <span className="ml-2 text-gray-300">Mapa disponível em breve</span>
              </div>
            </div>
            {/* Admin Access Button */}
            <div className="mt-6">
              <Button variant="outline" size="sm" className="bg-transparent text-white border-white hover:bg-white hover:text-hotel-darkgray transition-all" asChild>
                <Link to="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Acesso Hoteleiro
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ÁGUAS CLARAS 2.0 - TODOS OS DIREITOS RESERVADOS
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm text-gray-400">
                <li><a href="#" className="hover:text-hotel-gold transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-hotel-gold transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-hotel-gold transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
