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

export type PaymentMethod =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'PIX'
  | 'BANK_TRANSFER'
  | 'CASH'
  | 'VOUCHER';

export interface AccommodationImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

export interface ReservationAccommodation {
  id: string;
  name: string;
  type: string;
  images: AccommodationImage[];
}

export interface ReservationUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
}

export interface Reservation {
  id: string;
  reservationCode: string;
  accommodationId: string;
  userId: string | null;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  numberOfExtraBeds: number;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string | null;
  guestWhatsApp: string;
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
  specialRequests: string | null;
  checkedInAt: string | null;
  checkedOutAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  accommodation?: ReservationAccommodation;
  user?: ReservationUser;
  payments?: Payment[];
}
