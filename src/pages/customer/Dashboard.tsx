
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, User, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Mock data for dashboard stats
  const stats = [
    {
      title: 'Reservas Ativas',
      value: '2',
      description: 'Próximas reservas confirmadas',
      icon: Calendar,
      link: '/area-do-cliente/reservas',
    },
    {
      title: 'Favoritos',
      value: '5',
      description: 'Acomodações e promoções salvas',
      icon: Heart,
      link: '/area-do-cliente/favoritos',
    },
    {
      title: 'Perfil',
      value: '100%',
      description: 'Perfil completo',
      icon: User,
      link: '/area-do-cliente/perfil',
    },
  ];

  const recentReservations = [
    {
      id: '1',
      roomName: 'Suíte Premium',
      checkIn: '2024-07-15',
      checkOut: '2024-07-18',
      status: 'confirmed' as const,
    },
    {
      id: '2',
      roomName: 'Quarto Standard',
      checkIn: '2024-08-22',
      checkOut: '2024-08-25',
      status: 'pending' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Bem-vindo de volta, {user.name.split(' ')[0]}!
          </CardTitle>
          <CardDescription>
            Gerencie suas reservas, favoritos e perfil em um só lugar.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to={stat.link}>Ver detalhes</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Reservas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{reservation.roomName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(reservation.checkIn).toLocaleDateString('pt-BR')} - {' '}
                      {new Date(reservation.checkOut).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/area-do-cliente/reservas">Ver todas as reservas</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/acomodacoes">
                  <Calendar className="mr-2 h-4 w-4" />
                  Fazer nova reserva
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/promocoes">
                  <Heart className="mr-2 h-4 w-4" />
                  Ver promoções
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/area-do-cliente/perfil">
                  <User className="mr-2 h-4 w-4" />
                  Editar perfil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
