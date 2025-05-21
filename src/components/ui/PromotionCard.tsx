
import React from 'react';
import { Promotion } from '@/models/promotion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface PromotionCardProps {
  promotion: Promotion;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={promotion.image}
          alt={promotion.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
          {promotion.type === 'package' ? 'Pacote' : 'Promoção'}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{promotion.title}</h3>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            Válido de {format(new Date(promotion.startDate), 'dd/MM/yyyy')} até {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground">
          {promotion.shortDescription}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {promotion.features.map((feature, index) => (
            <span
              key={index}
              className="bg-muted text-xs px-2 py-1 rounded-full flex items-center"
            >
              <Tag className="h-3 w-3 mr-1" />
              {feature}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-end pt-2">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground line-through">
            {formatCurrency(promotion.originalPrice)}
          </span>
          <span className="text-lg font-semibold text-primary">
            {formatCurrency(promotion.discountedPrice)}
          </span>
        </div>
        
        <Button size="sm">
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};
