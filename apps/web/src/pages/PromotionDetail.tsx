import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Loader2, MapPin, Star, Tag, Users } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SimpleCheckout } from '@/components/booking/SimpleCheckout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePromotionBySlug } from '@/hooks/usePromotions';
import { useAccommodations } from '@/hooks/useAccommodations';
import { useCheckAvailability } from '@/hooks/useSchedule';
import { getMatchingCheckoutDraft } from '@/lib/checkout-draft';
import type { Accommodation } from '@/types/accommodation';

const accommodationTypeLabels: Record<string, string> = {
  ROOM: 'Quarto',
  SUITE: 'Suite',
  CHALET: 'Chale',
  VILLA: 'Villa',
  APARTMENT: 'Apartamento',
};

const PromotionDetail: React.FC = () => {
  const { promotionId } = useParams<{ promotionId: string }>();
  const [searchParams] = useSearchParams();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState('');

  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }, []);

  const dayAfterTomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  }, []);

  const [checkInDate, setCheckInDate] = useState<Date>(tomorrow);
  const [checkOutDate, setCheckOutDate] = useState<Date>(dayAfterTomorrow);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);
  const [numberOfExtraBeds, setNumberOfExtraBeds] = useState<number>(0);

  const { data: promotion, isLoading, error } = usePromotionBySlug(promotionId || '');
  const { data: accommodations = [] } = useAccommodations();

  const selectedAccommodation = accommodations.find(
    (accommodation: Accommodation) => accommodation.id === selectedAccommodationId
  ) as Accommodation | undefined;

  const selectedCheckInDate = checkInDate.toISOString().split('T')[0];
  const selectedCheckOutDate = checkOutDate.toISOString().split('T')[0];
  const hasValidDateRange = checkOutDate > checkInDate;
  const { data: availabilityCheck, isLoading: isCheckingAvailability } = useCheckAvailability(
    selectedAccommodation?.id || '',
    selectedCheckInDate,
    selectedCheckOutDate
  );
  const isSelectedPeriodUnavailable =
    hasValidDateRange && availabilityCheck?.isAvailable === false;

  useEffect(() => {
    if (!selectedAccommodationId && accommodations.length > 0) {
      setSelectedAccommodationId(accommodations[0].id);
    }
  }, [accommodations, selectedAccommodationId]);

  useEffect(() => {
    if (!promotion) {
      return;
    }

    const draft = getMatchingCheckoutDraft(`/promocoes/${promotionId}`);

    if (!draft) {
      return;
    }

    setSelectedAccommodationId(draft.accommodationId);
    setCheckInDate(new Date(draft.checkInDate));
    setCheckOutDate(new Date(draft.checkOutDate));
    setNumberOfGuests(draft.numberOfGuests);
    setNumberOfExtraBeds(draft.numberOfExtraBeds);

    if (searchParams.get('resumeCheckout') === '1') {
      setShowBookingForm(true);
    }
  }, [promotion, promotionId, searchParams]);

  useEffect(() => {
    if (!selectedAccommodation) {
      return;
    }

    if (numberOfGuests > selectedAccommodation.capacity) {
      setNumberOfGuests(selectedAccommodation.capacity);
    }

    if (numberOfExtraBeds > selectedAccommodation.maxExtraBeds) {
      setNumberOfExtraBeds(selectedAccommodation.maxExtraBeds);
    }
  }, [numberOfExtraBeds, numberOfGuests, selectedAccommodation]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const handleProceedToCheckout = () => {
    if (
      !selectedAccommodation ||
      !selectedAccommodation.isAvailable ||
      !hasValidDateRange ||
      isSelectedPeriodUnavailable
    ) {
      return;
    }

    setShowBookingForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-lg">Carregando promocao...</span>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Promocao nao encontrada</h1>
            <p className="text-lg text-gray-600 mb-6">
              {(error as any)?.response?.data?.message ||
                'A promocao que voce esta procurando nao esta disponivel.'}
            </p>
            <Button className="bg-[#0466C8] hover:bg-[#0355A6]" asChild>
              <Link to="/promocoes">Ver todas promocoes</Link>
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
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Inicio</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/promocoes">Promocoes</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>{promotion.title}</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={promotion.image || '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png'}
            alt={promotion.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-8 left-8 text-white">
            <Badge className="mb-4 bg-[#0466C8] hover:bg-[#0355A6] text-white">
              {promotion.type === 'PACKAGE' ? 'Pacote' : 'Promocao'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{promotion.title}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {showBookingForm && selectedAccommodation ? (
            <div className="space-y-6">
              <Button
                variant="outline"
                onClick={() => setShowBookingForm(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Voltar aos detalhes
              </Button>

              <SimpleCheckout
                context="promotion"
                accommodationId={selectedAccommodation.id}
                accommodationName={selectedAccommodation.name}
                accommodationType={
                  accommodationTypeLabels[selectedAccommodation.type] || selectedAccommodation.type
                }
                pricePerNight={Number(selectedAccommodation.pricePerNight)}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                numberOfGuests={numberOfGuests}
                numberOfExtraBeds={numberOfExtraBeds}
                extraBedPrice={Number(selectedAccommodation.extraBedPrice || 0)}
                promotionId={promotion.id}
                promotionCode={promotion.promotionCode}
                promotionTitle={promotion.title}
                promotionDiscountPercent={promotion.discountPercent}
                promotionOriginalPrice={promotion.originalPrice}
                promotionDiscountedPrice={promotion.discountedPrice}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">4.9 (89 avaliacoes)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-[#0466C8]" />
                      <span>
                        Valido de {format(new Date(promotion.startDate), 'dd/MM/yyyy')} ate{' '}
                        {format(new Date(promotion.endDate), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-[#0466C8]" />
                      <span>Av Paulista, 900 - Sao Paulo</span>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed">
                    {promotion.shortDescription}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sobre a promocao</h2>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {promotion.longDescription}
                    </p>
                  </div>
                </div>

                <Separator />

                {promotion.features && promotion.features.length > 0 && (
                  <>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        O que esta incluido
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {promotion.features.map((feature) => (
                          <div
                            key={feature.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <Tag size={18} className="text-[#0466C8] flex-shrink-0" />
                            <span className="text-gray-700">{feature.feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {promotion.termsAndConditions && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                      Termos e Condicoes
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {promotion.termsAndConditions}
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-8 bg-white rounded-lg border border-gray-200 p-6 shadow-lg space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {promotion.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatCurrency(Number(promotion.originalPrice))}
                        </span>
                      )}
                      {promotion.discountedPrice && (
                        <Badge variant="destructive" className="text-xs">
                          OFERTA
                        </Badge>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-[#0466C8]">
                      {formatCurrency(
                        Number(promotion.discountedPrice ?? promotion.originalPrice ?? 0)
                      )}
                    </div>
                    <p className="text-sm text-gray-600">valor promocional de referencia</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="promotionAccommodation">Acomodacao</Label>
                      <Select
                        value={selectedAccommodationId}
                        onValueChange={setSelectedAccommodationId}
                      >
                        <SelectTrigger id="promotionAccommodation" className="mt-2">
                          <SelectValue placeholder="Selecione a acomodacao" />
                        </SelectTrigger>
                        <SelectContent>
                          {accommodations.map((accommodation: Accommodation) => (
                            <SelectItem key={accommodation.id} value={accommodation.id}>
                              {accommodation.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="promotionCheckIn">Check-in</Label>
                      <Input
                        id="promotionCheckIn"
                        type="date"
                        value={selectedCheckInDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setCheckInDate(new Date(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="promotionCheckOut">Check-out</Label>
                      <Input
                        id="promotionCheckOut"
                        type="date"
                        value={selectedCheckOutDate}
                        min={selectedCheckInDate}
                        onChange={(e) => setCheckOutDate(new Date(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="promotionGuests" className="flex items-center gap-2">
                        <Users size={16} />
                        Hospedes
                      </Label>
                      <Select
                        value={numberOfGuests.toString()}
                        onValueChange={(value) => setNumberOfGuests(Number(value))}
                      >
                        <SelectTrigger id="promotionGuests" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: selectedAccommodation?.capacity || 1 },
                            (_, i) => i + 1
                          ).map((guestCount) => (
                            <SelectItem key={guestCount} value={guestCount.toString()}>
                              {guestCount} {guestCount === 1 ? 'hospede' : 'hospedes'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedAccommodation &&
                      selectedAccommodation.maxExtraBeds > 0 &&
                      Number(selectedAccommodation.extraBedPrice) > 0 && (
                        <div>
                          <Label htmlFor="promotionExtraBeds">
                            Camas extras (
                            {formatCurrency(Number(selectedAccommodation.extraBedPrice))}/noite)
                          </Label>
                          <Select
                            value={numberOfExtraBeds.toString()}
                            onValueChange={(value) => setNumberOfExtraBeds(Number(value))}
                          >
                            <SelectTrigger id="promotionExtraBeds" className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from(
                                { length: selectedAccommodation.maxExtraBeds + 1 },
                                (_, i) => i
                              ).map((extraBeds) => (
                                <SelectItem key={extraBeds} value={extraBeds.toString()}>
                                  {extraBeds} {extraBeds === 1 ? 'cama' : 'camas'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                  </div>

                  <Button
                    className="w-full bg-[#0466C8] hover:bg-[#0355A6] text-white"
                    onClick={handleProceedToCheckout}
                    disabled={
                      !selectedAccommodation ||
                      !selectedAccommodation.isAvailable ||
                      !hasValidDateRange ||
                      isCheckingAvailability ||
                      isSelectedPeriodUnavailable
                    }
                  >
                    {!selectedAccommodation
                      ? 'Selecione uma acomodacao'
                      : !selectedAccommodation.isAvailable
                        ? 'Acomodacao indisponivel'
                        : isCheckingAvailability
                          ? 'Verificando agenda...'
                          : isSelectedPeriodUnavailable
                            ? 'Sem disponibilidade'
                            : 'Reservar Agora'}
                  </Button>

                  {!hasValidDateRange && (
                    <p className="text-xs text-amber-600 text-center">
                      O check-out precisa ser posterior ao check-in.
                    </p>
                  )}

                  {selectedAccommodation && isSelectedPeriodUnavailable && (
                    <p className="text-xs text-red-600 text-center">
                      A agenda indica indisponibilidade para este periodo.
                    </p>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    O pacote promocional entra no checkout e a acomodacao escolhida fica bloqueada
                    na agenda ate o aceite do hotel.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Button
              variant="outline"
              asChild
              className="border-[#0466C8] text-[#0466C8] hover:bg-[#0466C8] hover:text-white"
            >
              <Link to="/promocoes" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Ver todas as promocoes
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
