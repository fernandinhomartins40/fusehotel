import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Loader2, Mail, MessageCircle, Ticket, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReservation } from '@/hooks/useReservations';
import { useSettings } from '@/hooks/useSettings';
import { apiClient } from '@/lib/api-client';
import {
  clearCheckoutDraft,
  getMatchingCheckoutDraft,
  saveCheckoutDraft,
  type CheckoutDraftContext,
} from '@/lib/checkout-draft';
import { buildWhatsAppUrl, formatWhatsAppInput } from '@/lib/whatsapp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SimpleCheckoutProps {
  accommodationId: string;
  accommodationName: string;
  accommodationType: string;
  pricePerNight: number;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  numberOfExtraBeds: number;
  extraBedPrice: number;
  context?: CheckoutDraftContext;
  promotionId?: string;
  promotionCode?: string | null;
  promotionTitle?: string;
  promotionDiscountPercent?: number | null;
  promotionOriginalPrice?: number | null;
  promotionDiscountedPrice?: number | null;
}

function getPromotionDiscountRate(props: Pick<
  SimpleCheckoutProps,
  'promotionDiscountPercent' | 'promotionOriginalPrice' | 'promotionDiscountedPrice'
>) {
  if (props.promotionDiscountPercent && props.promotionDiscountPercent > 0) {
    return props.promotionDiscountPercent / 100;
  }

  if (
    props.promotionOriginalPrice &&
    props.promotionDiscountedPrice &&
    props.promotionOriginalPrice > props.promotionDiscountedPrice
  ) {
    return (
      (props.promotionOriginalPrice - props.promotionDiscountedPrice) /
      props.promotionOriginalPrice
    );
  }

  return 0;
}

export function SimpleCheckout({
  accommodationId,
  accommodationName,
  accommodationType,
  pricePerNight,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  numberOfExtraBeds,
  extraBedPrice,
  context = 'accommodation',
  promotionId,
  promotionCode,
  promotionTitle,
  promotionDiscountPercent,
  promotionOriginalPrice,
  promotionDiscountedPrice,
}: SimpleCheckoutProps) {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestWhatsApp, setGuestWhatsApp] = useState('');
  const [isCheckingCustomer, setIsCheckingCustomer] = useState(false);
  const hydratedFromDraftRef = useRef(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const createReservation = useCreateReservation();
  const { data: settings } = useSettings();

  const numberOfNights = differenceInDays(checkOutDate, checkInDate);
  const subtotal = pricePerNight * numberOfNights;
  const extraBedsCost = numberOfExtraBeds * extraBedPrice * numberOfNights;
  const serviceFee = subtotal * 0.05;
  const taxes = subtotal * 0.02;
  const promotionDiscount = subtotal * getPromotionDiscountRate({
    promotionDiscountPercent,
    promotionOriginalPrice,
    promotionDiscountedPrice,
  });
  const totalAmount = Math.max(subtotal + extraBedsCost + serviceFee + taxes - promotionDiscount, 0);

  useEffect(() => {
    if (hydratedFromDraftRef.current) {
      return;
    }

    const draft = getMatchingCheckoutDraft(location.pathname);

    if (!draft) {
      return;
    }

    const sameAccommodation = draft.accommodationId === accommodationId;
    const samePromotion = !promotionId || draft.promotionId === promotionId;

    if (!sameAccommodation || !samePromotion) {
      return;
    }

    setGuestName(draft.guestName);
    setGuestEmail(draft.guestEmail);
    setGuestWhatsApp(draft.guestWhatsApp);
    hydratedFromDraftRef.current = true;

    if (location.search.includes('resumeCheckout=1')) {
      toast.success('Checkout retomado', {
        description: 'Seus dados foram restaurados. Agora finalize a solicitacao da reserva.',
      });
    }
  }, [accommodationId, location.pathname, location.search, promotionId]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestWhatsApp(formatWhatsAppInput(e.target.value));
  };

  const redirectToLogin = (isProvisional: boolean) => {
    saveCheckoutDraft({
      context,
      routePath: location.pathname,
      accommodationId,
      accommodationName,
      accommodationType,
      pricePerNight,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      numberOfGuests,
      numberOfExtraBeds,
      extraBedPrice,
      guestName,
      guestEmail,
      guestWhatsApp,
      promotionId,
      promotionCode: promotionCode || undefined,
      promotionTitle,
      promotionDiscountPercent,
      promotionOriginalPrice,
      promotionDiscountedPrice,
    });

    const checkoutRedirect = `${location.pathname}?resumeCheckout=1`;

    toast('Cliente ja cadastrado', {
      description: isProvisional
        ? 'Faca login com o WhatsApp e use as 3 primeiras letras do nome como senha inicial.'
        : 'Faca login para concluir o checkout sem perder os dados informados.',
    });

    window.location.href = `/area-do-cliente?redirectTo=${encodeURIComponent(checkoutRedirect)}`;
  };

  const handleCheckout = async () => {
    if (!guestName || guestName.trim().length < 3) {
      toast.error('Preencha seu nome completo');
      return;
    }

    if (!guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      toast.error('Preencha um email valido');
      return;
    }

    if (!guestWhatsApp || guestWhatsApp.replace(/\D/g, '').length < 10) {
      toast.error('Preencha um WhatsApp valido');
      return;
    }

    try {
      if (!isAuthenticated) {
        setIsCheckingCustomer(true);

        const { data } = await apiClient.post('/auth/customer-status', {
          email: guestEmail.trim().toLowerCase(),
          whatsapp: guestWhatsApp,
        });

        if (data.data?.exists) {
          redirectToLogin(Boolean(data.data?.isProvisional));
          return;
        }
      }

      const reservation = await createReservation.mutateAsync({
        accommodationId,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        numberOfGuests,
        numberOfExtraBeds,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim().toLowerCase(),
        guestWhatsApp: guestWhatsApp.replace(/\D/g, ''),
        promotionId,
        promotionCode: promotionCode || undefined,
      });

      const message = `*NOVA SOLICITAÇÃO DE RESERVA*

*Código:* ${reservation.data.reservationCode}

*DADOS DO HÓSPEDE*
Nome: ${guestName}
Email: ${guestEmail}
WhatsApp: ${guestWhatsApp}

*DETALHES DA ACOMODAÇÃO*
Acomodação: ${accommodationName}
Tipo: ${accommodationType}
${promotionTitle ? `Promoção/Pacote: ${promotionTitle}\n` : ''}${promotionCode ? `Código promocional: ${promotionCode}\n` : ''}
*PERÍODO DA ESTADIA*
Check-in: ${format(checkInDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
Check-out: ${format(checkOutDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
Diárias: ${numberOfNights} ${numberOfNights === 1 ? 'noite' : 'noites'}
Hóspedes: ${numberOfGuests} ${numberOfGuests === 1 ? 'pessoa' : 'pessoas'}
${numberOfExtraBeds > 0 ? `Camas extras: ${numberOfExtraBeds}\n` : ''}${promotionDiscount > 0 ? `Desconto aplicado: ${formatCurrency(promotionDiscount)}\n` : ''}*VALOR TOTAL: ${formatCurrency(totalAmount)}*

Solicitação enviada. Aguardo o aceite do hotel.`.trim();

      const hotelWhatsApp = settings?.hotelWhatsApp || '5511999999999';
      window.open(buildWhatsAppUrl(hotelWhatsApp, message), '_blank');

      clearCheckoutDraft();
      setGuestName('');
      setGuestEmail('');
      setGuestWhatsApp('');

      toast.success('Reserva criada com sucesso', {
        description: isAuthenticated
          ? `Código da reserva: ${reservation.data.reservationCode}. O resumo foi aberto no WhatsApp do hotel.`
          : 'Cadastro provisório criado. Para acessar depois, use o WhatsApp como usuario e as 3 primeiras letras do nome como senha inicial.',
        duration: 6000,
      });
    } catch (error: any) {
      toast.error('Erro ao criar reserva', {
        description: error.response?.data?.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsCheckingCustomer(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Finalizar Reserva</CardTitle>
        <p className="text-sm text-gray-600">
          Preencha seus dados. Se já existir cadastro, o checkout será retomado após o login.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold text-lg mb-3">Resumo da reserva</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Acomodação:</span>
              <span className="font-medium text-right">{accommodationName}</span>
            </div>

            {promotionTitle && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-600 flex items-center gap-1">
                  <Ticket size={14} />
                  Pacote/Promoção:
                </span>
                <span className="font-medium text-right">{promotionTitle}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar size={14} />
                Check-in:
              </span>
              <span className="font-medium">{format(checkInDate, 'dd/MM/yyyy')}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar size={14} />
                Check-out:
              </span>
              <span className="font-medium">{format(checkOutDate, 'dd/MM/yyyy')}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center gap-1">
                <Users size={14} />
                Hóspedes:
              </span>
              <span className="font-medium">{numberOfGuests}</span>
            </div>

            {numberOfExtraBeds > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Camas extras:</span>
                <span className="font-medium">{numberOfExtraBeds}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>
                {numberOfNights} {numberOfNights === 1 ? 'diária' : 'diárias'} x{' '}
                {formatCurrency(pricePerNight)}
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            {numberOfExtraBeds > 0 && (
              <div className="flex justify-between">
                <span>Camas extras</span>
                <span>{formatCurrency(extraBedsCost)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Taxa de serviço (5%)</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Impostos (2%)</span>
              <span>{formatCurrency(taxes)}</span>
            </div>

            {promotionDiscount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Desconto promocional</span>
                <span>- {formatCurrency(promotionDiscount)}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="guestName">Nome Completo *</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="João da Silva"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="guestEmail" className="flex items-center gap-2">
              <Mail size={16} />
              Email *
            </Label>
            <Input
              id="guestEmail"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se este e-mail ou WhatsApp já possuir cadastro, você será direcionado para login.
            </p>
          </div>

          <div>
            <Label htmlFor="guestWhatsApp">WhatsApp *</Label>
            <Input
              id="guestWhatsApp"
              value={guestWhatsApp}
              onChange={handleWhatsAppChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              O resumo da solicitação será enviado para o WhatsApp do hotel e o aceite será retornado para este número.
            </p>
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 h-12"
          disabled={
            createReservation.isPending ||
            isCheckingCustomer ||
            !guestName ||
            !guestEmail ||
            !guestWhatsApp
          }
        >
          {createReservation.isPending || isCheckingCustomer ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {isCheckingCustomer ? 'Validando cadastro...' : 'Processando...'}
            </>
          ) : (
            <>
              <MessageCircle size={20} />
              Finalizar via WhatsApp
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Ao concluir, a reserva será criada com status pendente e a acomodação ficará bloqueada na agenda até o aceite do hotel.
        </p>
      </CardContent>
    </Card>
  );
}

