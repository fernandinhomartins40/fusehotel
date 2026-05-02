import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { differenceInDays } from 'date-fns';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreateCustomerDialog } from '@/components/admin/customers/CreateCustomerDialog';
import { useCreateReservation } from '@/hooks/useReservations';
import { useAccommodations } from '@/hooks/useAccommodations';
import { Customer, useCustomers } from '@/hooks/useCustomers';
import { useCheckAvailability } from '@/hooks/useSchedule';
import { usePromotions } from '@/hooks/usePromotions';
import { usePricingPreview } from '@/hooks/usePricing';
import { cn } from '@/lib/utils';
import {
  Check,
  ChevronsUpDown,
  Info,
  Loader2,
  UserPlus,
} from 'lucide-react';

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
  userId: string;
  promotionId: string;
  specialRequests?: string;
  paymentMethod?: string;
}

const defaultValues: ReservationFormData = {
  accommodationId: '',
  checkInDate: '',
  checkOutDate: '',
  numberOfGuests: 1,
  numberOfExtraBeds: 0,
  userId: '',
  promotionId: '',
  specialRequests: '',
  paymentMethod: undefined,
};

export const CreateReservationDialog: React.FC<CreateReservationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [showCreateCustomerDialog, setShowCreateCustomerDialog] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<ReservationFormData>({
    defaultValues,
  });

  const createReservation = useCreateReservation();
  const { data: accommodations = [] } = useAccommodations({ adminView: true });
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers({
    role: 'CUSTOMER',
    isActive: true,
  });

  const { data: promotions = [] } = usePromotions({ isActive: true });

  const selectedAccommodationId = watch('accommodationId');
  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');
  const numberOfExtraBeds = watch('numberOfExtraBeds') || 0;
  const selectedCustomerId = watch('userId');
  const selectedPromotionId = watch('promotionId');

  const selectedAccommodation = accommodations.find(
    (accommodation: any) => accommodation.id === selectedAccommodationId
  );
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId);

  const numberOfNights =
    checkInDate && checkOutDate
      ? differenceInDays(new Date(checkOutDate), new Date(checkInDate))
      : 0;

  const { data: pricing, isLoading: isLoadingPricing } = usePricingPreview({
    accommodationId: selectedAccommodationId || '',
    checkInDate: checkInDate || '',
    checkOutDate: checkOutDate || '',
    numberOfExtraBeds,
    promotionId: selectedPromotionId || undefined,
  });

  const shouldCheckAvailability =
    Boolean(selectedAccommodationId) &&
    Boolean(checkInDate) &&
    Boolean(checkOutDate) &&
    numberOfNights > 0;
  const { data: availabilityCheck, isLoading: isCheckingAvailability } = useCheckAvailability(
    selectedAccommodationId || '',
    checkInDate || '',
    checkOutDate || ''
  );
  const isSelectedRangeUnavailable =
    shouldCheckAvailability && availabilityCheck?.isAvailable === false;
  const isAccommodationManuallyUnavailable = selectedAccommodation?.isAvailable === false;

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(defaultValues);
      clearErrors();
      setCustomerPickerOpen(false);
      setShowCreateCustomerDialog(false);
    }

    onOpenChange(nextOpen);
  };

  const handleCustomerSelect = (customer: Customer) => {
    setValue('userId', customer.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors('userId');
    setCustomerPickerOpen(false);
  };

  const onSubmit = async (data: ReservationFormData) => {
    if (numberOfNights <= 0) {
      return;
    }

    if (!selectedCustomer) {
      setError('userId', {
        type: 'manual',
        message: 'Selecione um cliente cadastrado para criar a reserva',
      });
      return;
    }

    if (!selectedCustomer.whatsapp) {
      setError('userId', {
        type: 'manual',
        message: 'O cliente selecionado precisa ter WhatsApp cadastrado',
      });
      return;
    }

    clearErrors('userId');

    await createReservation.mutateAsync({
      accommodationId: data.accommodationId,
      checkInDate: new Date(`${data.checkInDate}T14:00:00`).toISOString(),
      checkOutDate: new Date(`${data.checkOutDate}T12:00:00`).toISOString(),
      numberOfGuests: Number(data.numberOfGuests),
      numberOfExtraBeds: Number(data.numberOfExtraBeds) || 0,
      guestName: selectedCustomer.name,
      guestEmail: selectedCustomer.email || undefined,
      guestPhone: selectedCustomer.phone || undefined,
      guestWhatsApp: selectedCustomer.whatsapp,
      guestCpf: selectedCustomer.cpf || undefined,
      specialRequests: data.specialRequests?.trim() || undefined,
      promotionId: data.promotionId || undefined,
    });

    reset(defaultValues);
    setCustomerPickerOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Nova Reserva</DialogTitle>
            <DialogDescription>
              Crie uma nova reserva manualmente no sistema
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accommodationId">
                Acomodação <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="accommodationId"
                control={control}
                rules={{ required: 'Selecione uma acomodacao' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a acomodacao" />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInDate">
                  Check-in <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="checkInDate"
                  type="date"
                  {...register('checkInDate', { required: 'Data de check-in e obrigatoria' })}
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
                  {...register('checkOutDate', { required: 'Data de check-out e obrigatoria' })}
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

            {shouldCheckAvailability && isCheckingAvailability && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Verificando disponibilidade desta acomodacao na agenda central...
                </AlertDescription>
              </Alert>
            )}

            {isAccommodationManuallyUnavailable && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Esta acomodacao esta marcada como indisponível no cadastro e não pode receber novas reservas.
                </AlertDescription>
              </Alert>
            )}

            {isSelectedRangeUnavailable && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Esta acomodacao não esta disponivel para o período selecionado na agenda.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfGuests">
                  Numero de Hóspedes <span className="text-red-500">*</span>
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
                    Max: {selectedAccommodation.maxExtraBeds} (R$ {Number(selectedAccommodation.extraBedPrice).toFixed(2)}/noite cada)
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotionId">Promoção / Pacote</Label>
              <Controller
                name="promotionId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || 'none'} onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhuma promoção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma promoção</SelectItem>
                      {promotions.map((promo: any) => (
                        <SelectItem key={promo.id} value={promo.id}>
                          {promo.title}
                          {promo.discountPercent ? ` (-${promo.discountPercent}%)` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">Cliente da Reserva</h3>
                  <p className="text-sm text-gray-500">
                    Selecione um cliente cadastrado ou registre um novo cliente antes de continuar.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateCustomerDialog(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Cadastrar cliente
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">
                  Cliente <span className="text-red-500">*</span>
                </Label>
                <Popover open={customerPickerOpen} onOpenChange={setCustomerPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={customerPickerOpen}
                      className={cn(
                        'w-full justify-between',
                        !selectedCustomer && 'text-muted-foreground'
                      )}
                      disabled={isLoadingCustomers}
                    >
                      {selectedCustomer
                        ? `${selectedCustomer.name} - ${selectedCustomer.email}`
                        : isLoadingCustomers
                          ? 'Carregando clientes...'
                          : 'Selecione um cliente'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar por nome, email ou WhatsApp..." />
                      <CommandList>
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={[
                                customer.name,
                                customer.email,
                                customer.whatsapp || '',
                                customer.cpf || '',
                              ].join(' ')}
                              onSelect={() => handleCustomerSelect(customer)}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  customer.id === selectedCustomerId ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{customer.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {customer.email}
                                  {customer.whatsapp ? ` â€¢ ${customer.whatsapp}` : ' â€¢ Sem WhatsApp'}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.userId && (
                  <p className="text-sm text-red-500">{errors.userId.message}</p>
                )}
              </div>

              {selectedCustomer && (
                <div className="rounded-lg border bg-gray-50 p-4 text-sm">
                  <div className="font-medium text-gray-900">{selectedCustomer.name}</div>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <div>
                      <span className="text-gray-500">Email:</span> {selectedCustomer.email}
                    </div>
                    <div>
                      <span className="text-gray-500">WhatsApp:</span>{' '}
                      {selectedCustomer.whatsapp || 'Nao cadastrado'}
                    </div>
                    <div>
                      <span className="text-gray-500">Telefone:</span>{' '}
                      {selectedCustomer.phone || 'Nao cadastrado'}
                    </div>
                    <div>
                      <span className="text-gray-500">CPF:</span>{' '}
                      {selectedCustomer.cpf || 'Nao cadastrado'}
                    </div>
                  </div>
                </div>
              )}

              {selectedCustomer && !selectedCustomer.whatsapp && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    O cliente selecionado precisa ter WhatsApp cadastrado para criar a reserva.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Solicitacoes Especiais</Label>
                <Textarea
                  id="specialRequests"
                  {...register('specialRequests')}
                  placeholder="Ex: Cama extra, berco, andar alto, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Metodo de Pagamento</Label>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o metodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CREDIT_CARD">Cartao de Credito</SelectItem>
                        <SelectItem value="DEBIT_CARD">Cartao de Debito</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="BANK_TRANSFER">Transferencia Bancaria</SelectItem>
                        <SelectItem value="CASH">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {selectedAccommodation && numberOfNights > 0 && (
              <div className="space-y-2 border-t pt-4">
                <h3 className="mb-3 font-semibold">Resumo Financeiro</h3>
                {isLoadingPricing ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculando preços...
                  </div>
                ) : pricing ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({pricing.numberOfNights} noites x R$ {pricing.pricePerNight.toFixed(2)}):</span>
                      <span>R$ {pricing.subtotal.toFixed(2)}</span>
                    </div>
                    {pricing.extraBedsCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Camas extras:</span>
                        <span>R$ {pricing.extraBedsCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Taxa de serviço ({(pricing.serviceFeeRate * 100).toFixed(0)}%):</span>
                      <span>R$ {pricing.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Impostos ({(pricing.taxRate * 100).toFixed(0)}%):</span>
                      <span>R$ {pricing.taxes.toFixed(2)}</span>
                    </div>
                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-700">
                        <span>Desconto promocional:</span>
                        <span>- R$ {pricing.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>Total:</span>
                      <span>R$ {pricing.totalAmount.toFixed(2)}</span>
                    </div>
                  </>
                ) : null}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={createReservation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  createReservation.isPending ||
                  numberOfNights <= 0 ||
                  !selectedCustomer ||
                  !selectedCustomer.whatsapp ||
                  isAccommodationManuallyUnavailable ||
                  isCheckingAvailability ||
                  isSelectedRangeUnavailable
                }
              >
                {createReservation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Criar Reserva
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CreateCustomerDialog
        open={showCreateCustomerDialog}
        onOpenChange={setShowCreateCustomerDialog}
        hideRoleField
        defaultRole="CUSTOMER"
      />
    </>
  );
};


