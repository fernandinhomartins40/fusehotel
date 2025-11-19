
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface ReservationDetailsProps {
  reservation: any;
  onUpdateStatus: (id: string, status: string) => void;
}

export function ReservationDetails({ reservation, onUpdateStatus }: ReservationDetailsProps) {
  const [status, setStatus] = React.useState(reservation.status);
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
  };
  
  const handleSave = () => {
    onUpdateStatus(reservation.id, status);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Calculate number of nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Payment method translation
  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'bank_transfer': 'Transferência Bancária',
      'pix': 'PIX',
      'cash': 'Dinheiro',
    };
    return methodMap[method] || method;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Dados do Hóspede</h3>
          <div className="mt-2 space-y-2">
            <p className="font-medium">{reservation.guestName}</p>
            <p className="text-sm">{reservation.guestEmail}</p>
            <p className="text-sm">{reservation.guestPhone}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Acomodação</h3>
          <div className="mt-2">
            <p className="font-medium">{reservation.accommodation.name}</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Datas</h3>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <p className="text-sm">Check-in:</p>
              <p className="text-sm font-medium">{formatDate(reservation.checkInDate)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">Check-out:</p>
              <p className="text-sm font-medium">{formatDate(reservation.checkOutDate)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">Noites:</p>
              <p className="text-sm font-medium">
                {calculateNights(reservation.checkInDate, reservation.checkOutDate)}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Hóspedes</h3>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <p className="text-sm">Adultos:</p>
              <p className="text-sm font-medium">{reservation.adults}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">Crianças:</p>
              <p className="text-sm font-medium">{reservation.children}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">Total:</p>
              <p className="text-sm font-medium">{reservation.adults + reservation.children}</p>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Pagamento</h3>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <p className="text-sm">Método:</p>
              <p className="text-sm font-medium">{getPaymentMethodLabel(reservation.paymentMethod)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">Valor total:</p>
              <p className="text-sm font-medium">{formatCurrency(reservation.totalPrice)}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Status da Reserva</h3>
          <div className="mt-2">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="checked_in">Check-in feito</SelectItem>
                <SelectItem value="checked_out">Check-out feito</SelectItem>
                <SelectItem value="canceled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {reservation.specialRequests && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Solicitações Especiais</h3>
            <p className="mt-2 text-sm">{reservation.specialRequests}</p>
          </div>
        </>
      )}
      
      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={handleSave}>
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
