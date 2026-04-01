import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionCard } from "@/components/ui/PromotionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Tag } from "lucide-react";
import { usePromotions } from '@/hooks/usePromotions';

const Promotions: React.FC = () => {
  // Buscar apenas promoções ativas da API
  const { data: promotions, isLoading, error } = usePromotions({ isActive: true });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pacotes e Promoções
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Descubra nossas ofertas especiais e pacotes exclusivos para tornar sua estadia ainda mais memorável
            </p>
          </div>
        </section>

        {/* Promotions Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-lg">Carregando promoções...</span>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="text-red-600 mb-4">
                    <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Erro ao carregar promoções</h2>
                  <p className="text-gray-600">
                    {(error as any)?.response?.data?.message || 'Ocorreu um erro ao carregar as promoções'}
                  </p>
                </CardContent>
              </Card>
            ) : promotions && promotions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {promotions.map((promotion) => (
                  <PromotionCard key={promotion.id} promotion={promotion} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Tag size={64} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Nenhuma promoção disponível no momento
                  </h2>
                  <p className="text-gray-600">
                    Volte em breve para conferir nossas ofertas especiais!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Promotions;
