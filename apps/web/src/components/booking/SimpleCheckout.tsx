import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Calendar, Users, Loader2, Mail } from 'lucide-react';
import { useCreateReservation } from '@/hooks/useReservations';
import { useSettings } from '@/hooks/useSettings';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

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
}: SimpleCheckoutProps) {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestWhatsApp, setGuestWhatsApp] = useState('');
  const createReservation = useCreateReservation();
  const { data: settings } = useSettings();

  const numberOfNights = differenceInDays(checkOutDate, checkInDate);
  const subtotal = pricePerNight * numberOfNights;
  const extraBedsCost = numberOfExtraBeds * extraBedPrice * numberOfNights;
  const serviceFee = subtotal * 0.05;
  const taxes = subtotal * 0.02;
  const totalAmount = subtotal + extraBedsCost + serviceFee + taxes;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    }
    return value.substring(0, 15);
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setGuestWhatsApp(formatted);
  };

  const handleCheckout = async () => {
    if (!guestName || guestName.length < 3) {
      toast.error('Por favor, preencha seu nome completo');
      return;
    }

    if (!guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      toast.error('Por favor, preencha um email válido');
      return;
    }

    if (!guestWhatsApp || guestWhatsApp.replace(/\D/g, '').length < 10) {
      toast.error('Por favor, preencha um WhatsApp válido');
      return;
    }

    try {
      const reservation = await createReservation.mutateAsync({
        accommodationId,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        numberOfGuests,
        numberOfExtraBeds,
        guestName,
        guestEmail,
        guestWhatsApp: guestWhatsApp.replace(/\D/g, ''),
      });

      const message = `*NOVA RESERVA - FUSEHOTEL*

*Codigo:* ${reservation.data.reservationCode}

*DADOS DO HOSPEDE*
Nome: ${guestName}
Email: ${guestEmail}
WhatsApp: ${guestWhatsApp}

*DETALHES DA ACOMODACAO*
Acomodacao: ${accommodationName}
Tipo: ${accommodationType}

*PERIODO DA ESTADIA*
Check-in: ${format(checkInDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
Check-out: ${format(checkOutDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
Diarias: ${numberOfNights} ${numberOfNights === 1 ? 'noite' : 'noites'}
Hospedes: ${numberOfGuests} ${numberOfGuests === 1 ? 'pessoa' : 'pessoas'}
${numberOfExtraBeds > 0 ? `Camas extras: ${numberOfExtraBeds}\n` : ''}*VALOR TOTAL: ${formatCurrency(totalAmount)}*

Gostaria de confirmar esta reserva!
      `.trim();

      const hotelWhatsApp = settings?.hotelWhatsApp?.replace(/\D/g, '') || '5511999999999';
      const whatsappUrl = `https://wa.me/${hotelWhatsApp}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank');

      toast.success('Reserva criada! Você será redirecionado para o WhatsApp.', {
        description: `Código da reserva: ${reservation.data.reservationCode}. O acesso à área do cliente será preparado para ${guestEmail}.`,
        duration: 5000,
      });

      setGuestName('');
      setGuestEmail('');
      setGuestWhatsApp('');
    } catch (error: any) {
      toast.error('Erro ao criar reserva', {
        description: error.response?.data?.message || 'Tente novamente mais tarde',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Finalizar Reserva</CardTitle>
        <p className="text-sm text-gray-600">
          Preencha seus dados e confirme via WhatsApp
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold text-lg mb-3">Resumo da Reserva</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Acomodação:</span>
              <span className="font-medium">{accommodationName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar size={14} />
                Check-in:
              </span>
              <span className="font-medium">
                {format(checkInDate, 'dd/MM/yyyy')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar size={14} />
                Check-out:
              </span>
              <span className="font-medium">
                {format(checkOutDate, 'dd/MM/yyyy')}
              </span>
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
              <span>{numberOfNights} {numberOfNights === 1 ? 'diária' : 'diárias'} × {formatCurrency(pricePerNight)}</span>
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
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-[#0466C8]">{formatCurrency(totalAmount)}</span>
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
              Usaremos este email para preparar seu acesso à área do cliente.
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
              Usaremos este número para enviar a confirmação
            </p>
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 h-12"
          disabled={createReservation.isPending || !guestName || !guestEmail || !guestWhatsApp}
        >
          {createReservation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <MessageCircle size={20} />
              Finalizar via WhatsApp
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Ao clicar, você será redirecionado para o WhatsApp para confirmar sua reserva com o hotel.
          A reserva será criada com status pendente até a confirmação.
        </p>
      </CardContent>
    </Card>
  );
}
