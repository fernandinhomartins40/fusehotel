
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Car, Coffee, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
  maxGuests: number;
  rating?: number;
  reviewCount?: number;
}

interface RoomCardProps {
  room: Room;
  className?: string;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, className }) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wi-fi':
      case 'wifi':
        return <Wifi size={14} />;
      case 'estacionamento':
      case 'parking':
        return <Car size={14} />;
      case 'café da manhã':
      case 'breakfast':
        return <Coffee size={14} />;
      default:
        return null;
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      <div className="relative">
        <img 
          src={room.image} 
          alt={room.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/90 text-gray-800 hover:bg-white">
            <Users size={14} className="mr-1" />
            {room.maxGuests} hóspedes
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-[#0466C8] transition-colors">
              {room.name}
            </CardTitle>
            {room.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{room.rating}</span>
                {room.reviewCount && (
                  <span className="text-sm text-gray-500">({room.reviewCount})</span>
                )}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#0466C8]">
              R$ {room.price.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">por noite</div>
          </div>
        </div>
        <CardDescription className="text-sm">
          {room.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 4).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs flex items-center gap-1">
              {getAmenityIcon(amenity)}
              {amenity}
            </Badge>
          ))}
          {room.amenities.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{room.amenities.length - 4} mais
            </Badge>
          )}
        </div>
        
        <Button 
          className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white"
          asChild
        >
          <Link to={`/acomodacoes/${room.id}`}>
            Ver Detalhes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
