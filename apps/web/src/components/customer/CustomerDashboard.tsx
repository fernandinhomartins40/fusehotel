
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReservationCard } from './ReservationCard';
import { ReservationTimeline } from './ReservationTimeline';
import { ReservationFilters } from './ReservationFilters';
import { ProfileForm } from './ProfileForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMyReservations } from '@/hooks/useReservations';
import { User, LogOut, Calendar, Filter, Loader2, UserCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: profile } = useProfile();
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);

  // Buscar reservas da API
  const { data: reservations, isLoading, error } = useMyReservations();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
  };

  const handleFilterChange = (filters: any) => {
    setStatusFilter(filters.status || 'all');
    setDateRange(filters.dateRange || null);
  };

  // Aplicar filtros
  const filteredReservations = useMemo(() => {
    if (!reservations) return [];

    let filtered = [...reservations];

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (dateRange) {
      // Apply date filtering logic here if needed
    }

    return filtered;
  }, [reservations, statusFilter, dateRange]);

  // Renderizar erro
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Erro ao carregar reservas</h2>
            <p className="text-gray-600">
              {(error as any)?.response?.data?.message || 'Ocorreu um erro ao carregar suas reservas'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Olá, {user?.name}!
            </h1>
            {profile?.isProvisional && (
              <Badge variant="outline" className="border-orange-500 text-orange-600">
                Cadastro Provisório
              </Badge>
            )}
          </div>
          <p className="text-gray-600">
            {isLoading ? 'Carregando...' : `${filteredReservations.length} reserva${filteredReservations.length !== 1 ? 's' : ''} encontrada${filteredReservations.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={20} />
            <span>{user?.email}</span>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="reservations" className="flex items-center gap-2">
            <Calendar size={16} />
            Minhas Reservas
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircle size={16} />
            Meu Perfil
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock size={16} />
            Alterar Senha
          </TabsTrigger>
        </TabsList>

        {/* Reservations Tab */}
        <TabsContent value="reservations">
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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

          {/* Loading State */}
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-lg">Carregando reservas...</span>
              </CardContent>
            </Card>
          ) : filteredReservations.length > 0 ? (
            <>
              {/* Content */}
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              ) : (
                <ReservationTimeline reservations={filteredReservations} />
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhuma reserva encontrada
                </h3>
                <p className="text-gray-500">
                  {statusFilter !== 'all'
                    ? 'Nenhuma reserva encontrada para o filtro selecionado.'
                    : 'Você ainda não possui reservas.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
