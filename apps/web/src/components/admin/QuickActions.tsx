
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Home, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Nova Reserva',
      description: 'Criar nova reserva',
      icon: Plus,
      href: '/admin/reservations',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gerenciar Acomodações',
      description: 'Adicionar ou editar',
      icon: Home,
      href: '/admin/accommodations',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Calendário',
      description: 'Ver disponibilidade',
      icon: Calendar,
      href: '/admin/reservations',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Promoções',
      description: 'Criar oferta especial',
      icon: Tag,
      href: '/admin/packages-promotions',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all"
              asChild
            >
              <Link to={action.href}>
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
