import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Filter, Loader2, CalendarPlus } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ReservationDetails } from '@/components/admin/ReservationDetails';
import { CreateReservationDialog } from '@/components/admin/reservations/CreateReservationDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { useAdminCancelReservation, useAdminReservations, useUpdateReservationStatus } from '@/hooks/useAdminReservations';
import { useIsMobile } from '@/hooks/use-mobile';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import type { Reservation, ReservationStatus } from '@/types/reservation';

const reservationStatusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  CHECKED_IN: 'Check-in feito',
  CHECKED_OUT: 'Check-out feito',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Concluida',
  NO_SHOW: 'Nao compareceu',
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
    return `Ola ${reservation.guestName}, sua solicitacao de reserva ${reservation.reservationCode} para ${reservation.accommodation?.name || 'a acomodacao selecionada'} foi aceita pelo hotel.

Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Status: Confirmada

Se precisar de mais alguma informacao, responda esta conversa.`;
  }

  return `Ola ${reservation.guestName}, sua solicitacao de reserva ${reservation.reservationCode} nao foi aprovada pelo hotel.

Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Motivo: ${reason || 'Indisponibilidade para o periodo solicitado.'}

Se desejar, fale conosco para buscarmos uma nova opcao de hospedagem.`;
}

export function Reservations() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const isMobile = useIsMobile();

  const { data: reservations, isLoading, error } = useAdminReservations(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );
  const updateStatusMutation = useUpdateReservationStatus();
  const cancelReservationMutation = useAdminCancelReservation();

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
            openCustomerWhatsApp(
              updatedReservation,
              buildCustomerMessage(updatedReservation, 'accepted')
            );
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
          openCustomerWhatsApp(
            updatedReservation,
            buildCustomerMessage(updatedReservation, 'rejected', reason)
          );
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
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Erro ao carregar reservas</h2>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Reservas</h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? 'Carregando...' : `${reservations?.length || 0} reservas encontradas`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="lg">
              <Link to="/admin/schedule">Ver calendário</Link>
            </Button>

            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              <CalendarPlus className="mr-2 h-5 w-5" />
              Nova Reserva
            </Button>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                  <SelectItem value="CHECKED_IN">Check-in feito</SelectItem>
                  <SelectItem value="CHECKED_OUT">Check-out feito</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                  <SelectItem value="COMPLETED">Concluida</SelectItem>
                  <SelectItem value="NO_SHOW">Nao compareceu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-lg">Carregando reservas...</span>
            </CardContent>
          </Card>
        ) : reservations && reservations.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codigo</TableHead>
                    <TableHead>Hï¿½spede</TableHead>
                    <TableHead>Acomodaï¿½ï¿½o</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation: Reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-mono text-sm">{reservation.reservationCode}</TableCell>
                      <TableCell className="font-medium">{reservation.guestName}</TableCell>
                      <TableCell>{reservation.accommodation?.name || 'N/A'}</TableCell>
                      <TableCell>{formatDate(reservation.checkInDate)}</TableCell>
                      <TableCell>{formatDate(reservation.checkOutDate)}</TableCell>
                      <TableCell>{formatCurrency(Number(reservation.totalAmount))}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${reservationStatusClassNames[reservation.status]}`}
                        >
                          {reservationStatusLabels[reservation.status]}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReservation(reservation)}
                        >
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
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
              <p className="text-gray-600">
                {statusFilter !== 'all'
                  ? 'Nenhuma reserva encontrada para o filtro selecionado.'
                  : 'Ainda nao ha reservas cadastradas no sistema.'}
              </p>
            </CardContent>
          </Card>
        )}

        {selectedReservation &&
          (isMobile ? (
            <Drawer open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Detalhes da Reserva</DrawerTitle>
                  <DrawerDescription>Reserva #{selectedReservation.reservationCode}</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">{reservationDetails}</div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                  <DialogTitle>Detalhes da Reserva</DialogTitle>
                  <DialogDescription>Reserva #{selectedReservation.reservationCode}</DialogDescription>
                </DialogHeader>
                {reservationDetails}
              </DialogContent>
            </Dialog>
          ))}

        <CreateReservationDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      </div>
    </AdminLayout>
  );
}

export default Reservations;


