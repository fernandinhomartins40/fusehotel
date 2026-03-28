import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Loader2 } from 'lucide-react';
import { ScheduleCalendar } from '@/components/admin/schedule/ScheduleCalendar';
import { ScheduleList } from '@/components/admin/schedule/ScheduleList';
import { ScheduleStatsCard } from '@/components/admin/schedule/ScheduleStats';
import { useSchedule, useScheduleStats } from '@/hooks/useSchedule';
import { useAccommodations } from '@/hooks/useAccommodations';
import type { ScheduleReservation } from '@/types/schedule';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { reservationStatusColors, reservationStatusLabels, paymentStatusLabels } from '@/types/schedule';

export default function Schedule() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedReservation, setSelectedReservation] = useState<ScheduleReservation | null>(null);

  // Calculate date range for current month
  const startDate = useMemo(() => {
    return format(startOfMonth(currentDate), 'yyyy-MM-dd');
  }, [currentDate]);

  const endDate = useMemo(() => {
    return format(endOfMonth(currentDate), 'yyyy-MM-dd');
  }, [currentDate]);

  // Fetch data
  const { data: accommodations = [] } = useAccommodations();
  const { data: schedule = [], isLoading: isLoadingSchedule } = useSchedule({
    startDate,
    endDate,
    accommodationId: selectedAccommodationId === 'all' ? undefined : selectedAccommodationId,
  });
  const { data: stats, isLoading: isLoadingStats } = useScheduleStats(startDate, endDate);

  // Navigation handlers
  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleReservationClick = (reservation: ScheduleReservation) => {
    setSelectedReservation(reservation);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agenda de Reservas</h1>
            <p className="text-gray-600 mt-1">
              Visualize e gerencie todas as reservas e disponibilidade das acomodações
            </p>
          </div>
        </div>

        {/* Statistics */}
        {stats && <ScheduleStatsCard stats={stats} isLoading={isLoadingStats} />}

        {/* Controls */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleToday} className="min-w-[120px]">
                Hoje
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="ml-4 text-lg font-semibold">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Accommodation Filter */}
              <Select
                value={selectedAccommodationId}
                onValueChange={setSelectedAccommodationId}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Selecione uma acomodação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Acomodações</SelectItem>
                  {accommodations.map(accommodation => (
                    <SelectItem key={accommodation.id} value={accommodation.id}>
                      {accommodation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'calendar' | 'list')}>
                <TabsList>
                  <TabsTrigger value="calendar" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Calendário
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-2">
                    <List className="h-4 w-4" />
                    Lista
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </Card>

        {/* Content */}
        {isLoadingSchedule ? (
          <Card className="p-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-gray-400" />
            <p className="text-gray-500">Carregando agenda...</p>
          </Card>
        ) : (
          <>
            {viewMode === 'calendar' ? (
              <ScheduleCalendar
                schedule={schedule}
                currentDate={currentDate}
                onReservationClick={handleReservationClick}
              />
            ) : (
              <ScheduleList
                schedule={schedule}
                onViewReservation={handleReservationClick}
              />
            )}
          </>
        )}

        {/* Reservation Details Dialog */}
        <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Reserva</DialogTitle>
              <DialogDescription>
                Código: {selectedReservation?.reservationCode}
              </DialogDescription>
            </DialogHeader>

            {selectedReservation && (
              <div className="space-y-6">
                {/* Status Badges */}
                <div className="flex gap-2">
                  <Badge
                    style={{
                      backgroundColor: `${reservationStatusColors[selectedReservation.status]}20`,
                      color: reservationStatusColors[selectedReservation.status],
                      borderColor: reservationStatusColors[selectedReservation.status],
                    }}
                    className="border"
                  >
                    {reservationStatusLabels[selectedReservation.status]}
                  </Badge>
                  <Badge variant="outline">
                    {paymentStatusLabels[selectedReservation.paymentStatus]}
                  </Badge>
                </div>

                {/* Guest Information */}
                <div>
                  <h3 className="font-semibold mb-3">Informações do Hóspede</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Nome</p>
                      <p className="font-medium">{selectedReservation.guestName}</p>
                    </div>
                    {selectedReservation.guestEmail && (
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{selectedReservation.guestEmail}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">WhatsApp</p>
                      <p className="font-medium">{selectedReservation.guestWhatsApp}</p>
                    </div>
                    {selectedReservation.guestPhone && (
                      <div>
                        <p className="text-gray-500">Telefone</p>
                        <p className="font-medium">{selectedReservation.guestPhone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reservation Details */}
                <div>
                  <h3 className="font-semibold mb-3">Detalhes da Reserva</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Check-in</p>
                      <p className="font-medium">
                        {format(new Date(selectedReservation.checkInDate), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Check-out</p>
                      <p className="font-medium">
                        {format(new Date(selectedReservation.checkOutDate), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Número de Noites</p>
                      <p className="font-medium">{selectedReservation.numberOfNights}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Número de Hóspedes</p>
                      <p className="font-medium">{selectedReservation.numberOfGuests}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedReservation(null)}>
                    Fechar
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedReservation(null);
                      navigate('/admin/reservations');
                    }}
                  >
                    Ir para Reservas
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
