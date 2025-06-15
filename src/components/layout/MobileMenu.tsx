
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: 'Acomodações', path: '/#accommodations' },
    { label: 'Serviços', path: '/servicos' },
    { label: 'Sobre Nós', path: '/sobre-nos' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contato', path: '/contato' }
  ];

  const customerMenuItems = user ? [
    { label: 'Dashboard', path: '/area-do-cliente' },
    { label: 'Minhas Reservas', path: '/area-do-cliente/reservas' },
    { label: 'Favoritos', path: '/area-do-cliente/favoritos' },
    { label: 'Perfil', path: '/area-do-cliente/perfil' },
  ] : [];

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
              
              {user && (
                <>
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Área do Cliente</h3>
                    <ul className="space-y-2">
                      {customerMenuItems.map((item) => (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            onClick={toggleMenu}
                            className="block text-base text-gray-600 hover:text-[#0466C8] py-1 transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                    >
                      Sair
                    </Button>
                  </div>
                </>
              )}
              
              {!user && (
                <div className="mt-8 pt-6 border-t space-y-3">
                  <Button 
                    className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white rounded-full py-3"
                    onClick={toggleMenu}
                    asChild
                  >
                    <Link to="/login">Fazer Login</Link>
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full rounded-full py-3"
                    onClick={toggleMenu}
                    asChild
                  >
                    <Link to="/cadastro">Criar Conta</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
};
