
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Phone, MessageCircle } from 'lucide-react';
import { Reservation, ReservationStatus } from '@/types/reservation';
import { toast } from 'sonner';

interface ReservationCardProps {
  reservation: Reservation;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
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

  const handleWhatsAppContact = () => {
    const accommodationName = reservation.accommodation?.name || 'a acomodação';
    const message = `Olá! Gostaria de falar sobre minha reserva #${reservation.reservationCode} para ${accommodationName}.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Redirecionando para WhatsApp...');
  };

  const handleCall = () => {
    window.open('tel:+5511999999999', '_self');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {reservation.accommodation?.name || 'Acomodação'}
          </CardTitle>
          <Badge className={getStatusColor(reservation.status)}>
            {getStatusText(reservation.status)}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          Reserva #{reservation.reservationCode}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <div>
              <div className="font-medium">Check-in</div>
              <div>{new Date(reservation.checkInDate).toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <div>
              <div className="font-medium">Check-out</div>
              <div>{new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{reservation.numberOfGuests} hóspede{reservation.numberOfGuests !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{reservation.numberOfNights} diária{reservation.numberOfNights !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-lg font-bold text-[#0466C8]">
              {formatCurrency(Number(reservation.totalAmount))}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              className="flex-1 flex items-center gap-2"
            >
              <Phone size={16} />
              Ligar
            </Button>

            <Button
              size="sm"
              onClick={handleWhatsAppContact}
              className="flex-1 bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <MessageCircle size={16} />
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
