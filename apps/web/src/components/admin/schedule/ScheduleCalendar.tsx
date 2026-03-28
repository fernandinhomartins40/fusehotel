import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isWeekend, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AccommodationSchedule, ScheduleReservation } from '@/types/schedule';
import { reservationStatusColors, reservationStatusLabels } from '@/types/schedule';
import { cn } from '@/lib/utils';

interface ScheduleCalendarProps {
  schedule: AccommodationSchedule[];
  currentDate: Date;
  onDateClick?: (date: Date) => void;
  onReservationClick?: (reservation: ScheduleReservation) => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedule,
  currentDate,
  onDateClick,
  onReservationClick,
}) => {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { locale: ptBR });
    const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getReservationsForDay = (date: Date, accommodationId: string) => {
    const accommodation = schedule.find(a => a.id === accommodationId);
    if (!accommodation) return [];

    const dateKey = format(date, 'yyyy-MM-dd');

    return accommodation.reservations.filter(reservation => {
      const checkInDate = reservation.checkInDate.slice(0, 10);
      const checkOutDate = reservation.checkOutDate.slice(0, 10);

      return checkInDate <= dateKey && checkOutDate > dateKey;
    });
  };

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-sm text-gray-700">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>

      {/* Calendar Grid for each accommodation */}
      {schedule.map(accommodation => (
        <Card key={accommodation.id} className="p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-lg">{accommodation.name}</h3>
              <p className="text-sm text-gray-500">
                Capacidade: {accommodation.capacity} pessoa{accommodation.capacity !== 1 ? 's' : ''}
              </p>
            </div>
            <Badge
              variant={accommodation.isAvailable ? 'outline' : 'secondary'}
              className={accommodation.isAvailable ? 'border-green-600 text-green-700' : ''}
            >
              {accommodation.isAvailable ? 'Disponivel para reserva' : 'Bloqueada na agenda'}
            </Badge>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const reservations = getReservationsForDay(day, accommodation.id);
              const hasReservation = reservations.length > 0;
              const inCurrentMonth = isDateInCurrentMonth(day);
              const isCurrentDay = isToday(day);
              const isWeekendDay = isWeekend(day);

              return (
                <div
                  key={index}
                  onClick={() => onDateClick?.(day)}
                  className={cn(
                    'min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md',
                    !inCurrentMonth && 'bg-gray-50 opacity-50',
                    isCurrentDay && 'border-blue-500 border-2',
                    isWeekendDay && 'bg-gray-50',
                    hasReservation && 'border-l-4'
                  )}
                  style={{
                    borderLeftColor: hasReservation
                      ? reservationStatusColors[reservations[0].status]
                      : undefined,
                  }}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={cn(
                        'text-sm font-medium mb-1',
                        isCurrentDay && 'text-blue-600 font-bold',
                        !inCurrentMonth && 'text-gray-400'
                      )}
                    >
                      {format(day, 'd')}
                    </span>

                    {hasReservation && (
                      <div className="flex-1 space-y-1">
                        {reservations.map(reservation => (
                          <div
                            key={reservation.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onReservationClick?.(reservation);
                            }}
                            className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: `${reservationStatusColors[reservation.status]}20`,
                              borderLeft: `3px solid ${reservationStatusColors[reservation.status]}`,
                            }}
                          >
                            <div className="font-semibold truncate" title={reservation.guestName}>
                              {reservation.guestName}
                            </div>
                            <div className="text-[10px] text-gray-600">
                              {reservationStatusLabels[reservation.status]}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {/* Legend */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 text-sm">Legenda de Status</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(reservationStatusLabels).map(([status, label]) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: reservationStatusColors[status as keyof typeof reservationStatusColors],
                }}
              />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
