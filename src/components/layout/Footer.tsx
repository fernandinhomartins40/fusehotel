
import React from 'react';
import { Phone, MessageSquare, Mail, LayoutDashboard, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: About */}
          <div className="flex flex-col">
            <div className="mb-4">
              <Link to="/">
                <img 
                  src="/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png" 
                  alt="Águas Claras" 
                  className="h-12"
                />
              </Link>
            </div>
            <p className="text-gray-400 mb-4">
              Bem-vindo ao Águas Claras, onde conforto e natureza se encontram para proporcionar uma experiência única de hospedagem. Nosso hotel oferece acomodações de qualidade em um ambiente tranquilo e acolhedor.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-pink-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-white hover:text-blue-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Links Rápidos */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/acomodacoes" className="text-gray-400 hover:text-white transition-colors">Acomodações</Link>
              </li>
              <li>
                <Link to="/servicos" className="text-gray-400 hover:text-white transition-colors">Serviços</Link>
              </li>
              <li>
                <Link to="/sobre-nos" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">Perguntas Frequentes</Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">Contato</Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contato */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-gray-400">Rua das Águas, 123, Centro<br/>Águas Claras - SP, 12345-678</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:+551155555555" className="text-gray-400 hover:text-white transition-colors">(11) 5555-5555</a>
              </div>
              
              <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                <a href="https://wa.me/5511999999999" className="text-gray-400 hover:text-white transition-colors">(11) 99999-9999</a>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:contato@aguasclaras.com" className="text-gray-400 hover:text-white transition-colors">contato@aguasclaras.com</a>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock size={18} className="mt-1 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>Segunda - Sexta: 8h às 22h</p>
                  <p>Sábado - Domingo: 10h às 20h</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 4: Mapa */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl mb-4">Localização</h3>
            <div className="h-48 bg-gray-800 rounded-md overflow-hidden relative">
              {/* Placeholder for a real map integration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin size={32} />
                <span className="ml-2">Mapa disponível em breve</span>
              </div>
            </div>
            {/* Admin Access Button */}
            <div className="mt-4">
              <Button variant="outline" size="sm" className="bg-transparent text-white border-white hover:bg-white hover:text-black" asChild>
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
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ÁGUAS CLARAS 2.0 - TODOS OS DIREITOS RESERVADOS
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm text-gray-500">
                <li><Link to="/politicas-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
