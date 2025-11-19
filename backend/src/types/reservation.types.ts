import {
  ReservationStatus,
  PaymentStatus,
  PaymentMethod,
  AccommodationType,
} from '@prisma/client';

/**
 * Reservation Types
 */

export interface CreateReservationInput {
  accommodationId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCpf?: string;
  numberOfExtraBeds?: number;
  specialRequests?: string;
  paymentMethod?: PaymentMethod;
}

export interface UpdateReservationInput {
  checkInDate?: Date;
  checkOutDate?: Date;
  numberOfGuests?: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestCpf?: string;
  numberOfExtraBeds?: number;
  specialRequests?: string;
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

export interface ReservationDetails {
  id: string;
  reservationCode: string;
  accommodation: {
    id: string;
    name: string;
    type: AccommodationType;
    image: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCpf: string | null;
  pricePerNight: number;
  subtotal: number;
  extraBedsCost: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  totalAmount: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  numberOfExtraBeds: number;
  specialRequests: string | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservationListQuery {
  page?: number;
  limit?: number;
  userId?: string;
  accommodationId?: string;
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'checkInDate' | 'createdAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface CancelReservationInput {
  reason?: string;
}

export interface UpdateReservationStatusInput {
  status: ReservationStatus;
}

export interface ReservationCalculation {
  numberOfNights: number;
  pricePerNight: number;
  subtotal: number;
  extraBedsCost: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  totalAmount: number;
}

export interface ProcessPaymentInput {
  reservationId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  gateway?: string;
}

export interface PaymentDetails {
  id: string;
  reservationId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  gateway: string | null;
  paidAt: Date | null;
  refundedAt: Date | null;
  createdAt: Date;
}
