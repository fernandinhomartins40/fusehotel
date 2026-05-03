
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
      className="page-section"
      style={{ backgroundColor: config.backgroundColor || '#FFFFFF' }}
    >
      <div className="page-container">
        {/* Section header with line accent */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="line-accent" style={{ backgroundColor: config.subtitleColor || undefined }} />
            {config.subtitle && (
              <span
                className="page-kicker"
                style={{ color: config.subtitleColor || '#676C76' }}
              >
                {config.subtitle}
              </span>
            )}
            {config.title && (
              <h2
                className="section-title"
                style={{ color: config.titleColor || '#1D1D1F' }}
              >
                {config.title}
              </h2>
            )}
            {config.description && (
              <p
                className="text-base leading-relaxed mt-4"
                style={{ color: config.subtitleColor || '#676C76' }}
              >
                {config.description}
              </p>
            )}
          </div>
          <Link to="/acomodacoes" className="shrink-0">
            <button
              className="group flex items-center gap-3 text-white font-medium text-sm px-8 py-4 rounded-full transition-all duration-500 uppercase tracking-[1px] hover:shadow-xl hover:scale-[1.03]"
              style={{ backgroundColor: config.buttonColor || 'hsl(var(--primary))' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.buttonHoverColor || 'hsl(var(--primary-hover))'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.buttonColor || 'hsl(var(--primary))'}
            >
              {config.buttonText || 'VER MAIS'}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg text-muted-foreground">Carregando acomodações...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">
              Erro ao carregar acomodações. Por favor, tente novamente mais tarde.
            </p>
          </div>
        ) : accommodations && accommodations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {accommodations.slice(0, 6).map((accommodation) => (
              <RoomCard
                key={accommodation.id}
                slug={accommodation.slug}
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
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              Nenhuma acomodação em destaque no momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
