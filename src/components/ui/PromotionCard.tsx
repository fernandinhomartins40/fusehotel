
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Promotion } from '@/models/promotion';
import { generateSlug } from '@/utils/slugUtils';
import { FavoriteButton } from '@/components/customer/FavoriteButton';

interface PromotionCardProps {
  promotion: Promotion;
  className?: string;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, className }) => {
  // Add safety checks for undefined values
  if (!promotion) {
    console.warn('PromotionCard: promotion is undefined');
    return null;
  }

  const discountPercentage = Math.round(((promotion.originalPrice - promotion.discountedPrice) / promotion.originalPrice) * 100);
  const validUntil = new Date(promotion.validUntil);
  const isExpiringSoon = (validUntil.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000; // 7 days
  
  // Add default values for potentially undefined arrays
  const highlights = promotion.highlights || [];
  
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      <div className="relative">
        <img 
          src={promotion.image} 
          alt={promotion.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <FavoriteButton 
            itemId={promotion.id} 
            itemType="promotion"
            size="sm"
          />
        </div>
        <div className="absolute top-3 left-3">
          <Badge className="bg-red-500 text-white">
            <Tag size={14} className="mr-1" />
            -{discountPercentage}%
          </Badge>
        </div>
        {isExpiringSoon && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-orange-500 text-white">
              <Clock size={14} className="mr-1" />
              Termina em breve
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-[#0466C8] transition-colors">
              {promotion.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Users size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                Até {promotion.maxGuests} hóspedes
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 line-through">
              R$ {promotion.originalPrice.toFixed(2)}
            </div>
            <div className="text-2xl font-bold text-[#0466C8]">
              R$ {promotion.discountedPrice.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">por pessoa</div>
          </div>
        </div>
        <CardDescription className="text-sm">
          {promotion.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={14} />
            <span>Válido até {validUntil.toLocaleDateString('pt-BR')}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {highlights.map((highlight, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 bg-[#0466C8] hover:bg-[#0355A6] text-white"
          asChild
        >
          <Link to={`/promocoes/${generateSlug(promotion.title)}`}>
            Ver Promoção
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
