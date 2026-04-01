
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { AspectRatio } from './aspect-ratio';
import { AccommodationsConfig, defaultAccommodationsConfig } from '@/types/landing-config';
import { hydrateBrandColors } from '@/lib/brand-theme';

interface RoomCardProps {
  title: string;
  description: string;
  image: string;
  area: string;
  capacity: string;
  price: string;
  config?: AccommodationsConfig;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  title,
  description,
  image,
  area,
  capacity,
  price,
  config
}) => {
  // Generate a URL-friendly slug from the title that matches roomsData keys
  const slug = title
    .toLowerCase()
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  const linkPath = `/acomodacoes/${slug}`;

  // Valores padrão das cores
  const themedConfig = hydrateBrandColors(config || defaultAccommodationsConfig);

  const badgeBackground = themedConfig.cardBadgeBackground || 'hsl(var(--primary))';
  const badgeText = themedConfig.cardBadgeText || '#FFFFFF';
  const borderColor = themedConfig.cardBorderColor || '#E5E5E5';
  const cardBackground = themedConfig.cardBackground || '#FFFFFF';
  const titleColor = themedConfig.cardTitleColor || '#1D1D1F';
  const descriptionColor = themedConfig.cardDescriptionColor || '#6B7280';
  const iconColor = themedConfig.cardIconColor || 'hsl(var(--primary))';
  const priceLabelColor = themedConfig.cardPriceLabelColor || '#6B7280';
  const priceValueColor = themedConfig.cardPriceValueColor || '#000000';
  const buttonBorderColor = themedConfig.cardButtonBorderColor || 'hsl(var(--primary))';
  const buttonTextColor = themedConfig.cardButtonTextColor || 'hsl(var(--primary))';
  const buttonHoverBackground = themedConfig.cardButtonHoverBackground || 'hsl(var(--primary-hover))';
  const buttonHoverText = themedConfig.cardButtonHoverText || '#FFFFFF';
  const borderRadius = themedConfig.cardBorderRadius || '8px';

  return (
    <div
      className="w-full border overflow-hidden border-solid"
      style={{
        borderColor: borderColor,
        backgroundColor: cardBackground,
        borderRadius: borderRadius,
      }}
    >
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <div
          className="absolute text-sm font-medium uppercase px-4 py-1.5 top-4 left-4"
          style={{
            backgroundColor: badgeBackground,
            color: badgeText,
          }}
        >
          Café da Manhã Incluso
        </div>
      </div>

      <div className="p-6">
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: titleColor }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: descriptionColor }}
        >
          {description}
        </p>

        <div className="flex gap-6 py-4 border-t border-b" style={{ borderColor: borderColor }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: descriptionColor }}>
            <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.715 9.76624V12.8287C13.7152 12.915 13.6984 13.0004 13.6655 13.0801C13.6326 13.1598 13.5843 13.2323 13.5233 13.2933C13.4623 13.3542 13.3899 13.4026 13.3101 13.4355C13.2304 13.4684 13.145 13.4852 13.0587 13.485H9.99625C9.41137 13.485 9.11879 12.7768 9.5314 12.3639L10.5212 11.374L7.59 8.4428L4.65793 11.3768L5.64859 12.3639C6.06121 12.7768 5.76863 13.485 5.18375 13.485H2.12125C2.03501 13.4852 1.94957 13.4684 1.86986 13.4355C1.79014 13.4026 1.71771 13.3542 1.65673 13.2933C1.59575 13.2323 1.54741 13.1598 1.51451 13.0801C1.48161 13.0004 1.46478 12.915 1.465 12.8287V9.76624C1.465 9.18108 2.17293 8.8885 2.58609 9.30139L3.57566 10.2912L6.50883 7.35999L3.57539 4.426L2.58609 5.41858C2.1732 5.83147 1.465 5.53889 1.465 4.95374V1.89124C1.46478 1.805 1.48161 1.71956 1.51451 1.63985C1.54741 1.56013 1.59575 1.4877 1.65673 1.42672C1.71771 1.36573 1.79014 1.3174 1.86986 1.2845C1.94957 1.2516 2.03501 1.23477 2.12125 1.23499H5.18375C5.76863 1.23499 6.06121 1.94319 5.64859 2.35608L4.65875 3.34592L7.59 6.27717L10.5221 3.34319L9.5314 2.35608C9.11879 1.94319 9.41137 1.23499 9.99625 1.23499H13.0587C13.145 1.23477 13.2304 1.2516 13.3101 1.2845C13.3899 1.3174 13.4623 1.36573 13.5233 1.42672C13.5843 1.4877 13.6326 1.56013 13.6655 1.63985C13.6984 1.71956 13.7152 1.805 13.715 1.89124V4.95374C13.715 5.53889 13.0071 5.83147 12.5939 5.41858L11.6043 4.42874L8.67117 7.35999L11.6046 10.294L12.5939 9.30413C13.0068 8.8885 13.715 9.18108 13.715 9.76624Z" fill={iconColor}/>
            </svg>
            <span>{area}</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: descriptionColor }}>
            <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.4 8.67249C9.61525 8.67249 9.2379 9.10999 7.95001 9.10999C6.66212 9.10999 6.28751 8.67249 5.50001 8.67249C3.47111 8.67249 1.82501 10.3186 1.82501 12.3475V13.0475C1.82501 13.7721 2.4129 14.36 3.13751 14.36H12.7625C13.4871 14.36 14.075 13.7721 14.075 13.0475V12.3475C14.075 10.3186 12.4289 8.67249 10.4 8.67249Z" fill={iconColor}/>
            </svg>
            <span>{capacity}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm" style={{ color: priceLabelColor }}>
            <span>A partir de: </span>
            <span className="font-bold" style={{ color: priceValueColor }}>{price}</span>
          </div>

          <Link to={linkPath}>
            <Button
              variant="outline"
              className="transition-colors"
              style={{
                borderColor: buttonBorderColor,
                color: buttonTextColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = buttonHoverBackground;
                e.currentTarget.style.color = buttonHoverText;
                e.currentTarget.style.borderColor = buttonHoverBackground;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = buttonTextColor;
                e.currentTarget.style.borderColor = buttonBorderColor;
              }}
            >
              Ver detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
