import { useMemo, useState } from 'react';
import { differenceInDays } from 'date-fns';
import { Banknote, LogOut, Mail, Phone, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAddFolioEntry, useFolio } from '@/hooks/useFolios';
import { useCheckOut } from '@/hooks/useFrontdesk';
import type { FolioEntryType, Stay } from '@/types/pms';
import { ConsumeTab } from './ConsumeTab';
import { HistoryTab } from './HistoryTab';
import { RoomConferenceTab } from './RoomConferenceTab';

interface GuestSheetProps {
  stay: Stay | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const entryTypeLabels: Record<FolioEntryType, string> = {
  DAILY_RATE: 'Diaria',
  EXTRA_BED: 'Cama extra',
  SERVICE_FEE: 'Taxa',
  TAX: 'Imposto',
  DISCOUNT: 'Desconto',
  PAYMENT: 'Pagamento',
  REFUND: 'Reembolso',
  ROOM_SERVICE: 'Room service',
  POS: 'PDV',
  ADJUSTMENT: 'Ajuste',
};

export function GuestSheet({ stay, open, onOpenChange }: GuestSheetProps) {
  const { data: folio } = useFolio(stay?.id);
  const addFolioEntry = useAddFolioEntry();
  const checkOut = useCheckOut();

  const [entryAmount, setEntryAmount] = useState('');
  const [entryDescription, setEntryDescription] = useState('');
  const [entryType, setEntryType] = useState<'PAYMENT' | 'ROOM_SERVICE' | 'ADJUSTMENT'>('PAYMENT');

  const folioSummary = useMemo(() => {
    if (!folio) return { charges: 0, credits: 0 };
    return folio.entries.reduce(
      (acc, entry) => {
        if (Number(entry.amount) >= 0) {
          acc.charges += Number(entry.amount);
        } else {
          acc.credits += Math.abs(Number(entry.amount));
        }
        return acc;
      },
      { charges: 0, credits: 0 }
    );
  }, [folio]);

  if (!stay) return null;

  const reservation = stay.reservation;
  const balance = Number(folio?.balance ?? stay.folio?.balance ?? 0);
  const checkoutReleased = Boolean(stay.checkoutReleasedAt);
  const currentNight = Math.max(differenceInDays(new Date(), new Date(reservation.checkInDate)), 0) + 1;
  const totalNights = reservation.numberOfNights ?? 0;
  const guest = (reservation as any).user;

  const handleAddEntry = () => {
    if (!folio || !entryAmount || !entryDescription) return;

    addFolioEntry.mutate(
      {
        folioId: folio.id,
        payload: {
          type: entryType,
          source: 'MANUAL',
          description: entryDescription,
          amount: entryType === 'PAYMENT' ? -Math.abs(Number(entryAmount)) : Math.abs(Number(entryAmount)),
        },
      },
      {
        onSuccess: () => {
          setEntryAmount('');
          setEntryDescription('');
        },
      }
    );
  };

  const handleCheckOut = () => {
    checkOut.mutate(
      { stayId: stay.id },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="text-xl">{reservation.guestName}</SheetTitle>
          <SheetDescription className="space-y-1">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-mono">{reservation.reservationCode}</span>
              <span>{stay.roomUnit?.code ? `Quarto ${stay.roomUnit.code}` : 'Sem quarto'}</span>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">Noites</div>
              <div className="mt-1 text-lg font-semibold">{currentNight}/{totalNights}</div>
            </div>
            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">Saldo</div>
              <div className={`mt-1 text-lg font-semibold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {currencyFormatter.format(balance)}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
            {(reservation.guestEmail || guest?.email) && (
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {reservation.guestEmail || guest?.email}
              </div>
            )}
            {(reservation.guestWhatsApp || reservation.guestPhone || guest?.whatsapp || guest?.phone) && (
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {reservation.guestWhatsApp || reservation.guestPhone || guest?.whatsapp || guest?.phone}
              </div>
            )}
            {(reservation.guestCpf || guest?.cpf) && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {reservation.guestCpf || guest?.cpf}
              </div>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-500">
            {(reservation as any).accommodation?.name} &bull;{' '}
            {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')} -{' '}
            {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
          </div>
          {stay.doNotDisturb && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Quarto marcado como não perturbe.
              {stay.doNotDisturbNote ? ` ${stay.doNotDisturbNote}` : ''}
            </div>
          )}
          {!checkoutReleased && (
            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
              O checkout só pode ser concluído depois da conferência dos itens e do estado do quarto.
            </div>
          )}
          {stay.roomConditionStatus && stay.roomConditionStatus !== 'APPROVED' && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Este quarto saiu da conferência com apontamento de manutenção. A saída pode ser concluída, mas o quarto seguirá bloqueado no operacional.
            </div>
          )}
        </div>

        <Separator />

        <Tabs defaultValue="conta" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-6 mt-3 h-auto flex-wrap rounded-2xl bg-slate-100 p-1">
            <TabsTrigger value="conta" className="rounded-xl px-4 py-2">
              Conta
            </TabsTrigger>
            <TabsTrigger value="consumo" className="rounded-xl px-4 py-2">
              Consumo
            </TabsTrigger>
            <TabsTrigger value="conferencia" className="rounded-xl px-4 py-2">
              Conferência
            </TabsTrigger>
            <TabsTrigger value="acoes" className="rounded-xl px-4 py-2">
              Ações
            </TabsTrigger>
            <TabsTrigger value="historico" className="rounded-xl px-4 py-2">
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conta" className="flex-1 overflow-hidden mt-0 px-6 pb-6">
            <ScrollArea className="h-full mt-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="text-[11px] uppercase tracking-wider text-slate-500">Debitos</div>
                    <div className="mt-1 text-base font-semibold">{currencyFormatter.format(folioSummary.charges)}</div>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="text-[11px] uppercase tracking-wider text-slate-500">Creditos</div>
                    <div className="mt-1 text-base font-semibold">{currencyFormatter.format(folioSummary.credits)}</div>
                  </div>
                </div>

                {!folio ? (
                  <div className="text-center text-sm text-gray-500 py-6">Carregando conta...</div>
                ) : !folio.entries.length ? (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                    Nenhum lançamento encontrado.
                  </div>
                ) : (
                  folio.entries.map((entry) => {
                    const isCredit = Number(entry.amount) < 0;
                    return (
                      <div key={entry.id} className="rounded-xl border p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 text-sm">{entry.description}</div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              {entryTypeLabels[entry.type]} &bull; {new Date(entry.postedAt).toLocaleString('pt-BR')}
                            </div>
                          </div>
                          <div className={`shrink-0 text-sm font-semibold ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {currencyFormatter.format(Number(entry.amount))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="consumo" className="flex-1 overflow-hidden mt-0 px-6 pb-6">
            {folio ? (
              <ConsumeTab folioId={folio.id} />
            ) : (
              <div className="flex items-center justify-center py-12 text-gray-500">
                Carregando conta...
              </div>
            )}
          </TabsContent>

          <TabsContent value="conferencia" className="flex-1 overflow-hidden mt-0 px-6 pb-6">
            <RoomConferenceTab stayId={stay.id} />
          </TabsContent>

          <TabsContent value="acoes" className="flex-1 overflow-hidden mt-0 px-6 pb-6">
            <ScrollArea className="h-full mt-3">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Registrar na conta</h4>
                  <div className="flex gap-2">
                    {(['PAYMENT', 'ROOM_SERVICE', 'ADJUSTMENT'] as const).map((type) => (
                      <Button
                        key={type}
                        type="button"
                        size="sm"
                        variant={entryType === type ? 'default' : 'outline'}
                        onClick={() => {
                          setEntryType(type);
                          setEntryDescription(
                            type === 'PAYMENT'
                              ? 'Pagamento recebido na recepcao'
                              : type === 'ROOM_SERVICE'
                                ? 'Consumo lancado pela recepcao'
                                : 'Ajuste manual da conta'
                          );
                        }}
                      >
                        {type === 'PAYMENT' ? 'Pagamento' : type === 'ROOM_SERVICE' ? 'Consumo' : 'Ajuste'}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entryAmount}
                      onChange={(e) => setEntryAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descricao</Label>
                    <Textarea
                      value={entryDescription}
                      onChange={(e) => setEntryDescription(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleAddEntry}
                    disabled={addFolioEntry.isPending || !entryAmount || !entryDescription}
                  >
                    <Banknote className="mr-2 h-4 w-4" />
                    {entryType === 'PAYMENT' ? 'Registrar pagamento' : entryType === 'ROOM_SERVICE' ? 'Registrar consumo' : 'Registrar ajuste'}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Operações</h4>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleCheckOut}
                    disabled={checkOut.isPending || balance > 0 || !checkoutReleased}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Fazer check-out
                  </Button>

                  {!checkoutReleased && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                      Abra a aba <strong>Conferência</strong>, registre os consumos do quarto, avalie o estado do ambiente e libere o checkout no sistema.
                    </div>
                  )}

                  {balance > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                      Hóspede tem saldo pendente de {currencyFormatter.format(balance)}. Registre o pagamento antes do check-out.
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="historico" className="flex-1 overflow-hidden mt-0 px-6 pb-6">
            <HistoryTab userId={guest?.id} currentStayId={stay.id} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
