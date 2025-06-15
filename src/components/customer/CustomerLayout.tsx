
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { User, Calendar, Heart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/area-do-cliente', icon: User },
  { name: 'Minhas Reservas', href: '/area-do-cliente/reservas', icon: Calendar },
  { name: 'Favoritos', href: '/area-do-cliente/favoritos', icon: Heart },
  { name: 'Perfil', href: '/area-do-cliente/perfil', icon: Settings },
];

export const CustomerLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-6">Área do Cliente</h2>
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-[#0466C8] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        )}
                      >
                        <Icon size={18} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
