
import React from 'react';
import { Link } from 'react-router-dom';
import { RoomCard } from '../ui/RoomCard';
import { useAccommodations } from '@/hooks/useAccommodations';
import { useLandingSettings } from '@/hooks/useLanding';
import { defaultAccommodationsConfig } from '@/types/landing-config';
import { Loader2, ArrowRight } from 'lucide-react';
import { hydrateBrandColors } from '@/lib/brand-theme';

const FALLBACK_ACCOMMODATION_IMAGE =
  '/lovable-uploads/2b637749-b3cc-4943-8c7b-195634e4be2d.png';

export const AccommodationsSection: React.FC = () => {
  const { data: accommodations, isLoading, error } = useAccommodations({
    isAvailable: true,
    isFeatured: true
  });

  const { data: settingsData } = useLandingSettings('accommodations');
  const config = hydrateBrandColors(settingsData?.config || defaultAccommodationsConfig);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <section
      id="accommodations"
      className="px-4 md:px-12 lg:px-24 py-20"
      style={{ backgroundColor: config.backgroundColor || '#F9F9F9' }}
    >
      <div className="container mx-auto">
        <div className="text-left mb-12">
          {config.subtitle && (
            <h2
              className="text-[13px] uppercase tracking-[2px] mb-2 font-normal"
              style={{ color: config.subtitleColor || '#676C76' }}
            >
              {config.subtitle}
            </h2>
          )}
          {config.title && (
            <h3
              className="text-[56px] font-bold mb-4 tracking-tight leading-none uppercase"
              style={{ color: config.titleColor || '#1D1D1F' }}
            >
              {config.title}
            </h3>
          )}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            {config.description && (
              <p
                className="text-base leading-relaxed max-w-2xl"
                style={{ color: config.subtitleColor || '#676C76' }}
              >
                {config.description}
              </p>
            )}
            <Link to="/acomodacoes">
              <button
                className="flex items-center gap-2.5 text-white font-medium text-sm px-8 py-4 rounded-full transition-colors duration-300 uppercase tracking-wide"
                style={{ backgroundColor: config.buttonColor || 'hsl(var(--primary))' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.buttonHoverColor || 'hsl(var(--primary-hover))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.buttonColor || 'hsl(var(--primary))'}
              >
                {config.buttonText || 'VER MAIS'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg">Carregando acomodações...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">
              Erro ao carregar acomodações. Por favor, tente novamente mais tarde.
            </p>
          </div>
        ) : accommodations && accommodations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.slice(0, 6).map((accommodation) => (
              <RoomCard
                key={accommodation.id}
                title={accommodation.name}
                description={accommodation.shortDescription || accommodation.description}
                image={
                  accommodation.images && accommodation.images.length > 0
                    ? accommodation.images[0].url
                    : FALLBACK_ACCOMMODATION_IMAGE
                }
                area={accommodation.area ? `${accommodation.area} m²` : 'Área não informada'}
                capacity={`Até ${accommodation.capacity} Pessoa${accommodation.capacity > 1 ? 's' : ''}`}
                price={`${formatCurrency(Number(accommodation.pricePerNight))}/diária`}
                config={config}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhuma acomodação em destaque no momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
