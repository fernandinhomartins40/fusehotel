/**
 * Reservation Types
 *
 * Tipos relacionados a reservas
 */

import { BaseEntity } from './common.types';
import { AccommodationType } from './accommodation.types';

/**
 * Status de reserva
 */
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

/**
 * Status de pagamento
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

/**
 * Métodos de pagamento
 */
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  VOUCHER = 'VOUCHER',
}

/**
 * Informações do hóspede
 */
export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  nationality?: string;
  documentNumber?: string;
}

/**
 * Breakdown de preços
 */
export interface PriceBreakdown {
  pricePerNight: number;
  numberOfNights: number;
  subtotal: number;
  extraBedsCost: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  totalAmount: number;
}

/**
 * Interface completa de reserva
 */
export interface Reservation extends BaseEntity {
  reservationCode: string;
  accommodationId: string;
  roomUnitId?: string | null;
  accommodationName: string;
  accommodationType: AccommodationType;
  userId: string | null;
  userName: string;
  userEmail: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  numberOfExtraBeds: number;
  guestInfo: GuestInfo;
  priceBreakdown: PriceBreakdown;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  specialRequests: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  checkedInAt: string | null;
  checkedOutAt: string | null;
}

/**
 * Dados para criação de reserva
 */
export interface CreateReservationDto {
  accommodationId?: string;
  roomUnitId?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfExtraBeds?: number;
  guestName: string;
  guestWhatsApp: string;
  guestEmail?: string;
  guestPhone?: string;
  guestCpf?: string;
  guestNationality?: string;
  guestDocumentNumber?: string;
  specialRequests?: string;
  promotionId?: string;
  promotionCode?: string;
}

/**
 * Dados para atualização de reserva
 */
export interface UpdateReservationDto {
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  numberOfExtraBeds?: number;
  specialRequests?: string;
}

/**
 * Dados para cancelamento de reserva
 */
export interface CancelReservationDto {
  reason: string;
  requestRefund: boolean;
}

/**
 * Filtros de busca de reservas
 */
export interface ReservationFilters {
  userId?: string;
  accommodationId?: string;
  roomUnitId?: string;
  status?: ReservationStatus | ReservationStatus[];
  paymentStatus?: PaymentStatus;
  checkInDateFrom?: string;
  checkInDateTo?: string;
  checkOutDateFrom?: string;
  checkOutDateTo?: string;
  guestName?: string;
  reservationCode?: string;
}

/**
 * Reserva resumida (para listagens)
 */
export interface ReservationSummary {
  id: string;
  reservationCode: string;
  accommodationName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfNights: number;
  totalAmount: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

/**
 * Estatísticas de reservas
 */
export interface ReservationStats {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  cancelledReservations: number;
  totalRevenue: number;
  averageReservationValue: number;
  occupancyRate: number;
}
