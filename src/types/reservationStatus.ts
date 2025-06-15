
export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out' | 'no-show';

export interface ReservationStatusInfo {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

export const RESERVATION_STATUS_MAP: Record<ReservationStatus, ReservationStatusInfo> = {
  confirmed: {
    label: 'Confirmada',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    description: 'Reserva confirmada e aguardando check-in'
  },
  pending: {
    label: 'Pendente',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
    description: 'Aguardando confirmação de pagamento'
  },
  cancelled: {
    label: 'Cancelada',
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    description: 'Reserva cancelada'
  },
  'checked-in': {
    label: 'Check-in Realizado',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    description: 'Hóspede já realizou check-in'
  },
  'checked-out': {
    label: 'Check-out Realizado',
    color: 'text-gray-800',
    bgColor: 'bg-gray-100',
    description: 'Hospedagem finalizada'
  },
  'no-show': {
    label: 'Não Compareceu',
    color: 'text-orange-800',
    bgColor: 'bg-orange-100',
    description: 'Hóspede não compareceu na data prevista'
  }
};
