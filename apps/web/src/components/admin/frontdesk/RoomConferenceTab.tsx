import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useConfirmRoomServiceConference, useRoomServiceConferencePreview } from '@/hooks/useRoomService';
import type { RoomConditionStatus } from '@/types/pms';

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

const roomConditionLabels: Record<RoomConditionStatus, string> = {
  APPROVED: 'Quarto aprovado para saída',
  NEEDS_ATTENTION: 'Quarto com ajustes necessários',
  DAMAGE_REPORTED: 'Quarto com avaria identificada',
};

const checklistLabels = {
  minibarChecked: 'Frigobar conferido',
  bathroomChecked: 'Banheiro conferido',
  linensChecked: 'Enxoval conferido',
  furnitureChecked: 'Mobiliário conferido',
  electronicsChecked: 'Equipamentos conferidos',
  visualInspectionChecked: 'Inspeção visual finalizada',
} as const;

type ChecklistState = Record<keyof typeof checklistLabels, boolean>;

const defaultChecklist: ChecklistState = {
  minibarChecked: false,
  bathroomChecked: false,
  linensChecked: false,
  furnitureChecked: false,
  electronicsChecked: false,
  visualInspectionChecked: false,
};

export function RoomConferenceTab({ stayId }: RoomConferenceTabProps) {
  const { data, isLoading } = useRoomServiceConferencePreview(stayId);
  const confirmConference = useConfirmRoomServiceConference(stayId);
  const [notes, setNotes] = useState('');
  const [roomConditionNotes, setRoomConditionNotes] = useState('');
  const [roomConditionStatus, setRoomConditionStatus] = useState<RoomConditionStatus>('APPROVED');
  const [releaseCheckout, setReleaseCheckout] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [checklist, setChecklist] = useState<ChecklistState>(defaultChecklist);

  useEffect(() => {
    if (!data) return;

    setNotes(data.stay.conferenceNotes ?? '');
    setRoomConditionNotes(data.stay.roomConditionConferenceNotes ?? '');
    setRoomConditionStatus(data.stay.roomConditionStatus ?? 'APPROVED');
    setReleaseCheckout(Boolean(data.stay.checkoutReleasedAt));
    setChecklist({
      ...defaultChecklist,
      ...(data.stay.roomConditionChecklist ?? {}),
    });
  }, [data]);

  const hasConfigurations = (data?.items.length ?? 0) > 0;
  const isChecklistComplete = Object.values(checklist).every(Boolean);

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
      roomConditionStatus,
      roomConditionNotes: roomConditionNotes.trim() || undefined,
      roomConditionChecklist: checklist,
      releaseCheckout,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        Não foi possível carregar a conferência do checkout.
      </div>
    );
  }

  return (
    <ScrollArea className="mt-3 h-full">
      <div className="space-y-4">
        {data.stay.checkoutReleasedAt ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Checkout liberado em {new Date(data.stay.checkoutReleasedAt).toLocaleString('pt-BR')}.
          </div>
        ) : null}

        <div className="rounded-xl border bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">Conferência de itens do quarto</div>
              <div className="text-sm text-muted-foreground">
                Lance somente o que foi efetivamente consumido pelo hóspede.
              </div>
            </div>
            {!hasConfigurations ? <Badge variant="outline">Sem itens configurados</Badge> : null}
          </div>
        </div>

        {hasConfigurations ? (
          data.items.map((item) => (
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
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            Este quarto não possui itens configurados para cobrança automática no checkout.
          </div>
        )}

        <div className="rounded-xl border p-4">
          <div className="font-medium">Conferência do estado do quarto</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Marque todos os pontos verificados antes de liberar a saída no sistema.
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(checklistLabels).map(([key, label]) => (
              <label key={key} className="flex items-start gap-3 rounded-lg border p-3">
                <Checkbox
                  checked={checklist[key as keyof ChecklistState]}
                  onCheckedChange={(checked) =>
                    setChecklist((current) => ({
                      ...current,
                      [key]: checked === true,
                    }))
                  }
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <Label>Parecer do estado do quarto</Label>
            <div className="grid gap-2">
              {(['APPROVED', 'NEEDS_ATTENTION', 'DAMAGE_REPORTED'] as RoomConditionStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setRoomConditionStatus(status)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    roomConditionStatus === status
                      ? status === 'APPROVED'
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-amber-300 bg-amber-50'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-medium">{roomConditionLabels[status]}</div>
                  <div className="text-xs text-muted-foreground">
                    {status === 'APPROVED'
                      ? 'Quarto segue o fluxo normal para limpeza pós-saída.'
                      : status === 'NEEDS_ATTENTION'
                        ? 'Será criado apontamento para ajuste/manutenção.'
                        : 'Será criado apontamento de avaria com prioridade alta.'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Observações do estado do quarto</Label>
            <Textarea
              rows={3}
              value={roomConditionNotes}
              onChange={(event) => setRoomConditionNotes(event.target.value)}
              placeholder="Ex.: luminária quebrada, enxoval completo, banheiro em bom estado, minibar sem divergências..."
            />
          </div>
        </div>

        <div className="space-y-2 rounded-xl border p-4">
          <div className="flex items-start gap-3">
            <Checkbox checked={releaseCheckout} onCheckedChange={(checked) => setReleaseCheckout(checked === true)} />
            <div>
              <div className="font-medium">Liberar checkout no sistema</div>
              <div className="text-sm text-muted-foreground">
                Somente após essa liberação a recepção conseguirá concluir a saída do hóspede.
              </div>
            </div>
          </div>

          {!isChecklistComplete ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Finalize a conferência de todos os pontos do quarto antes de liberar o checkout.
            </div>
          ) : null}

          {roomConditionStatus !== 'APPROVED' ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <span>
                  O sistema vai registrar apontamento para manutenção junto com a liberação do checkout.
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
                <span>Quarto aprovado para seguir o fluxo normal de limpeza pós-saída.</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Observações gerais da conferência</Label>
          <Textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ex.: conferência final feita com a governança, itens cobrados na conta, manutenção acionada..."
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={
            confirmConference.isPending ||
            !isChecklistComplete ||
            !releaseCheckout ||
            (roomConditionStatus !== 'APPROVED' && !roomConditionNotes.trim())
          }
        >
          {hasCharge ? 'Lançar consumos e liberar checkout' : 'Concluir conferência e liberar checkout'}
        </Button>
      </div>
    </ScrollArea>
  );
}
