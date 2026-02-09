import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateReservation } from '@/hooks/useReservations';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Mail, Phone, User, FileText, Loader2 } from 'lucide-react';
import { differenceInDays } from 'date-fns';

const reservationFormSchema = z.object({
  checkInDate: z.string().min(1, 'Data de check-in é obrigatória'),
  checkOutDate: z.string().min(1, 'Data de check-out é obrigatória'),
  numberOfGuests: z.number().min(1, 'Mínimo de 1 hóspede').max(20, 'Máximo de 20 hóspedes'),
  numberOfExtraBeds: z.number().min(0).max(5).optional(),
  guestName: z.string().min(3, 'Nome completo é obrigatório').max(100),
  guestEmail: z.string().email('E-mail inválido'),
  guestPhone: z.string().min(10, 'Telefone é obrigatório').max(20),
  guestCpf: z.string().min(11, 'CPF é obrigatório').max(14),
  specialRequests: z.string().max(500).optional(),
});

type ReservationFormData = z.infer<typeof reservationFormSchema>;

interface ReservationFormProps {
  accommodationId: string;
  accommodationName: string;
  pricePerNight: number;
  maxCapacity: number;
  extraBedPrice?: number;
}

export function ReservationForm({
  accommodationId,
  accommodationName,
  pricePerNight,
  maxCapacity,
  extraBedPrice = 50,
}: ReservationFormProps) {
  const navigate = useNavigate();
  const createReservation = useCreateReservation();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      numberOfGuests: 1,
      numberOfExtraBeds: 0,
    },
  });

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');
  const numberOfGuests = watch('numberOfGuests');
  const numberOfExtraBeds = watch('numberOfExtraBeds') || 0;

  // Calcular preço total
  React.useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = differenceInDays(new Date(checkOutDate), new Date(checkInDate));

      if (nights > 0) {
        const subtotal = pricePerNight * nights;
        const extraBedsCost = numberOfExtraBeds * extraBedPrice * nights;
        const serviceFee = subtotal * 0.05;
        const taxes = subtotal * 0.02;
        const total = subtotal + extraBedsCost + serviceFee + taxes;

        setCalculatedPrice(total);
      } else {
        setCalculatedPrice(null);
      }
    } else {
      setCalculatedPrice(null);
    }
  }, [checkInDate, checkOutDate, numberOfExtraBeds, pricePerNight, extraBedPrice]);

  const onSubmit = async (data: ReservationFormData) => {
    const reservationData = {
      ...data,
      accommodationId,
      numberOfGuests: Number(data.numberOfGuests),
      numberOfExtraBeds: Number(data.numberOfExtraBeds || 0),
    };

    createReservation.mutate(reservationData, {
      onSuccess: (response) => {
        navigate('/customer-dashboard');
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const numberOfNights = checkInDate && checkOutDate
    ? differenceInDays(new Date(checkOutDate), new Date(checkInDate))
    : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Fazer Reserva</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para reservar: {accommodationName}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInDate" className="flex items-center gap-2">
                <Calendar size={16} />
                Data de Check-in *
              </Label>
              <Input
                id="checkInDate"
                type="date"
                {...register('checkInDate')}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.checkInDate && (
                <p className="text-sm text-red-600">{errors.checkInDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutDate" className="flex items-center gap-2">
                <Calendar size={16} />
                Data de Check-out *
              </Label>
              <Input
                id="checkOutDate"
                type="date"
                {...register('checkOutDate')}
                min={checkInDate || new Date().toISOString().split('T')[0]}
              />
              {errors.checkOutDate && (
                <p className="text-sm text-red-600">{errors.checkOutDate.message}</p>
              )}
            </div>
          </div>

          {/* Hóspedes e Camas Extras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfGuests" className="flex items-center gap-2">
                <Users size={16} />
                Número de Hóspedes *
              </Label>
              <Select
                value={numberOfGuests?.toString()}
                onValueChange={(value) => setValue('numberOfGuests', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'hóspede' : 'hóspedes'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.numberOfGuests && (
                <p className="text-sm text-red-600">{errors.numberOfGuests.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfExtraBeds" className="flex items-center gap-2">
                <Users size={16} />
                Camas Extras ({formatCurrency(extraBedPrice)}/noite)
              </Label>
              <Select
                value={numberOfExtraBeds?.toString()}
                onValueChange={(value) => setValue('numberOfExtraBeds', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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
          </div>

          {/* Dados do Hóspede */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Dados do Hóspede</h3>

            <div className="space-y-2">
              <Label htmlFor="guestName" className="flex items-center gap-2">
                <User size={16} />
                Nome Completo *
              </Label>
              <Input
                id="guestName"
                {...register('guestName')}
                placeholder="João da Silva"
              />
              {errors.guestName && (
                <p className="text-sm text-red-600">{errors.guestName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestEmail" className="flex items-center gap-2">
                  <Mail size={16} />
                  E-mail *
                </Label>
                <Input
                  id="guestEmail"
                  type="email"
                  {...register('guestEmail')}
                  placeholder="joao@exemplo.com"
                />
                {errors.guestEmail && (
                  <p className="text-sm text-red-600">{errors.guestEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestPhone" className="flex items-center gap-2">
                  <Phone size={16} />
                  Telefone *
                </Label>
                <Input
                  id="guestPhone"
                  {...register('guestPhone')}
                  placeholder="(11) 99999-9999"
                />
                {errors.guestPhone && (
                  <p className="text-sm text-red-600">{errors.guestPhone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestCpf" className="flex items-center gap-2">
                <FileText size={16} />
                CPF *
              </Label>
              <Input
                id="guestCpf"
                {...register('guestCpf')}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {errors.guestCpf && (
                <p className="text-sm text-red-600">{errors.guestCpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests" className="flex items-center gap-2">
                <FileText size={16} />
                Solicitações Especiais (Opcional)
              </Label>
              <Textarea
                id="specialRequests"
                {...register('specialRequests')}
                placeholder="Ex: Quarto próximo ao elevador, berço para bebê, etc."
                rows={3}
              />
              {errors.specialRequests && (
                <p className="text-sm text-red-600">{errors.specialRequests.message}</p>
              )}
            </div>
          </div>

          {/* Resumo do Preço */}
          {calculatedPrice !== null && numberOfNights > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-lg mb-3">Resumo da Reserva</h3>

              <div className="flex justify-between text-sm">
                <span>{numberOfNights} {numberOfNights === 1 ? 'diária' : 'diárias'} × {formatCurrency(pricePerNight)}</span>
                <span>{formatCurrency(pricePerNight * numberOfNights)}</span>
              </div>

              {numberOfExtraBeds > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{numberOfExtraBeds} {numberOfExtraBeds === 1 ? 'cama extra' : 'camas extras'} × {formatCurrency(extraBedPrice)}</span>
                  <span>{formatCurrency(numberOfExtraBeds * extraBedPrice * numberOfNights)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>Taxa de serviço (5%)</span>
                <span>{formatCurrency(pricePerNight * numberOfNights * 0.05)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Impostos (2%)</span>
                <span>{formatCurrency(pricePerNight * numberOfNights * 0.02)}</span>
              </div>

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#0466C8]">{formatCurrency(calculatedPrice)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Botão de Envio */}
          <Button
            type="submit"
            className="w-full bg-[#0466C8] hover:bg-[#0355A6] flex items-center justify-center gap-2"
            disabled={createReservation.isPending}
          >
            {createReservation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Confirmar Reserva
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Ao confirmar, você concorda com nossos termos de serviço e política de cancelamento.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
