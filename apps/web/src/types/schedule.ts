export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type AccommodationType =
  | 'ROOM'
  | 'SUITE'
  | 'CHALET'
  | 'VILLA'
  | 'APARTMENT';

export interface ScheduleReservation {
  id: string;
  reservationCode: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string | null;
  guestWhatsApp: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
}

export interface DayAvailability {
  date: string;
  isAvailable: boolean;
  reservationId?: string;
}

export interface AccommodationSchedule {
  id: string;
  name: string;
  type: AccommodationType;
  capacity: number;
  isAvailable: boolean;
  reservations: ScheduleReservation[];
  availability: DayAvailability[];
}

export interface ScheduleStats {
  totalAccommodations: number;
  totalReservations: number;
  activeReservations: number;
  occupancyRate: number;
  availableAccommodations: number;
}

export interface ScheduleQueryParams {
  startDate: string;
  endDate: string;
  accommodationId?: string;
}

export interface AvailabilityCheckResult {
  accommodationId: string;
  startDate: string;
  endDate: string;
  isAvailable: boolean;
}

// UI-specific types
export type ViewMode = 'month' | 'week' | 'list';

export interface CalendarDay {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  reservations: ScheduleReservation[];
}

// Status color mappings
export const reservationStatusColors: Record<ReservationStatus, string> = {
  PENDING: '#F59E0B', // amber
  CONFIRMED: '#3B82F6', // blue
  CHECKED_IN: '#10B981', // green
  CHECKED_OUT: '#6B7280', // gray
  CANCELLED: '#EF4444', // red
  COMPLETED: '#8B5CF6', // purple
  NO_SHOW: '#DC2626', // dark red
};

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  CHECKED_IN: 'Check-in',
  CHECKED_OUT: 'Check-out',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Concluída',
  NO_SHOW: 'Não Compareceu',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  COMPLETED: 'Pago',
  FAILED: 'Falhou',
  REFUNDED: 'Reembolsado',
  PARTIALLY_REFUNDED: 'Parcialmente Reembolsado',
};

export const accommodationTypeLabels: Record<AccommodationType, string> = {
  ROOM: 'Quarto',
  SUITE: 'Suíte',
  CHALET: 'Chalé',
  VILLA: 'Villa',
  APARTMENT: 'Apartamento',
};
