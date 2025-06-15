
export interface Reservation {
  id: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
}
