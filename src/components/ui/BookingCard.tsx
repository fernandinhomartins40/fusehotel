
import React, { useState } from 'react';
import { Calendar, Bed, AirVent, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

interface BookingCardProps {
  price: string;
  capacity: string;
  area: string;
  maxGuests: number;
  roomTitle?: string;
}

export const BookingCard: React.FC<BookingCardProps> = ({ 
  price, 
  capacity, 
  area, 
  maxGuests,
  roomTitle = "esta suíte"
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get today's date for minimum date validation
  const today = new Date().toISOString().split('T')[0];

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = parseFloat(price.replace('R$', '').replace('/diária', '').replace(',', '.'));
    return nights > 0 ? (nights * pricePerNight).toFixed(2).replace('.', ',') : '0,00';
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !guests) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error('A data de check-out deve ser posterior à data de check-in.');
      return;
    }

    setIsLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Reserva iniciada para ${roomTitle}! Você será redirecionado para finalizar o pagamento.`);
      
      // Here you would typically redirect to a payment page or booking confirmation
      console.log('Booking details:', {
        roomTitle,
        checkIn,
        checkOut,
        guests,
        nights: calculateNights(),
        total: calculateTotal()
      });
    }, 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sticky top-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-[#0466C8] text-white text-sm font-medium px-3 py-1.5 rounded-full mb-3">
          <Calendar size={16} />
          Café da Manhã Incluso
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Reserva Online</h3>
      </div>
      
      {/* Room Info */}
      <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} className="text-[#0466C8]" />
            <span className="text-sm">A partir de:</span>
          </div>
          <span className="font-bold text-lg text-[#0466C8]">{price}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={18} className="text-[#0466C8]" />
          <span className="text-sm">{capacity}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <AirVent size={18} className="text-[#0466C8]" />
          <span className="text-sm">{area}</span>
        </div>
      </div>
      
      {/* Booking Form */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="check-in" className="text-sm font-medium text-gray-700 mb-2 block">
              Check-in *
            </Label>
            <Input 
              type="date" 
              id="check-in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              className="w-full"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="check-out" className="text-sm font-medium text-gray-700 mb-2 block">
              Check-out *
            </Label>
            <Input 
              type="date" 
              id="check-out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              className="w-full"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="guests" className="text-sm font-medium text-gray-700 mb-2 block">
            Número de hóspedes *
          </Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'pessoa' : 'pessoas'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Booking Summary */}
        {checkIn && checkOut && calculateNights() > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{calculateNights()} {calculateNights() === 1 ? 'diária' : 'diárias'}</span>
              <span>R${calculateTotal()}</span>
            </div>
            <div className="flex justify-between font-bold text-[#0466C8]">
              <span>Total</span>
              <span>R${calculateTotal()}</span>
            </div>
          </div>
        )}
      </div>
      
      <Button 
        className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleBooking}
        disabled={isLoading}
      >
        {isLoading ? 'Processando...' : 'Fazer Reserva'}
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-3">
        * Campos obrigatórios. Você será redirecionado para finalizar a reserva.
      </p>
    </div>
  );
};
