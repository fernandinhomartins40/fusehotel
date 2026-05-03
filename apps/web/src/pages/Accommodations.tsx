import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoomCard } from '@/components/ui/RoomCard';
import { useAccommodations } from '@/hooks/useAccommodations';
import { Loader2 } from 'lucide-react';

const FALLBACK_ACCOMMODATION_IMAGE =
  '/lovable-uploads/2b637749-b3cc-4943-8c7b-195634e4be2d.png';

const Accommodations = () => {
  const { data: accommodations, isLoading, error } = useAccommodations({ isAvailable: true });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0A0A0A] text-white" style={{ minHeight: '400px', display: 'flex', alignItems: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
          <div className="page-container text-center relative py-20 md:py-28">
            <div className="line-accent mx-auto mb-6" />
            <span className="page-kicker text-white/60">Conheça nossos quartos</span>
            <h1 className="section-title text-white mb-5">
              Acomodações
            </h1>
            <p className="text-base md:text-lg leading-relaxed mx-auto max-w-2xl text-white/80">
              Descubra nossas acomodações luxuosas com vista para o mar,
              cada uma projetada para oferecer o máximo conforto e elegância.
            </p>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="page-section bg-white">
          <div className="page-container">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-lg text-muted-foreground">Carregando acomodações...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 text-lg">
                  Erro ao carregar acomodações. Por favor, tente novamente mais tarde.
                </p>
              </div>
            ) : accommodations && accommodations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
                {accommodations.map((accommodation) => (
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
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  Nenhuma acomodação disponível no momento.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Accommodations;
