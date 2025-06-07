
import React from 'react';
import { Calendar, Bed, AirVent, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingCardProps {
  price: string;
  capacity: string;
  area: string;
  maxGuests: number;
}

export const BookingCard: React.FC<BookingCardProps> = ({ price, capacity, area, maxGuests }) => {
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
              Check-in
            </Label>
            <Input 
              type="date" 
              id="check-in" 
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="check-out" className="text-sm font-medium text-gray-700 mb-2 block">
              Check-out
            </Label>
            <Input 
              type="date" 
              id="check-out" 
              className="w-full"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="guests" className="text-sm font-medium text-gray-700 mb-2 block">
            Número de hóspedes
          </Label>
          <Select>
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
      </div>
      
      <Button className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white py-3 text-lg font-medium">
        Fazer Reserva
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-3">
        Você será redirecionado para finalizar a reserva
      </p>
    </div>
  );
};
