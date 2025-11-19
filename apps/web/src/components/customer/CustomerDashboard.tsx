
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReservationCard } from './ReservationCard';
import { ReservationTimeline } from './ReservationTimeline';
import { ReservationFilters } from './ReservationFilters';
import { useAuth } from '@/hooks/useAuth';
import { mockReservations } from '@/data/mockReservations';
import { User, LogOut, Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner';

export const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [filteredReservations, setFilteredReservations] = useState(mockReservations);

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...mockReservations];
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    
    if (filters.dateRange) {
      // Apply date filtering logic here
    }
    
    setFilteredReservations(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Gerencie suas reservas e acompanhe seu histórico
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

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <ReservationFilters onFilterChange={handleFilterChange} />
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="bg-[#0466C8] hover:bg-[#0355A6]"
          >
            <Filter size={16} />
            Cards
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className="bg-[#0466C8] hover:bg-[#0355A6]"
          >
            <Calendar size={16} />
            Timeline
          </Button>
        </div>
      </div>

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

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Nenhuma reserva encontrada
          </h3>
          <p className="text-gray-500">
            Ajuste os filtros ou faça uma nova reserva
          </p>
        </div>
      )}
    </div>
  );
};
