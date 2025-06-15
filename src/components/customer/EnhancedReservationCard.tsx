
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Phone, Edit, X, Copy, Download, Plus } from 'lucide-react';
import { Reservation } from '@/types/reservation';
import { RESERVATION_STATUS_MAP } from '@/types/reservationStatus';
import { getAvailableActions } from '@/utils/reservationActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EnhancedReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: string) => void;
  onEdit?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDownloadVoucher?: (id: string) => void;
  onRequestServices?: (id: string) => void;
  onContact?: (id: string) => void;
}

const iconMap = {
  Phone,
  Edit,
  X,
  Copy,
  Download,
  Plus,
  Calendar
};

export const EnhancedReservationCard: React.FC<EnhancedReservationCardProps> = ({ 
  reservation,
  onCancel,
  onEdit,
  onReschedule,
  onDuplicate,
  onDownloadVoucher,
  onRequestServices,
  onContact
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const statusInfo = RESERVATION_STATUS_MAP[reservation.status];
  const availableActions = getAvailableActions(reservation);

  const checkInDate = new Date(reservation.checkIn);
  const checkOutDate = new Date(reservation.checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'cancel':
        setShowCancelDialog(true);
        break;
      case 'edit':
        onEdit?.(reservation.id);
        break;
      case 'reschedule':
        onReschedule?.(reservation.id);
        break;
      case 'duplicate':
        onDuplicate?.(reservation.id);
        break;
      case 'voucher':
        onDownloadVoucher?.(reservation.id);
        break;
      case 'services':
        onRequestServices?.(reservation.id);
        break;
      case 'contact':
        onContact?.(reservation.id);
        break;
    }
  };

  const handleCancelConfirm = () => {
    onCancel?.(reservation.id);
    setShowCancelDialog(false);
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{reservation.roomName}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Reserva #{reservation.id}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${statusInfo.color} ${statusInfo.bgColor}`}>
              {statusInfo.label}
            </Badge>
            <p className="text-xs text-gray-500 text-right max-w-32">
              {statusInfo.description}
            </p>
          </div>
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
              {checkInDate.toLocaleDateString('pt-BR')} - {checkOutDate.toLocaleDateString('pt-BR')}
            </span>
            <span className="text-gray-400">({nights} noite{nights > 1 ? 's' : ''})</span>
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
        {availableActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {availableActions.map((action) => {
              const IconComponent = iconMap[action.icon as keyof typeof iconMap];
              
              return (
                <Button
                  key={action.id}
                  variant={action.variant}
                  size="sm"
                  onClick={() => handleAction(action.id)}
                  disabled={action.disabled}
                  title={action.tooltip}
                  className="flex items-center gap-1"
                >
                  {IconComponent && <IconComponent className="h-3 w-3" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
                Verifique as políticas de cancelamento antes de confirmar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Manter Reserva</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelConfirm} className="bg-red-600 hover:bg-red-700">
                Confirmar Cancelamento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
