import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Phone, CreditCard, Eye } from 'lucide-react';
import type { AccommodationSchedule, ScheduleReservation } from '@/types/schedule';
import {
  reservationStatusColors,
  reservationStatusLabels,
  paymentStatusLabels,
  accommodationTypeLabels,
} from '@/types/schedule';

interface ScheduleListProps {
  schedule: AccommodationSchedule[];
  onViewReservation?: (reservation: ScheduleReservation) => void;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedule,
  onViewReservation,
}) => {
  // Flatten and sort all reservations by check-in date
  const allReservations = schedule
    .flatMap(accommodation =>
      accommodation.reservations.map(reservation => ({
        ...reservation,
        accommodationName: accommodation.name,
        accommodationType: accommodation.type,
      }))
    )
    .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());

  if (allReservations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
        <p className="text-gray-500">
          Não há reservas no período selecionado.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {allReservations.map(reservation => (
        <Card key={reservation.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{reservation.guestName}</h3>
                    <Badge
                      style={{
                        backgroundColor: `${reservationStatusColors[reservation.status]}20`,
                        color: reservationStatusColors[reservation.status],
                        borderColor: reservationStatusColors[reservation.status],
                      }}
                      className="border"
                    >
                      {reservationStatusLabels[reservation.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Código: <span className="font-mono">{reservation.reservationCode}</span>
                  </p>
                </div>
              </div>

              {/* Accommodation Info */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{reservation.accommodationName}</span>
                  <span className="text-gray-500">
                    ({accommodationTypeLabels[reservation.accommodationType]})
                  </span>
                </div>
              </div>

              {/* Dates and Guest Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Check-in</p>
                  <p className="font-medium">
                    {format(new Date(reservation.checkInDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Check-out</p>
                  <p className="font-medium">
                    {format(new Date(reservation.checkOutDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Hóspedes</p>
                    <p className="font-medium">{reservation.numberOfGuests}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Noites</p>
                    <p className="font-medium">{reservation.numberOfNights}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{reservation.guestWhatsApp}</span>
                </div>
                {reservation.guestPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{reservation.guestPhone}</span>
                  </div>
                )}
              </div>

              {/* Payment Status */}
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Pagamento: {paymentStatusLabels[reservation.paymentStatus]}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewReservation?.(reservation)}
              className="ml-4"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
