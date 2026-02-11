import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { differenceInDays, format, parse } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useAccommodations } from '@/hooks/useAccommodations';
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ReservationFormData {
  accommodationId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfExtraBeds: number;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  guestWhatsApp: string;
  guestCpf?: string;
  specialRequests?: string;
  paymentMethod?: string;
}

export const CreateReservationDialog: React.FC<CreateReservationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ReservationFormData>();

  const createReservation = useCreateReservation();
  const { data: accommodations = [] } = useAccommodations();

  const selectedAccommodationId = watch('accommodationId');
  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');
  const numberOfExtraBeds = watch('numberOfExtraBeds') || 0;

  const selectedAccommodation = accommodations.find(
    (a: any) => a.id === selectedAccommodationId
  );

  // Calculate reservation details
  const numberOfNights =
    checkInDate && checkOutDate
      ? differenceInDays(new Date(checkOutDate), new Date(checkInDate))
      : 0;

  const subtotal = selectedAccommodation
    ? Number(selectedAccommodation.pricePerNight) * numberOfNights
    : 0;

  const extraBedsCost = selectedAccommodation
    ? Number(selectedAccommodation.extraBedPrice) * numberOfExtraBeds * numberOfNights
    : 0;

  const serviceFee = subtotal * 0.05;
  const taxes = subtotal * 0.02;
  const totalAmount = subtotal + extraBedsCost + serviceFee + taxes;

  const onSubmit = async (data: ReservationFormData) => {
    if (numberOfNights <= 0) {
      return;
    }

    await createReservation.mutateAsync({
      ...data,
      numberOfGuests: Number(data.numberOfGuests),
      numberOfExtraBeds: Number(data.numberOfExtraBeds) || 0,
    });

    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Reserva</DialogTitle>
          <DialogDescription>
            Crie uma nova reserva manualmente no sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Acomodação */}
          <div className="space-y-2">
            <Label htmlFor="accommodationId">
              Acomodação <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="accommodationId"
              control={control}
              rules={{ required: 'Selecione uma acomodação' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a acomodação" />
                  </SelectTrigger>
                  <SelectContent>
                    {accommodations.map((accommodation: any) => (
                      <SelectItem key={accommodation.id} value={accommodation.id}>
                        {accommodation.name} - R$ {Number(accommodation.pricePerNight).toFixed(2)}/noite
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.accommodationId && (
              <p className="text-sm text-red-500">{errors.accommodationId.message}</p>
            )}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInDate">
                Check-in <span className="text-red-500">*</span>
              </Label>
              <Input
                id="checkInDate"
                type="date"
                {...register('checkInDate', { required: 'Data de check-in é obrigatória' })}
              />
              {errors.checkInDate && (
                <p className="text-sm text-red-500">{errors.checkInDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutDate">
                Check-out <span className="text-red-500">*</span>
              </Label>
              <Input
                id="checkOutDate"
                type="date"
                {...register('checkOutDate', { required: 'Data de check-out é obrigatória' })}
              />
              {errors.checkOutDate && (
                <p className="text-sm text-red-500">{errors.checkOutDate.message}</p>
              )}
            </div>
          </div>

          {numberOfNights > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>{numberOfNights}</strong> {numberOfNights === 1 ? 'noite' : 'noites'}
              </AlertDescription>
            </Alert>
          )}

          {/* Hóspedes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfGuests">
                Número de Hóspedes <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numberOfGuests"
                type="number"
                min={1}
                max={selectedAccommodation?.capacity || 10}
                {...register('numberOfGuests', {
                  required: 'Número de hóspedes é obrigatório',
                  min: { value: 1, message: 'Mínimo 1 hóspede' },
                })}
              />
              {errors.numberOfGuests && (
                <p className="text-sm text-red-500">{errors.numberOfGuests.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfExtraBeds">Camas Extras</Label>
              <Input
                id="numberOfExtraBeds"
                type="number"
                min={0}
                max={selectedAccommodation?.maxExtraBeds || 0}
                {...register('numberOfExtraBeds')}
              />
              {selectedAccommodation && (
                <p className="text-xs text-gray-500">
                  Máx: {selectedAccommodation.maxExtraBeds} (R${' '}
                  {Number(selectedAccommodation.extraBedPrice).toFixed(2)}/noite cada)
                </p>
              )}
            </div>
          </div>

          {/* Dados do Hóspede */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Dados do Hóspede</h3>

            <div className="space-y-2">
              <Label htmlFor="guestName">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="guestName"
                {...register('guestName', { required: 'Nome é obrigatório' })}
                placeholder="Nome completo do hóspede"
              />
              {errors.guestName && (
                <p className="text-sm text-red-500">{errors.guestName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestEmail">Email</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  {...register('guestEmail')}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestWhatsApp">
                  WhatsApp <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="guestWhatsApp"
                  {...register('guestWhatsApp', { required: 'WhatsApp é obrigatório' })}
                  placeholder="(00) 00000-0000"
                />
                {errors.guestWhatsApp && (
                  <p className="text-sm text-red-500">{errors.guestWhatsApp.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestPhone">Telefone</Label>
                <Input
                  id="guestPhone"
                  {...register('guestPhone')}
                  placeholder="(00) 0000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCpf">CPF</Label>
                <Input
                  id="guestCpf"
                  {...register('guestCpf')}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Solicitações Especiais</Label>
              <Textarea
                id="specialRequests"
                {...register('specialRequests')}
                placeholder="Ex: Cama extra, berço, andar alto, etc."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pagamento</Label>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                      <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Transferência Bancária</SelectItem>
                      <SelectItem value="CASH">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Resumo Financeiro */}
          {selectedAccommodation && numberOfNights > 0 && (
            <div className="pt-4 border-t space-y-2">
              <h3 className="font-semibold mb-3">Resumo Financeiro</h3>
              <div className="flex justify-between text-sm">
                <span>Subtotal ({numberOfNights} noites):</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {extraBedsCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Camas extras:</span>
                  <span>R$ {extraBedsCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Taxa de serviço (5%):</span>
                <span>R$ {serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Impostos (2%):</span>
                <span>R$ {taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>R$ {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createReservation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createReservation.isPending || numberOfNights <= 0}>
              {createReservation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar Reserva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
