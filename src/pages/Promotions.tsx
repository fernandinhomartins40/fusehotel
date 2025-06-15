
import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromotionCard } from "@/components/ui/PromotionCard";
import { mockPromotions } from '@/models/promotion';

const Promotions: React.FC = () => {
  const activePromotions = mockPromotions.filter(promotion => promotion.active);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#0466C8] to-[#0355A6] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pacotes e Promoções
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Descubra nossas ofertas especiais e pacotes exclusivos para tornar sua estadia ainda mais memorável
            </p>
          </div>
        </section>

        {/* Promotions Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {activePromotions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activePromotions.map((promotion) => (
                  <PromotionCard key={promotion.id} promotion={promotion} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Nenhuma promoção disponível no momento
                </h2>
                <p className="text-gray-600">
                  Volte em breve para conferir nossas ofertas especiais!
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

export default Promotions;
