import React from 'react';
import { CalendarDays, Clock3, Mail, MessageCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Reservation, ReservationStatus } from '@/types/reservation';

interface ReservationDetailsProps {
  reservation: Reservation;
  onAdvanceStatus: (reservation: Reservation, status: ReservationStatus) => void;
  onRejectReservation: (reservation: Reservation, reason: string) => void;
  isUpdatingStatus: boolean;
  isRejectingReservation: boolean;
}

const reservationStatusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  CHECKED_IN: 'Check-in realizado',
  CHECKED_OUT: 'Check-out realizado',
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

const paymentMethodLabels: Record<string, string> = {
  CREDIT_CARD: 'Cartao de credito',
  DEBIT_CARD: 'Cartao de debito',
  PIX: 'PIX',
  BANK_TRANSFER: 'Transferencia bancaria',
  CASH: 'Dinheiro',
  VOUCHER: 'Voucher',
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  COMPLETED: 'Pago',
  FAILED: 'Falhou',
  REFUNDED: 'Reembolsado',
  PARTIALLY_REFUNDED: 'Parcialmente reembolsado',
};

const nextStatusOptions: Partial<Record<ReservationStatus, ReservationStatus[]>> = {
  CONFIRMED: ['CHECKED_IN', 'NO_SHOW'],
  CHECKED_IN: ['CHECKED_OUT'],
  CHECKED_OUT: ['COMPLETED'],
};

export function ReservationDetails({
  reservation,
  onAdvanceStatus,
  onRejectReservation,
  isUpdatingStatus,
  isRejectingReservation,
}: ReservationDetailsProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<ReservationStatus | ''>('');
  const [rejectionReason, setRejectionReason] = React.useState('');

  React.useEffect(() => {
    setSelectedStatus('');
    setRejectionReason('');
  }, [reservation.id, reservation.status]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const availableTransitions = nextStatusOptions[reservation.status] || [];

  const handleReject = () => {
    if (rejectionReason.trim().length < 10) {
      return;
    }

    onRejectReservation(reservation, rejectionReason.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Código da reserva</p>
          <p className="font-mono text-sm">{reservation.reservationCode}</p>
        </div>
        <Badge className={reservationStatusClassNames[reservation.status]}>
          {reservationStatusLabels[reservation.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Hóspede</h3>
          <div className="mt-2 space-y-2">
            <p className="font-medium">{reservation.guestName}</p>
            <p className="text-sm flex items-center gap-2">
              <Mail size={14} />
              {reservation.guestEmail || 'Email nao informado'}
            </p>
            <p className="text-sm flex items-center gap-2">
              <MessageCircle size={14} />
              {reservation.guestWhatsApp}
            </p>
            {reservation.guestPhone && <p className="text-sm">{reservation.guestPhone}</p>}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Acomodação</h3>
          <div className="mt-2 space-y-2">
            <p className="font-medium">{reservation.accommodation?.name || 'Nao informada'}</p>
            <p className="text-sm text-gray-600">{reservation.accommodation?.type || ''}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Periodo</h3>
          <div className="mt-2 space-y-2 text-sm">
            <p className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-gray-600">
                <CalendarDays size={14} />
                Check-in
              </span>
              <span className="font-medium">{formatDate(reservation.checkInDate)}</span>
            </p>
            <p className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-gray-600">
                <CalendarDays size={14} />
                Check-out
              </span>
              <span className="font-medium">{formatDate(reservation.checkOutDate)}</span>
            </p>
            <p className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-gray-600">
                <Clock3 size={14} />
                Noites
              </span>
              <span className="font-medium">{reservation.numberOfNights}</span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Valores</h3>
          <div className="mt-2 space-y-2 text-sm">
            <p className="flex items-center justify-between gap-3">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(Number(reservation.subtotal))}</span>
            </p>
            <p className="flex items-center justify-between gap-3">
              <span>Camas extras</span>
              <span className="font-medium">
                {formatCurrency(Number(reservation.extraBedsCost))}
              </span>
            </p>
            <p className="flex items-center justify-between gap-3">
              <span>Taxas</span>
              <span className="font-medium">
                {formatCurrency(Number(reservation.serviceFee) + Number(reservation.taxes))}
              </span>
            </p>
            {Number(reservation.discount) > 0 && (
              <p className="flex items-center justify-between gap-3 text-green-700">
                <span>Desconto</span>
                <span className="font-medium">- {formatCurrency(Number(reservation.discount))}</span>
              </p>
            )}
            <p className="flex items-center justify-between gap-3 text-base">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{formatCurrency(Number(reservation.totalAmount))}</span>
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Pagamento</h3>
          <div className="mt-2 space-y-2 text-sm">
            <p className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <Wallet size={14} />
                Status
              </span>
              <span className="font-medium">
                {paymentStatusLabels[reservation.paymentStatus] || reservation.paymentStatus}
              </span>
            </p>
            <p className="flex items-center justify-between gap-3">
              <span>Metodo</span>
              <span className="font-medium">
                {reservation.paymentMethod
                  ? paymentMethodLabels[reservation.paymentMethod] || reservation.paymentMethod
                  : 'Nao definido'}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Registro</h3>
          <div className="mt-2 space-y-2 text-sm">
            <p className="flex items-center justify-between gap-3">
              <span>Criada em</span>
              <span className="font-medium">{formatDateTime(reservation.createdAt)}</span>
            </p>
            {reservation.checkedInAt && (
              <p className="flex items-center justify-between gap-3">
                <span>Check-in em</span>
                <span className="font-medium">{formatDateTime(reservation.checkedInAt)}</span>
              </p>
            )}
            {reservation.checkedOutAt && (
              <p className="flex items-center justify-between gap-3">
                <span>Check-out em</span>
                <span className="font-medium">{formatDateTime(reservation.checkedOutAt)}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {reservation.specialRequests && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Observacoes</h3>
            <p className="mt-2 text-sm whitespace-pre-line">{reservation.specialRequests}</p>
          </div>
        </>
      )}

      {reservation.cancellationReason && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Motivo da rejeicao</h3>
            <p className="mt-2 text-sm whitespace-pre-line">{reservation.cancellationReason}</p>
          </div>
        </>
      )}

      {reservation.status === 'PENDING' && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="font-medium text-green-800">Aceite da solicitacao</p>
              <p className="text-sm text-green-700 mt-1">
                Ao aceitar, a reserva continua bloqueando a acomodacao e a confirmacao sera aberta no WhatsApp do cliente.
              </p>
              <Button
                className="mt-4"
                onClick={() => onAdvanceStatus(reservation, 'CONFIRMED')}
                disabled={isUpdatingStatus || isRejectingReservation}
              >
                {isUpdatingStatus ? 'Aceitando...' : 'Aceitar solicitacao'}
              </Button>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
              <div>
                <p className="font-medium text-red-800">Rejeicao da solicitacao</p>
                <p className="text-sm text-red-700 mt-1">
                  Informe o motivo. A reserva sera cancelada e a mensagem para o cliente sera aberta no WhatsApp.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Motivo da rejeicao</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Explique por que a solicitacao nao pode ser atendida."
                  rows={4}
                />
              </div>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={
                  isRejectingReservation ||
                  isUpdatingStatus ||
                  rejectionReason.trim().length < 10
                }
              >
                {isRejectingReservation ? 'Rejeitando...' : 'Rejeitar solicitacao'}
              </Button>
            </div>
          </div>
        </>
      )}

      {reservation.status !== 'PENDING' && availableTransitions.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label>Atualizar etapa da reserva</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as ReservationStatus)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione a proxima etapa" />
                </SelectTrigger>
                <SelectContent>
                  {availableTransitions.map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {reservationStatusLabels[statusOption]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => selectedStatus && onAdvanceStatus(reservation, selectedStatus)}
                disabled={!selectedStatus || isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Salvando...' : 'Salvar etapa'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

