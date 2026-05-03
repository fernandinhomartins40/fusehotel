import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionCard } from "@/components/ui/PromotionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Tag } from "lucide-react";
import { usePromotions } from '@/hooks/usePromotions';

const Promotions: React.FC = () => {
  const { data: promotions, isLoading, error } = usePromotions({ isActive: true });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0A0A0A] text-white" style={{ minHeight: '400px', display: 'flex', alignItems: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
          <div className="page-container text-center relative py-20 md:py-28">
            <div className="line-accent mx-auto mb-6" />
            <span className="page-kicker text-white/60">Ofertas especiais</span>
            <h1 className="section-title text-white mb-4">
              Pacotes e Promoções
            </h1>
            <p className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-white/80">
              Descubra nossas ofertas especiais e pacotes exclusivos para tornar sua estadia ainda mais memorável
            </p>
          </div>
        </section>

        {/* Promotions Grid */}
        <section className="page-section">
          <div className="page-container">
            {isLoading ? (
              <div className="card-modern">
                <div className="flex items-center justify-center p-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-lg text-muted-foreground">Carregando promoções...</span>
                </div>
              </div>
            ) : error ? (
              <div className="card-modern">
                <div className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="text-red-500 mb-4">
                    <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Erro ao carregar promoções</h2>
                  <p className="text-muted-foreground">
                    {(error as any)?.response?.data?.message || 'Ocorreu um erro ao carregar as promoções'}
                  </p>
                </div>
              </div>
            ) : promotions && promotions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
                {promotions.map((promotion) => (
                  <PromotionCard key={promotion.id} promotion={promotion} />
                ))}
              </div>
            ) : (
              <div className="card-modern">
                <div className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="text-gray-300 mb-4">
                    <Tag size={56} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Nenhuma promoção disponível no momento
                  </h2>
                  <p className="text-muted-foreground">
                    Volte em breve para conferir nossas ofertas especiais!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Promotions;
