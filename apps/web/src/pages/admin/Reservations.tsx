import React, { useMemo, useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarPlus, ChevronLeft, ChevronRight, Eye, Filter, List, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ReservationDetails } from '@/components/admin/ReservationDetails';
import { CreateReservationDialog } from '@/components/admin/reservations/CreateReservationDialog';
import { ScheduleCalendar } from '@/components/admin/schedule/ScheduleCalendar';
import { ScheduleList } from '@/components/admin/schedule/ScheduleList';
import { ScheduleStatsCard } from '@/components/admin/schedule/ScheduleStats';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccommodations } from '@/hooks/useAccommodations';
import { useAdminCancelReservation, useAdminReservations, useUpdateReservationStatus } from '@/hooks/useAdminReservations';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSchedule, useScheduleStats } from '@/hooks/useSchedule';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { paymentStatusLabels, reservationStatusColors, reservationStatusLabels as scheduleStatusLabels, type ScheduleReservation } from '@/types/schedule';
import type { Reservation, ReservationStatus } from '@/types/reservation';

const reservationStatusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  CHECKED_IN: 'Check-in feito',
  CHECKED_OUT: 'Check-out feito',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Concluída',
  NO_SHOW: 'Não compareceu',
};

const reservationStatusClassNames: Record<ReservationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CHECKED_IN: 'bg-blue-100 text-blue-800',
  CHECKED_OUT: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  NO_SHOW: 'bg-orange-100 text-orange-800',
};

function buildCustomerMessage(
  reservation: Reservation,
  action: 'accepted' | 'rejected',
  reason?: string
) {
  const checkInDate = new Date(reservation.checkInDate).toLocaleDateString('pt-BR');
  const checkOutDate = new Date(reservation.checkOutDate).toLocaleDateString('pt-BR');

  if (action === 'accepted') {
    return `Olá ${reservation.guestName}, sua solicitação de reserva ${reservation.reservationCode} para ${reservation.accommodation?.name || 'a acomodação selecionada'} foi aceita pelo hotel.

Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Status: Confirmada

Se precisar de mais alguma informação, responda esta conversa.`;
  }

  return `Olá ${reservation.guestName}, sua solicitação de reserva ${reservation.reservationCode} não foi aprovada pelo hotel.

Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Motivo: ${reason || 'Indisponibilidade para o período solicitado.'}

Se desejar, fale conosco para buscarmos uma nova opção de hospedagem.`;
}

export function Reservations() {
  const [section, setSection] = useState<'queue' | 'calendar'>('queue');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedScheduleReservation, setSelectedScheduleReservation] = useState<ScheduleReservation | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string>('all');
  const [calendarViewMode, setCalendarViewMode] = useState<'calendar' | 'list'>('calendar');
  const isMobile = useIsMobile();

  const { data: reservations = [], isLoading, error } = useAdminReservations(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );
  const updateStatusMutation = useUpdateReservationStatus();
  const cancelReservationMutation = useAdminCancelReservation();

  const startDate = useMemo(() => format(startOfMonth(currentDate), 'yyyy-MM-dd'), [currentDate]);
  const endDate = useMemo(() => format(endOfMonth(currentDate), 'yyyy-MM-dd'), [currentDate]);
  const { data: accommodations = [] } = useAccommodations({ adminView: true });
  const { data: schedule = [], isLoading: isLoadingSchedule } = useSchedule({
    startDate,
    endDate,
    accommodationId: selectedAccommodationId === 'all' ? undefined : selectedAccommodationId,
  });
  const { data: scheduleStats, isLoading: isLoadingStats } = useScheduleStats(startDate, endDate);

  const summary = useMemo(() => ({
    total: reservations.length,
    pending: reservations.filter((reservation) => reservation.status === 'PENDING').length,
    confirmed: reservations.filter((reservation) => reservation.status === 'CONFIRMED').length,
    checkedIn: reservations.filter((reservation) => reservation.status === 'CHECKED_IN').length,
  }), [reservations]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const openCustomerWhatsApp = (reservation: Reservation, message: string) => {
    window.open(buildWhatsAppUrl(reservation.guestWhatsApp, message), '_blank');
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setDetailsOpen(true);
  };

  const handleAdvanceStatus = (reservation: Reservation, newStatus: ReservationStatus) => {
    updateStatusMutation.mutate(
      { id: reservation.id, status: newStatus },
      {
        onSuccess: (updatedReservation) => {
          setSelectedReservation(updatedReservation);

          if (newStatus === 'CONFIRMED') {
            openCustomerWhatsApp(updatedReservation, buildCustomerMessage(updatedReservation, 'accepted'));
            setDetailsOpen(false);
          }
        },
      }
    );
  };

  const handleRejectReservation = (reservation: Reservation, reason: string) => {
    cancelReservationMutation.mutate(
      { id: reservation.id, reason },
      {
        onSuccess: (updatedReservation) => {
          setSelectedReservation(updatedReservation);
          openCustomerWhatsApp(updatedReservation, buildCustomerMessage(updatedReservation, 'rejected', reason));
          setDetailsOpen(false);
        },
      }
    );
  };

  const reservationDetails = selectedReservation ? (
    <ReservationDetails
      reservation={selectedReservation}
      onAdvanceStatus={handleAdvanceStatus}
      onRejectReservation={handleRejectReservation}
      isUpdatingStatus={updateStatusMutation.isPending}
      isRejectingReservation={cancelReservationMutation.isPending}
    />
  ) : null;

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 text-red-600">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold">Erro ao carregar reservas</h2>
          <p className="text-gray-600">
            {(error as any)?.response?.data?.message || 'Ocorreu um erro ao carregar as reservas'}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reservas</h1>
            <p className="mt-1 text-gray-600">
              Frente única para fila comercial, aprovações e calendário operacional.
            </p>
          </div>

          <Button onClick={() => setShowCreateDialog(true)} size="lg">
            <CalendarPlus className="mr-2 h-5 w-5" />
            Nova reserva
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <CompactMetric label="Reservas" value={String(summary.total)} />
          <CompactMetric label="Pendentes" value={String(summary.pending)} />
          <CompactMetric label="Confirmadas" value={String(summary.confirmed)} />
          <CompactMetric label="Hospedadas" value={String(summary.checkedIn)} />
        </div>

        <Tabs value={section} onValueChange={(value) => setSection(value as 'queue' | 'calendar')} className="space-y-4">
          <TabsList className="h-auto flex-wrap rounded-2xl bg-slate-100 p-1">
            <TabsTrigger value="queue" className="rounded-xl px-4 py-2">Fila comercial</TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-xl px-4 py-2">Calendário operacional</TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="mt-0 space-y-4">
            <Card>
              <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">Reservas encontradas</div>
                  <div className="text-sm text-slate-500">
                    {isLoading ? 'Carregando...' : `${reservations.length} reservas no filtro atual`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                      <SelectItem value="CHECKED_IN">Check-in feito</SelectItem>
                      <SelectItem value="CHECKED_OUT">Check-out feito</SelectItem>
                      <SelectItem value="CANCELLED">Cancelada</SelectItem>
                      <SelectItem value="COMPLETED">Concluída</SelectItem>
                      <SelectItem value="NO_SHOW">Não compareceu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-lg">Carregando reservas...</span>
                </CardContent>
              </Card>
            ) : reservations.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Hóspede</TableHead>
                        <TableHead>Hospedagem</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-mono text-sm">{reservation.reservationCode}</TableCell>
                          <TableCell className="font-medium">{reservation.guestName}</TableCell>
                          <TableCell>{reservation.accommodation?.name || 'N/A'}</TableCell>
                          <TableCell>{formatDate(reservation.checkInDate)}</TableCell>
                          <TableCell>{formatDate(reservation.checkOutDate)}</TableCell>
                          <TableCell>{formatCurrency(Number(reservation.totalAmount))}</TableCell>
                          <TableCell>
                            <span className={`rounded px-2 py-1 text-xs font-medium ${reservationStatusClassNames[reservation.status]}`}>
                              {reservationStatusLabels[reservation.status]}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewReservation(reservation)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="mb-4 text-gray-400">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Nenhuma reserva encontrada</h3>
                  <p className="text-gray-600">
                    {statusFilter !== 'all'
                      ? 'Nenhuma reserva encontrada para o filtro selecionado.'
                      : 'Ainda não h? reservas cadastradas no sistema.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-0 space-y-4">
            {scheduleStats && <ScheduleStatsCard stats={scheduleStats} isLoading={isLoadingStats} />}

            <Card className="p-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate((prev) => subMonths(prev, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="min-w-[120px]">
                    Hoje
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate((prev) => addMonths(prev, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="ml-2 text-lg font-semibold">
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                  <Select value={selectedAccommodationId} onValueChange={setSelectedAccommodationId}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione uma hospedagem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as hospedagens</SelectItem>
                      {accommodations.map((accommodation) => (
                        <SelectItem key={accommodation.id} value={accommodation.id}>
                          {accommodation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Tabs value={calendarViewMode} onValueChange={(value) => setCalendarViewMode(value as 'calendar' | 'list')}>
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

            {isLoadingSchedule ? (
              <Card className="p-12 text-center">
                <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-gray-400" />
                <p className="text-gray-500">Carregando calendário...</p>
              </Card>
            ) : calendarViewMode === 'calendar' ? (
              <ScheduleCalendar
                schedule={schedule}
                currentDate={currentDate}
                onReservationClick={setSelectedScheduleReservation}
              />
            ) : (
              <ScheduleList
                schedule={schedule}
                onViewReservation={setSelectedScheduleReservation}
              />
            )}
          </TabsContent>
        </Tabs>

        {selectedReservation &&
          (isMobile ? (
            <Drawer open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Detalhes da reserva</DrawerTitle>
                  <DrawerDescription>Reserva #{selectedReservation.reservationCode}</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">{reservationDetails}</div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                  <DialogTitle>Detalhes da reserva</DialogTitle>
                  <DialogDescription>Reserva #{selectedReservation.reservationCode}</DialogDescription>
                </DialogHeader>
                {reservationDetails}
              </DialogContent>
            </Dialog>
          ))}

        <Dialog open={!!selectedScheduleReservation} onOpenChange={() => setSelectedScheduleReservation(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Calendário operacional</DialogTitle>
              <DialogDescription>
                Reserva {selectedScheduleReservation?.reservationCode}
              </DialogDescription>
            </DialogHeader>

            {selectedScheduleReservation && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Badge
                    style={{
                      backgroundColor: `${reservationStatusColors[selectedScheduleReservation.status]}20`,
                      color: reservationStatusColors[selectedScheduleReservation.status],
                      borderColor: reservationStatusColors[selectedScheduleReservation.status],
                    }}
                    className="border"
                  >
                    {scheduleStatusLabels[selectedScheduleReservation.status]}
                  </Badge>
                  <Badge variant="outline">{paymentStatusLabels[selectedScheduleReservation.paymentStatus]}</Badge>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">Hóspede</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <DetailLine label="Nome" value={selectedScheduleReservation.guestName} />
                    <DetailLine label="WhatsApp" value={selectedScheduleReservation.guestWhatsApp} />
                    <DetailLine label="Email" value={selectedScheduleReservation.guestEmail || '-'} />
                    <DetailLine label="Telefone" value={selectedScheduleReservation.guestPhone || '-'} />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">Reserva</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <DetailLine label="Check-in" value={format(new Date(selectedScheduleReservation.checkInDate), 'dd/MM/yyyy', { locale: ptBR })} />
                    <DetailLine label="Check-out" value={format(new Date(selectedScheduleReservation.checkOutDate), 'dd/MM/yyyy', { locale: ptBR })} />
                    <DetailLine label="Noites" value={String(selectedScheduleReservation.numberOfNights)} />
                    <DetailLine label="Hóspedes" value={String(selectedScheduleReservation.numberOfGuests)} />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <CreateReservationDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      </div>
    </AdminLayout>
  );
}

function CompactMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
      </CardContent>
    </Card>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export default Reservations;
