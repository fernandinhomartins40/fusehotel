import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useConfirmRoomServiceConference, useRoomServiceConferencePreview } from '@/hooks/useRoomService';

interface RoomConferenceTabProps {
  stayId: string;
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const sourceLabels = {
  MINIBAR: 'Frigobar',
  IN_ROOM: 'No quarto',
};

export function RoomConferenceTab({ stayId }: RoomConferenceTabProps) {
  const { data, isLoading } = useRoomServiceConferencePreview(stayId);
  const confirmConference = useConfirmRoomServiceConference(stayId);
  const [notes, setNotes] = useState('');
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const hasConfigurations = (data?.items.length ?? 0) > 0;

  const submissionItems = useMemo(
    () =>
      (data?.items ?? []).map((item) => ({
        productId: item.product.id,
        configurationId: item.id,
        source: item.configType,
        quantity: Number(quantities[item.id] ?? 0),
      })),
    [data?.items, quantities]
  );

  const hasCharge = submissionItems.some((item) => item.quantity > 0);

  const handleSubmit = () => {
    confirmConference.mutate({
      items: submissionItems,
      notes: notes.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || !hasConfigurations) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        Este quarto não possui itens configurados para conferência.
      </div>
    );
  }

  return (
    <ScrollArea className="h-full mt-3">
      <div className="space-y-4">
        {data.stay.conferenceCompletedAt && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Conferência anterior registrada em{' '}
            {new Date(data.stay.conferenceCompletedAt).toLocaleString('pt-BR')}.
          </div>
        )}

        {data.items.map((item) => (
          <div key={item.id} className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {sourceLabels[item.configType]} · configurado: {item.configuredQuantity} · já lançado:{' '}
                  {item.alreadyChargedQuantity}
                </div>
              </div>
              <div className="font-semibold">{currency.format(Number(item.product.price))}</div>
            </div>

            <div className="mt-3 space-y-2">
              <Label>Quantidade consumida agora</Label>
              <Input
                type="number"
                min="0"
                value={quantities[item.id] ?? ''}
                onChange={(event) =>
                  setQuantities((current) => ({
                    ...current,
                    [item.id]: event.target.value,
                  }))
                }
                placeholder="0"
              />
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <Label>Observações da conferência</Label>
          <Textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ex.: frigobar intacto, duas águas consumidas, item do quarto sem uso..."
          />
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={confirmConference.isPending}>
          {hasCharge ? 'Lançar consumos e concluir conferência' : 'Concluir conferência sem consumo'}
        </Button>
      </div>
    </ScrollArea>
  );
}
