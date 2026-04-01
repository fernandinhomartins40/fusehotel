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
    <div className="w-full">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="container mx-auto px-4 md:px-12 lg:px-24">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 uppercase">
              Acomodações
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl">
              Descubra nossas acomodações luxuosas com vista para o mar,
              cada uma projetada para oferecer o máximo conforto e elegância.
            </p>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="py-20 bg-[#f9f9f9]">
          <div className="container mx-auto px-4 md:px-12 lg:px-24">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {accommodations.map((accommodation) => (
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
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
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
