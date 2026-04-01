import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccommodationsClick = () => {
    setIsOpen(false);

    if (location.pathname === '/') {
      scrollToSection('accommodations');
      return;
    }

    navigate('/acomodacoes');
  };

  const menuItems = [
    { label: 'Acomodações', action: handleAccommodationsClick },
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
                  <li key={item.label}>
                    {'action' in item ? (
                      <button
                        type="button"
                        onClick={item.action}
                        className="block w-full text-left text-lg text-gray-600 hover:text-[#0466C8] py-2 transition-colors"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={toggleMenu}
                        className="block text-lg text-gray-600 hover:text-[#0466C8] py-2 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t">
                <Link to="/area-do-cliente">
                  <Button
                    className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full py-3"
                    onClick={toggleMenu}
                  >
                    Área do Cliente
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};
