
import React from 'react';
import { Link } from 'react-router-dom';
import { Promotion } from '@/types/promotion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { PromotionsConfig, defaultPromotionsConfig } from '@/types/landing-config';
import { hydrateBrandColors } from '@/lib/brand-theme';

interface PromotionCardProps {
  promotion: Promotion;
  config?: PromotionsConfig;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, config }) => {
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  const linkPath = `/promocoes/${promotion.slug}`;

  const themedConfig = hydrateBrandColors(config || defaultPromotionsConfig);

  const borderColor = themedConfig.cardBorderColor || '#E5E5E5';
  const cardBackground = themedConfig.cardBackground || '#FFFFFF';
  const badgeBackground = themedConfig.cardBadgeBackground || 'hsl(var(--primary))';
  const badgeText = themedConfig.cardBadgeText || '#FFFFFF';
  const titleColor = themedConfig.cardTitleColor || '#000000';
  const dateColor = themedConfig.cardDateColor || '#6B7280';
  const descriptionColor = themedConfig.cardDescriptionColor || '#6B7280';
  const featureBadgeBackground = themedConfig.cardFeatureBadgeBackground || '#F3F4F6';
  const featureBadgeText = themedConfig.cardFeatureBadgeText || '#374151';
  const originalPriceColor = themedConfig.cardOriginalPriceColor || '#9CA3AF';
  const discountedPriceColor = themedConfig.cardDiscountedPriceColor || 'hsl(var(--primary))';
  const buttonBackground = themedConfig.cardButtonBackground || 'hsl(var(--primary))';
  const buttonTextColor = themedConfig.cardButtonTextColor || '#FFFFFF';
  const borderRadius = themedConfig.cardBorderRadius || '8px';

  return (
    <Card
      className="h-full flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-lg"
      style={{
        borderColor: borderColor,
        backgroundColor: cardBackground,
        borderRadius: borderRadius,
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={promotion.image || '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png'}
          alt={promotion.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: badgeBackground,
            color: badgeText,
          }}
        >
          {promotion.type === 'PACKAGE' ? 'Pacote' : 'Promoção'}
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold" style={{ color: titleColor }}>
          {promotion.title}
        </h3>
        <div className="flex items-center text-xs" style={{ color: dateColor }}>
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            Válido de {format(new Date(promotion.startDate), 'dd/MM/yyyy')} até {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <p className="text-sm" style={{ color: descriptionColor }}>
          {promotion.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {promotion.features?.slice(0, 3).map((feature, index) => (
            <span
              key={feature.id}
              className="text-xs px-2 py-1 rounded-full flex items-center"
              style={{
                backgroundColor: featureBadgeBackground,
                color: featureBadgeText,
              }}
            >
              <Tag className="h-3 w-3 mr-1" />
              {feature.feature}
            </span>
          ))}
          {promotion.features && promotion.features.length > 3 && (
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: featureBadgeBackground,
                color: featureBadgeText,
              }}
            >
              +{promotion.features.length - 3} mais
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-end pt-2">
        <div className="flex flex-col">
          {promotion.originalPrice && (
            <span
              className="text-xs line-through"
              style={{ color: originalPriceColor }}
            >
              {formatCurrency(Number(promotion.originalPrice))}
            </span>
          )}
          {promotion.discountedPrice && (
            <span
              className="text-lg font-semibold"
              style={{ color: discountedPriceColor }}
            >
              {formatCurrency(Number(promotion.discountedPrice))}
            </span>
          )}
        </div>

        <Link to={linkPath}>
          <Button
            size="sm"
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
          >
            Ver detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
