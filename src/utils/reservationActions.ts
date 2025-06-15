
import { Reservation } from '@/types/reservation';

export interface ReservationAction {
  id: string;
  label: string;
  icon: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  disabled?: boolean;
  tooltip?: string;
}

export const getAvailableActions = (reservation: Reservation): ReservationAction[] => {
  const actions: ReservationAction[] = [];
  const checkInDate = new Date(reservation.checkIn);
  const checkOutDate = new Date(reservation.checkOut);
  const now = new Date();
  const isUpcoming = checkInDate > now;
  const isPast = checkOutDate < now;

  // Contact action - always available unless cancelled
  if (reservation.status !== 'cancelled') {
    actions.push({
      id: 'contact',
      label: 'Contato',
      icon: 'Phone',
      variant: 'outline'
    });
  }

  // Cancel action - only for confirmed/pending upcoming reservations
  if ((reservation.status === 'confirmed' || reservation.status === 'pending') && isUpcoming) {
    const daysDiff = Math.ceil((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    actions.push({
      id: 'cancel',
      label: 'Cancelar',
      icon: 'X',
      variant: 'destructive',
      disabled: daysDiff < 2,
      tooltip: daysDiff < 2 ? 'Cancelamento não permitido com menos de 48h de antecedência' : undefined
    });
  }

  // Edit action - only for confirmed upcoming reservations
  if (reservation.status === 'confirmed' && isUpcoming) {
    const daysDiff = Math.ceil((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    actions.push({
      id: 'edit',
      label: 'Editar',
      icon: 'Edit',
      variant: 'outline',
      disabled: daysDiff < 7,
      tooltip: daysDiff < 7 ? 'Edição não permitida com menos de 7 dias de antecedência' : undefined
    });
  }

  // Reschedule action - for confirmed reservations
  if (reservation.status === 'confirmed' && isUpcoming) {
    actions.push({
      id: 'reschedule',
      label: 'Reagendar',
      icon: 'Calendar',
      variant: 'outline'
    });
  }

  // Duplicate action - always available
  actions.push({
    id: 'duplicate',
    label: 'Duplicar',
    icon: 'Copy',
    variant: 'outline'
  });

  // Download voucher - for confirmed reservations
  if (reservation.status === 'confirmed' || reservation.status === 'checked-in') {
    actions.push({
      id: 'voucher',
      label: 'Baixar Voucher',
      icon: 'Download',
      variant: 'outline'
    });
  }

  // Request services - for upcoming confirmed reservations
  if (reservation.status === 'confirmed' && isUpcoming) {
    actions.push({
      id: 'services',
      label: 'Solicitar Serviços',
      icon: 'Plus',
      variant: 'secondary'
    });
  }

  return actions;
};

export const canPerformAction = (action: string, reservation: Reservation): boolean => {
  const actions = getAvailableActions(reservation);
  const actionItem = actions.find(a => a.id === action);
  return actionItem ? !actionItem.disabled : false;
};
