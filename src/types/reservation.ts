
export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out' | 'no-show';
  createdAt: string;
  specialRequests?: string;
}
