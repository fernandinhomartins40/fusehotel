import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isTransparent?: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isTransparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
        className={isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:text-primary'}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </Button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backdropFilter: isOpen ? 'blur(8px)' : 'none' }}
        onClick={toggleMenu}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <img
            src="/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png"
            alt="Logo"
            className="h-8"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="p-6">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = 'path' in item && location.pathname === item.path;
              return (
                <li key={item.label}>
                  {'action' in item ? (
                    <button
                      type="button"
                      onClick={item.action}
                      className="block w-full text-left text-base text-gray-700 hover:text-primary hover:bg-gray-50 py-3 px-3 rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={toggleMenu}
                      className={`block text-base py-3 px-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-primary font-medium bg-primary/5'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link to="/area-do-cliente">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3"
                onClick={toggleMenu}
              >
                Área do Cliente
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};
