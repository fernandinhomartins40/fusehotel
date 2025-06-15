
import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Reservation } from '@/types/reservation';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'completed' | 'current' | 'upcoming' | 'cancelled';
}

interface ReservationTimelineProps {
  reservation: Reservation;
}

export const ReservationTimeline: React.FC<ReservationTimelineProps> = ({ reservation }) => {
  const generateTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];
    const now = new Date();
    const checkInDate = new Date(reservation.checkIn);
    const checkOutDate = new Date(reservation.checkOut);
    const createdDate = new Date(reservation.createdAt);

    // Reservation created
    events.push({
      date: createdDate.toLocaleDateString('pt-BR'),
      title: 'Reserva Criada',
      description: 'Sua reserva foi criada com sucesso',
      icon: Calendar,
      status: 'completed'
    });

    // Payment confirmation (if confirmed)
    if (reservation.status !== 'pending') {
      events.push({
        date: createdDate.toLocaleDateString('pt-BR'),
        title: 'Pagamento Confirmado',
        description: 'Pagamento processado e reserva confirmada',
        icon: CheckCircle,
        status: reservation.status === 'cancelled' ? 'cancelled' : 'completed'
      });
    }

    // Check-in
    const checkInStatus = reservation.status === 'cancelled' ? 'cancelled' :
                         reservation.status === 'checked-in' || reservation.status === 'checked-out' ? 'completed' :
                         checkInDate <= now ? 'current' : 'upcoming';
    
    events.push({
      date: checkInDate.toLocaleDateString('pt-BR'),
      title: 'Check-in',
      description: `Check-in às 14:00 - ${reservation.roomName}`,
      icon: Clock,
      status: checkInStatus
    });

    // Check-out
    const checkOutStatus = reservation.status === 'cancelled' ? 'cancelled' :
                          reservation.status === 'checked-out' ? 'completed' :
                          checkOutDate <= now ? 'current' : 'upcoming';

    events.push({
      date: checkOutDate.toLocaleDateString('pt-BR'),
      title: 'Check-out',
      description: 'Check-out até 12:00',
      icon: CheckCircle,
      status: checkOutStatus
    });

    return events;
  };

  const events = generateTimelineEvents();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 border-green-600';
      case 'current':
        return 'text-blue-600 border-blue-600';
      case 'upcoming':
        return 'text-gray-400 border-gray-300';
      case 'cancelled':
        return 'text-red-600 border-red-600';
      default:
        return 'text-gray-400 border-gray-300';
    }
  };

  const getIconByStatus = (status: string) => {
    switch (status) {
      case 'cancelled':
        return XCircle;
      case 'completed':
        return CheckCircle;
      case 'current':
        return Clock;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Timeline da Reserva</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {events.map((event, index) => {
          const IconComponent = event.status === 'cancelled' ? getIconByStatus(event.status) : event.icon;
          const colorClass = getStatusColor(event.status);
          
          return (
            <div key={index} className="relative flex items-start space-x-4 pb-6">
              {/* Icon */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-white ${colorClass}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${event.status === 'cancelled' ? 'line-through text-gray-500' : ''}`}>
                    {event.title}
                  </h4>
                  <span className="text-xs text-gray-500">{event.date}</span>
                </div>
                <p className={`text-sm ${event.status === 'cancelled' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
