
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Phone } from 'lucide-react';
import { Reservation } from '@/types/reservation';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: string) => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ 
  reservation, 
  onCancel 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const canCancel = reservation.status === 'confirmed' || reservation.status === 'pending';
  const checkInDate = new Date(reservation.checkIn);
  const checkOutDate = new Date(reservation.checkOut);
  const isUpcoming = checkInDate > new Date();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{reservation.roomName}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Reserva #{reservation.id}
            </p>
          </div>
          <Badge className={getStatusColor(reservation.status)}>
            {getStatusText(reservation.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Room Image */}
        <div className="mb-4">
          <img
            src={reservation.roomImage}
            alt={reservation.roomName}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        {/* Reservation Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>
              Check-in: {checkInDate.toLocaleDateString('pt-BR')} às 14:00
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>
              Check-out: {checkOutDate.toLocaleDateString('pt-BR')} às 12:00
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{reservation.guests} hóspede{reservation.guests > 1 ? 's' : ''}</span>
          </div>

          <div className="pt-2 border-t">
            <p className="text-lg font-semibold">
              Total: R$ {reservation.totalPrice.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {reservation.specialRequests && (
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">
                <strong>Observações:</strong> {reservation.specialRequests}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {reservation.status !== 'cancelled' && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Contato
            </Button>
            
            {canCancel && isUpcoming && onCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(reservation.id)}
              >
                Cancelar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
