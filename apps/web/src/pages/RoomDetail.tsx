import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, ArrowLeft, MapPin, Clock, Loader2, Calendar as CalendarIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { SimpleCheckout } from "@/components/booking/SimpleCheckout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { useAccommodationBySlug } from "@/hooks/useAccommodations";
import { useCheckRoomUnitAvailability } from "@/hooks/useSchedule";
import { getMatchingCheckoutDraft } from "@/lib/checkout-draft";

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Estados para seleção de datas e hóspedes
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

  const [checkInDate, setCheckInDate] = useState<Date>(tomorrow);
  const [checkOutDate, setCheckOutDate] = useState<Date>(dayAfterTomorrow);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);
  const [numberOfExtraBeds, setNumberOfExtraBeds] = useState<number>(0);

  const { data: accommodation, isLoading, error } = useAccommodationBySlug(roomId || '');
  const selectedCheckInDate = checkInDate.toISOString().split('T')[0];
  const selectedCheckOutDate = checkOutDate.toISOString().split('T')[0];
  const hasValidDateRange = checkOutDate > checkInDate;
  const { data: availabilityCheck, isLoading: isCheckingAvailability } = useCheckRoomUnitAvailability(
    accommodation?.id || '',
    selectedCheckInDate,
    selectedCheckOutDate
  );
  const isSelectedPeriodUnavailable =
    hasValidDateRange && availabilityCheck?.isAvailable === false;

  useEffect(() => {
    if (!accommodation) {
      return;
    }

    const draft = getMatchingCheckoutDraft(`/acomodacoes/${roomId}`);

    if (!draft || draft.roomUnitId !== accommodation.id) {
      return;
    }

    setCheckInDate(new Date(draft.checkInDate));
    setCheckOutDate(new Date(draft.checkOutDate));
    setNumberOfGuests(draft.numberOfGuests);
    setNumberOfExtraBeds(draft.numberOfExtraBeds);

    if (searchParams.get('resumeCheckout') === '1') {
      setShowBookingForm(true);
    }
  }, [accommodation, roomId, searchParams]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-lg">Carregando acomodação...</span>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or not found
  if (error || !accommodation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Acomodação não encontrada</h1>
            <p className="text-lg text-gray-600 mb-6">
              {(error as any)?.response?.data?.message || 'A acomodação que você está procurando não está disponível.'}
            </p>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/acomodacoes">Ver todas acomodações</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const accommodationType = {
    'ROOM': 'Quarto',
    'SUITE': 'Suíte',
    'CHALET': 'Chalé',
    'VILLA': 'Villa',
    'APARTMENT': 'Apartamento',
  }[accommodation.type] || accommodation.type;

  const images = accommodation.images?.map(img => img.url) || [];
  const amenities = accommodation.amenities?.map(a => a.amenity.name) || [];

  const handleProceedToCheckout = () => {
    if (!hasValidDateRange || isSelectedPeriodUnavailable) {
      return;
    }

    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-4">
          <div className="page-container">
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
                    <Link to="/acomodacoes">Acomodações</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>{accommodation.name}</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && <ImageGallery images={images} title={accommodation.name} />}

        {/* Content */}
        <div className="page-container page-section">
          {showBookingForm ? (
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
                roomUnitId={accommodation.id}
                accommodationId={accommodation.legacyAccommodationId}
                accommodationName={accommodation.name}
                accommodationType={accommodationType}
                pricePerNight={Number(accommodation.pricePerNight)}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                numberOfGuests={numberOfGuests}
                numberOfExtraBeds={numberOfExtraBeds}
                extraBedPrice={Number(accommodation.extraBedPrice || 0)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Room Details - Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Room Header */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {accommodationType}
                    </Badge>
                    {accommodation.isAvailable && (
                      <Badge variant="outline" className="border-green-600 text-green-600">
                        Disponível
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{accommodation.name}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-primary" />
                      <span>{accommodation.size}m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-primary" />
                      <span>Capacidade: {accommodation.capacity} pessoa{accommodation.capacity !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed">{accommodation.description}</p>
                </div>

                <Separator />

                {/* Room Description */}
                {accommodation.longDescription && (
                  <>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sobre a acomodação</h2>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{accommodation.longDescription}</p>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Room Amenities */}
                {amenities.length > 0 && (
                  <>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Comodidades</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Check size={18} className="text-primary flex-shrink-0" />
                            <span className="text-gray-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Additional Information */}
                {accommodation.checkInTime && accommodation.checkOutTime && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Informações Importantes</h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-primary" />
                        <span className="text-gray-700">
                          Check-in: {accommodation.checkInTime} • Check-out: {accommodation.checkOutTime}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Card - Right Column */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">A partir de</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(Number(accommodation.pricePerNight))}
                      </p>
                      <p className="text-sm text-gray-600">por noite</p>
                    </div>

                    <Separator />

                    {/* Seleção de datas e hóspedes */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="checkIn" className="flex items-center gap-2 mb-2">
                          <CalendarIcon size={16} />
                          Check-in
                        </Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={checkInDate.toISOString().split('T')[0]}
                          onChange={(e) => setCheckInDate(new Date(e.target.value))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <Label htmlFor="checkOut" className="flex items-center gap-2 mb-2">
                          <CalendarIcon size={16} />
                          Check-out
                        </Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={checkOutDate.toISOString().split('T')[0]}
                          onChange={(e) => setCheckOutDate(new Date(e.target.value))}
                          min={checkInDate.toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <Label htmlFor="guests" className="flex items-center gap-2 mb-2">
                          <Users size={16} />
                          Hóspedes
                        </Label>
                        <Select
                          value={numberOfGuests.toString()}
                          onValueChange={(value) => setNumberOfGuests(Number(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: accommodation.capacity }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'hóspede' : 'hóspedes'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {accommodation.extraBedPrice && Number(accommodation.extraBedPrice) > 0 && (
                        <div>
                          <Label htmlFor="extraBeds" className="mb-2">
                            Camas extras ({formatCurrency(Number(accommodation.extraBedPrice))}/noite)
                          </Label>
                          <Select
                            value={numberOfExtraBeds.toString()}
                            onValueChange={(value) => setNumberOfExtraBeds(Number(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 6 }, (_, i) => i).map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? 'cama' : 'camas'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                      onClick={handleProceedToCheckout}
                      disabled={
                        !accommodation.isAvailable ||
                        !hasValidDateRange ||
                        isCheckingAvailability ||
                        isSelectedPeriodUnavailable
                      }
                    >
                      <CalendarIcon size={18} />
                      {!accommodation.isAvailable
                        ? 'Indisponível'
                        : isCheckingAvailability
                          ? 'Verificando Agenda...'
                          : isSelectedPeriodUnavailable
                            ? 'Sem Disponibilidade'
                            : 'Reservar Agora'}
                    </Button>

                    {!hasValidDateRange && (
                      <p className="text-xs text-amber-600 text-center">
                        O check-out precisa ser posterior ao check-in.
                      </p>
                    )}

                    {hasValidDateRange && isSelectedPeriodUnavailable && (
                      <p className="text-xs text-red-600 text-center">
                        A agenda indica indisponibilidade para este período.
                      </p>
                    )}

                    {hasValidDateRange &&
                      !isCheckingAvailability &&
                      !isSelectedPeriodUnavailable &&
                      accommodation.isAvailable && (
                        <p className="text-xs text-green-600 text-center">
                          Período disponível na agenda.
                        </p>
                      )}

                    <p className="text-xs text-gray-500 text-center">
                      Você não será cobrado ainda
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Back to Accommodations */}
        {!showBookingForm && (
          <div className="bg-gray-50 page-section-tight">
            <div className="page-container text-center">
              <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/acomodacoes" className="flex items-center gap-2">
                  <ArrowLeft size={18} />
                  Ver todas as acomodações
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RoomDetail;
