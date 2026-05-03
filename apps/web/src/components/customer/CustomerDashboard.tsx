import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReservationCard } from './ReservationCard';
import { ReservationTimeline } from './ReservationTimeline';
import { ReservationFilters } from './ReservationFilters';
import { ProfileForm } from './ProfileForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { RoomServiceTab } from './RoomServiceTab';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMyReservations } from '@/hooks/useReservations';
import { User, LogOut, Calendar, Filter, Loader2, UserCircle, Lock, ConciergeBell } from 'lucide-react';
import { toast } from 'sonner';

export const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: profile } = useProfile();
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);

  const { data: reservations, isLoading, error } = useMyReservations();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
  };

  const handleFilterChange = (filters: any) => {
    setStatusFilter(filters.status || 'all');
    setDateRange(filters.dateRange || null);
  };

  const filteredReservations = useMemo(() => {
    if (!reservations) return [];

    let filtered = [...reservations];

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter);
    }

    return filtered;
  }, [reservations, statusFilter, dateRange]);

  if (error) {
    return (
      <div className="page-container py-8 md:py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 text-red-600">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold">Erro ao carregar reservas</h2>
            <p className="text-gray-600">
              {(error as any)?.response?.data?.message || 'Ocorreu um erro ao carregar suas reservas'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container py-8 md:py-10">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Olá, {user?.name}!</h1>
            {profile?.isProvisional && (
              <Badge variant="outline" className="border-orange-500 text-orange-600">
                Cadastro provisório
              </Badge>
            )}
          </div>
          <p className="text-gray-600">
            {isLoading
              ? 'Carregando...'
              : `${filteredReservations.length} reserva${filteredReservations.length !== 1 ? 's' : ''} encontrada${filteredReservations.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={20} />
            <span>{user?.email}</span>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 gap-2 md:grid-cols-4">
          <TabsTrigger value="reservations" className="flex items-center gap-2">
            <Calendar size={16} />
            Minhas reservas
          </TabsTrigger>
          <TabsTrigger value="room-service" className="flex items-center gap-2">
            <ConciergeBell size={16} />
            Meu quarto
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircle size={16} />
            Meu perfil
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock size={16} />
            Alterar senha
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reservations">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <ReservationFilters onFilterChange={handleFilterChange} />

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="gap-2"
              >
                <Filter size={16} />
                Cards
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                className="gap-2"
              >
                <Calendar size={16} />
                Timeline
              </Button>
            </div>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-lg">Carregando reservas...</span>
              </CardContent>
            </Card>
          ) : filteredReservations.length > 0 ? (
            viewMode === 'cards' ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <ReservationTimeline reservations={filteredReservations} />
            )
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-600">Nenhuma reserva encontrada</h3>
                <p className="text-gray-500">
                  {statusFilter !== 'all'
                    ? 'Nenhuma reserva encontrada para o filtro selecionado.'
                    : 'Você ainda não possui reservas.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="room-service">
          <RoomServiceTab />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="password">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
