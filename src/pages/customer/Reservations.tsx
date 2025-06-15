
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedReservationCard } from '@/components/customer/EnhancedReservationCard';
import { ReservationFiltersComponent, ReservationFilters } from '@/components/customer/ReservationFilters';
import { Reservation } from '@/types/reservation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock reservations data
const mockReservations: Reservation[] = [
  {
    id: '1',
    userId: '1',
    roomId: '1',
    roomName: 'Suíte Premium',
    roomImage: '/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png',
    checkIn: '2024-07-15',
    checkOut: '2024-07-18',
    guests: 2,
    totalPrice: 899.97,
    status: 'confirmed',
    createdAt: '2024-06-01T10:00:00Z',
    specialRequests: 'Cama extra para criança',
  },
  {
    id: '2',
    userId: '1',
    roomId: '2',
    roomName: 'Quarto Standard',
    roomImage: '/lovable-uploads/6cff717e-9bcc-4de2-8466-11400c267a66.png',
    checkIn: '2024-08-22',
    checkOut: '2024-08-25',
    guests: 1,
    totalPrice: 449.97,
    status: 'pending',
    createdAt: '2024-06-15T14:30:00Z',
  },
  {
    id: '3',
    userId: '1',
    roomId: '3',
    roomName: 'Suíte Família',
    roomImage: '/lovable-uploads/9ba14886-b3ce-4365-869f-8a6daaf9f6a7.png',
    checkIn: '2024-05-10',
    checkOut: '2024-05-14',
    guests: 4,
    totalPrice: 1199.96,
    status: 'confirmed',
    createdAt: '2024-04-20T09:15:00Z',
  },
];

const Reservations: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [filters, setFilters] = useState<ReservationFilters>({});

  const handleCancelReservation = (reservationId: string) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: 'cancelled' as const }
          : reservation
      )
    );
    
    toast({
      title: "Reserva cancelada",
      description: "Sua reserva foi cancelada com sucesso.",
    });
  };

  const handleEditReservation = (reservationId: string) => {
    toast({
      title: "Editar Reserva",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleRescheduleReservation = (reservationId: string) => {
    toast({
      title: "Reagendar Reserva",
      description: "Funcionalidade de reagendamento será implementada em breve.",
    });
  };

  const handleDuplicateReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      const newReservation: Reservation = {
        ...reservation,
        id: (Math.random() * 1000).toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        checkIn: '', // User will need to select new dates
        checkOut: ''
      };
      
      toast({
        title: "Reserva Duplicada",
        description: "Uma nova reserva foi criada baseada na selecionada. Selecione as novas datas.",
      });
    }
  };

  const handleDownloadVoucher = (reservationId: string) => {
    toast({
      title: "Download do Voucher",
      description: "O voucher da reserva está sendo preparado para download.",
    });
  };

  const handleRequestServices = (reservationId: string) => {
    toast({
      title: "Solicitar Serviços",
      description: "Redirecionando para a página de serviços adicionais.",
    });
  };

  const handleContact = (reservationId: string) => {
    toast({
      title: "Contato",
      description: "Redirecionando para os canais de atendimento.",
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Filter reservations based on current filters
  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => {
      if (filters.status && reservation.status !== filters.status) return false;
      if (filters.roomName && !reservation.roomName.toLowerCase().includes(filters.roomName.toLowerCase())) return false;
      if (filters.priceMin && reservation.totalPrice < filters.priceMin) return false;
      if (filters.priceMax && reservation.totalPrice > filters.priceMax) return false;
      if (filters.dateFrom && new Date(reservation.checkIn) < filters.dateFrom) return false;
      if (filters.dateTo && new Date(reservation.checkOut) > filters.dateTo) return false;
      return true;
    });
  }, [reservations, filters]);

  const upcomingReservations = filteredReservations.filter(r => 
    new Date(r.checkIn) > new Date() && r.status !== 'cancelled'
  );
  
  const pastReservations = filteredReservations.filter(r => 
    new Date(r.checkOut) < new Date() || r.status === 'cancelled'
  );
  
  const allReservations = filteredReservations;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Minhas Reservas</CardTitle>
          <CardDescription>
            Gerencie suas reservas atuais e históricas
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <ReservationFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Próximas ({upcomingReservations.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Históricas ({pastReservations.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todas ({allReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingReservations.map((reservation) => (
                <EnhancedReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={handleCancelReservation}
                  onEdit={handleEditReservation}
                  onReschedule={handleRescheduleReservation}
                  onDuplicate={handleDuplicateReservation}
                  onDownloadVoucher={handleDownloadVoucher}
                  onRequestServices={handleRequestServices}
                  onContact={handleContact}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma reserva próxima
                </p>
                <p className="text-gray-600 text-center">
                  Você não possui reservas confirmadas no momento.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastReservations.map((reservation) => (
                <EnhancedReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onDuplicate={handleDuplicateReservation}
                  onDownloadVoucher={handleDownloadVoucher}
                  onContact={handleContact}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma reserva histórica
                </p>
                <p className="text-gray-600 text-center">
                  Suas reservas passadas aparecerão aqui.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allReservations.map((reservation) => (
              <EnhancedReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancelReservation}
                onEdit={handleEditReservation}
                onReschedule={handleRescheduleReservation}
                onDuplicate={handleDuplicateReservation}
                onDownloadVoucher={handleDownloadVoucher}
                onRequestServices={handleRequestServices}
                onContact={handleContact}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reservations;
