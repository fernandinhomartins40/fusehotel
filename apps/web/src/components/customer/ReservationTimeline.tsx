
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Reservation, ReservationStatus } from '@/types/reservation';

interface ReservationTimelineProps {
  reservations: Reservation[];
}

export const ReservationTimeline: React.FC<ReservationTimelineProps> = ({ reservations }) => {
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
  );

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
      case 'CHECKED_OUT':
        return 'bg-blue-100 text-blue-800';
      case 'CHECKED_IN':
        return 'bg-purple-100 text-purple-800';
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ReservationStatus) => {
    const statusMap: Record<ReservationStatus, string> = {
      'PENDING': 'Pendente',
      'CONFIRMED': 'Confirmada',
      'CHECKED_IN': 'Check-in feito',
      'CHECKED_OUT': 'Check-out feito',
      'CANCELLED': 'Cancelada',
      'COMPLETED': 'Concluída',
      'NO_SHOW': 'Não compareceu',
    };
    return statusMap[status] || status;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {sortedReservations.map((reservation, index) => (
        <div key={reservation.id} className="relative">
          {/* Timeline line */}
          {index < sortedReservations.length - 1 && (
            <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200 z-0" />
          )}
          
          {/* Timeline dot */}
          <div className="absolute left-4 top-6 w-4 h-4 bg-[#0466C8] rounded-full z-10 border-2 border-white shadow-sm" />
          
          {/* Content */}
          <Card className="ml-12 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {reservation.accommodation?.name || 'Acomodação'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reserva #{reservation.reservationCode}
                  </p>
                </div>

                <Badge className={getStatusColor(reservation.status)}>
                  {getStatusText(reservation.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#0466C8]" />
                  <div>
                    <div className="font-medium">Check-in</div>
                    <div>{new Date(reservation.checkInDate).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#0466C8]" />
                  <div>
                    <div className="font-medium">Check-out</div>
                    <div>{new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#0466C8]" />
                  <div>
                    <div className="font-medium">Detalhes</div>
                    <div>{reservation.numberOfGuests} hóspedes • {reservation.numberOfNights} diárias</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Total da Reserva</span>
                <span className="text-lg font-bold text-[#0466C8]">
                  {formatCurrency(Number(reservation.totalAmount))}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
