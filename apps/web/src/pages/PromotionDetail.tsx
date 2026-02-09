import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Star, MapPin, Calendar, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { format } from 'date-fns';
import { usePromotionBySlug } from '@/hooks/usePromotions';

const PromotionDetail: React.FC = () => {
  const { promotionId } = useParams<{ promotionId: string }>();

  const { data: promotion, isLoading, error } = usePromotionBySlug(promotionId || '');

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-lg">Carregando promoção...</span>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or not found
  if (error || !promotion) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Promoção não encontrada</h1>
            <p className="text-lg text-gray-600 mb-6">
              {(error as any)?.response?.data?.message || 'A promoção que você está procurando não está disponível.'}
            </p>
            <Button className="bg-[#0466C8] hover:bg-[#0355A6]" asChild>
              <Link to="/promocoes">Ver todas promoções</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Início</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/promocoes">Promoções</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>{promotion.title}</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={promotion.image || '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png'}
            alt={promotion.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="absolute bottom-8 left-8 text-white">
            <Badge className="mb-4 bg-[#0466C8] hover:bg-[#0355A6] text-white">
              {promotion.type === 'PACKAGE' ? 'Pacote' : 'Promoção'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{promotion.title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Promotion Details - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Promotion Header */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">4.9 (89 avaliações)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#0466C8]" />
                    <span>
                      Válido de {format(new Date(promotion.startDate), 'dd/MM/yyyy')} até {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#0466C8]" />
                    <span>Av Paulista, 900 - São Paulo</span>
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed">{promotion.shortDescription}</p>
              </div>

              <Separator />

              {/* Promotion Description */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sobre a promoção</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{promotion.longDescription}</p>
                </div>
              </div>

              <Separator />

              {/* Features */}
              {promotion.features && promotion.features.length > 0 && (
                <>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">O que está incluído</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {promotion.features.map((feature) => (
                        <div key={feature.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Tag size={18} className="text-[#0466C8] flex-shrink-0" />
                          <span className="text-gray-700">{feature.feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Terms and Conditions */}
              {promotion.termsAndConditions && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termos e Condições</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{promotion.termsAndConditions}</p>
                </div>
              )}
            </div>

            {/* Booking Card - Right Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {promotion.originalPrice && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          {formatCurrency(Number(promotion.originalPrice))}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          DESCONTO
                        </Badge>
                      </>
                    )}
                  </div>
                  {promotion.discountedPrice && (
                    <>
                      <div className="text-3xl font-bold text-[#0466C8]">
                        {formatCurrency(Number(promotion.discountedPrice))}
                      </div>
                      {promotion.originalPrice && (
                        <p className="text-sm text-gray-600">
                          Economia de {formatCurrency(Number(promotion.originalPrice) - Number(promotion.discountedPrice))}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">
                      {promotion.type === 'PACKAGE' ? 'Pacote' : 'Promoção'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Válido até:</span>
                    <span className="font-medium">
                      {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  {promotion.maxRedemptions && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Disponível:</span>
                      <span className="font-medium">
                        {promotion.maxRedemptions - promotion.currentRedemptions} vagas
                      </span>
                    </div>
                  )}
                </div>

                <Button className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white">
                  Reservar Agora
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  * Preços e disponibilidade sujeitos a alteração
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Promotions */}
        <div className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Button variant="outline" asChild className="border-[#0466C8] text-[#0466C8] hover:bg-[#0466C8] hover:text-white">
              <Link to="/promocoes" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Ver todas as promoções
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PromotionDetail;
