export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

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
  status: string;
  method: string;
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
  guestEmail: string;
  guestPhone: string;
  guestCpf: string;
  pricePerNight: number;
  subtotal: number;
  extraBedsCost: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  totalAmount: number;
  status: ReservationStatus;
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
