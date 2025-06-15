
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: 'Acomodações', path: '/#accommodations' },
    { label: 'Serviços', path: '/servicos' },
    { label: 'Sobre Nós', path: '/sobre-nos' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contato', path: '/contato' }
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="text-gray-600 hover:text-[#0466C8]"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMenu}
          />
          
          {/* Menu */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-6 border-b">
              <img 
                src="/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png" 
                alt="Águas Claras" 
                className="h-8"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-gray-600"
              >
                <X size={24} />
              </Button>
            </div>
            
            <nav className="p-6">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={toggleMenu}
                      className="block text-lg text-gray-600 hover:text-[#0466C8] py-2 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t">
                <Button 
                  className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full py-3"
                  onClick={toggleMenu}
                >
                  Área do Cliente
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};
