import { useMemo, useState } from 'react';
import { AlertTriangle, BedSingle, ChevronDown, ConciergeBell, Loader2, Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useFrontdeskDashboard, useStays } from '@/hooks/useFrontdesk';
import { usePOSProducts } from '@/hooks/usePOS';
import { useRoomUnits } from '@/hooks/useRoomUnits';
import {
  useDeleteRoomServiceConfiguration,
  useRoomServiceConfigurations,
  useUpsertRoomServiceConfiguration,
} from '@/hooks/useRoomService';
import type { POSProduct, RoomServiceConfiguration, RoomServiceConfigType } from '@/types/pms';

const sourceLabels: Record<RoomServiceConfigType, string> = {
  MINIBAR: 'Frigobar',
  IN_ROOM: 'No quarto',
};

const sourceOrder: RoomServiceConfigType[] = ['MINIBAR', 'IN_ROOM'];

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function RoomService() {
  const { data: roomUnits = [], isLoading: roomUnitsLoading } = useRoomUnits();
  const { data: products = [], isLoading: productsLoading } = usePOSProducts();
  const { data: dashboard } = useFrontdeskDashboard();
  const { data: stays = [] } = useStays();
  const [selectedRoomUnitId, setSelectedRoomUnitId] = useState('');
  const [expandedConfiguredRoomId, setExpandedConfiguredRoomId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    productId: '',
    configType: 'MINIBAR' as RoomServiceConfigType,
    quantity: '1',
    notes: '',
  });

  const { data: configurations = [], isLoading: configurationsLoading } = useRoomServiceConfigurations(
    selectedRoomUnitId || undefined
  );
  const { data: allConfigurations = [] } = useRoomServiceConfigurations();
  const upsertConfiguration = useUpsertRoomServiceConfiguration();
  const deleteConfiguration = useDeleteRoomServiceConfiguration();

  const availableProducts = useMemo(() => products.filter((product) => product.isActive), [products]);

  const selectedRoom = useMemo(
    () => roomUnits.find((room) => room.id === selectedRoomUnitId) ?? null,
    [roomUnits, selectedRoomUnitId]
  );

  const configuredRooms = useMemo(() => {
    const grouped = new Map<
      string,
      {
        roomUnit: RoomServiceConfiguration['roomUnit'];
        items: RoomServiceConfiguration[];
      }
    >();

    allConfigurations.forEach((item) => {
      const current = grouped.get(item.roomUnitId);
      if (current) {
        current.items.push(item);
        return;
      }

      grouped.set(item.roomUnitId, {
        roomUnit: item.roomUnit,
        items: [item],
      });
    });

    return Array.from(grouped.values())
      .map((group) => ({
        ...group,
        items: [...group.items].sort((left, right) => left.product.name.localeCompare(right.product.name, 'pt-BR')),
      }))
      .sort((left, right) => left.roomUnit.code.localeCompare(right.roomUnit.code, 'pt-BR', { numeric: true }));
  }, [allConfigurations]);

  const pendingConferenceStays = useMemo(() => {
    const configuredRoomIds = new Set(allConfigurations.map((item) => item.roomUnitId));
    return stays.filter(
      (stay) =>
        stay.status === 'IN_HOUSE' &&
        stay.roomUnitId &&
        configuredRoomIds.has(stay.roomUnitId) &&
        !stay.roomServiceConferenceAt
    );
  }, [allConfigurations, stays]);

  const summary = useMemo(
    () => ({
      roomsWithItems: configuredRooms.length,
      minibarItems: allConfigurations.filter((item) => item.configType === 'MINIBAR').length,
      inRoomItems: allConfigurations.filter((item) => item.configType === 'IN_ROOM').length,
      dndAlerts: dashboard?.alerts.length ?? 0,
    }),
    [allConfigurations, configuredRooms.length, dashboard?.alerts]
  );

  const openCreateDialog = () => {
    setForm({
      productId: availableProducts[0]?.id ?? '',
      configType: 'MINIBAR',
      quantity: '1',
      notes: '',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedRoomUnitId || !form.productId) return;

    upsertConfiguration.mutate(
      {
        roomUnitId: selectedRoomUnitId,
        productId: form.productId,
        configType: form.configType,
        quantity: Number(form.quantity) || 1,
        notes: form.notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Serviço de quarto</h1>
            <p className="text-sm text-muted-foreground">
              Defina o que fica no frigobar ou no quarto, o que o hóspede pode pedir e o que deve ser conferido no checkout.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <ConciergeBell className="mr-2 h-4 w-4" />
              Catálogo do hóspede usa os produtos habilitados no PDV
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <BedSingle className="h-5 w-5 text-slate-500" />
              <div>
                <div className="text-2xl font-bold">{summary.roomsWithItems}</div>
                <div className="text-xs text-muted-foreground">Quartos com itens configurados</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{summary.minibarItems}</div>
              <div className="text-xs text-muted-foreground">Itens de frigobar</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{summary.inRoomItems}</div>
              <div className="text-xs text-muted-foreground">Itens no quarto</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{summary.dndAlerts}</div>
              <div className="text-xs text-muted-foreground">Alertas de não perturbe</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <CardTitle>Configuração por quarto</CardTitle>
                <CardDescription>
                  Escolha o quarto, monte a lista de itens e use a lista lateral para revisar os quartos já configurados.
                </CardDescription>
              </div>
              <div className="flex w-full flex-col gap-2 md:w-80">
                <Label>Quarto</Label>
                <Select value={selectedRoomUnitId} onValueChange={setSelectedRoomUnitId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um quarto" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomUnits.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.code} · {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRoom ? (
                <div className="rounded-xl border bg-slate-50 p-4 text-sm">
                  <div className="font-medium">
                    Quarto {selectedRoom.code} · {selectedRoom.name}
                  </div>
                  <div className="text-muted-foreground">
                    {selectedRoom.accommodation?.name ?? 'Sem categoria vinculada'}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Selecione um quarto para configurar frigobar e itens de serviço.
                </div>
              )}

              {selectedRoom && (
                <div className="flex justify-end">
                  <Button onClick={openCreateDialog} disabled={!availableProducts.length}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar item
                  </Button>
                </div>
              )}

              {configurationsLoading || roomUnitsLoading || productsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : configurations.length > 0 ? (
                <div className="rounded-xl border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Observações</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {configurations.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge variant="outline">{sourceLabels[item.configType]}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-xs text-muted-foreground">{item.product.category.label}</div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{currency.format(Number(item.product.price))}</TableCell>
                          <TableCell className="max-w-56 text-sm text-muted-foreground">
                            {item.notes || '—'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteConfiguration.mutate(item.id)}
                              disabled={deleteConfiguration.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : selectedRoom ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Nenhum item configurado para este quarto.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quartos configurados</CardTitle>
                <CardDescription>
                  Expanda cada quarto para ver onde fica cada item e o respectivo conteúdo configurado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {configuredRooms.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Nenhum quarto configurado ainda.</div>
                ) : (
                  configuredRooms.map((group) => {
                    const isExpanded = expandedConfiguredRoomId === group.roomUnit.id;

                    return (
                      <Collapsible
                        key={group.roomUnit.id}
                        open={isExpanded}
                        onOpenChange={(open) => setExpandedConfiguredRoomId(open ? group.roomUnit.id : null)}
                      >
                        <div className="overflow-hidden rounded-xl border">
                          <CollapsibleTrigger asChild>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between gap-3 bg-white p-4 text-left transition hover:bg-slate-50"
                            >
                              <div className="min-w-0">
                                <div className="font-medium">
                                  Quarto {group.roomUnit.code} · {group.roomUnit.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {group.roomUnit.accommodation?.name ?? 'Sem categoria'} · {group.items.length} itens configurados
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setSelectedRoomUnitId(group.roomUnit.id);
                                  }}
                                >
                                  Selecionar
                                </Button>
                                <ChevronDown
                                  className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                />
                              </div>
                            </button>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="border-t bg-slate-50/80">
                            <div className="space-y-4 p-4">
                              {sourceOrder.map((sourceType) => (
                                <RoomConfigBucket
                                  key={`${group.roomUnit.id}-${sourceType}`}
                                  title={sourceLabels[sourceType]}
                                  items={group.items.filter((item) => item.configType === sourceType)}
                                  emptyLabel={
                                    sourceType === 'MINIBAR'
                                      ? 'Nenhum item configurado no frigobar.'
                                      : 'Nenhum item configurado diretamente no quarto.'
                                  }
                                />
                              ))}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conferências pendentes</CardTitle>
                <CardDescription>
                  Hospedagens ativas que ainda precisam de conferência do quarto antes do checkout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingConferenceStays.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Nenhuma conferência pendente.</div>
                ) : (
                  pendingConferenceStays.map((stay) => (
                    <div key={stay.id} className="rounded-xl border p-3">
                      <div className="font-medium">{stay.reservation.guestName}</div>
                      <div className="text-sm text-muted-foreground">
                        Quarto {stay.roomUnit?.code || '—'} · checkout em{' '}
                        {new Date(stay.reservation.checkOutDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas de não perturbe</CardTitle>
                <CardDescription>
                  Quartos com manutenção e governança bloqueadas pelo hóspede.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard?.alerts.length ? (
                  dashboard.alerts.map((alert) => (
                    <div key={alert.stayId} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                        <div className="min-w-0">
                          <div className="font-medium text-amber-900">
                            Quarto {alert.roomCode || '—'} · {alert.guestName}
                          </div>
                          <div className="text-sm text-amber-700">
                            {alert.note || 'O hóspede marcou o quarto como não perturbe.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">Nenhum alerta ativo.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar item ao quarto</DialogTitle>
              <DialogDescription>
                Defina se o item fica no frigobar ou disponível no quarto para conferência no checkout.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Produto</Label>
                <Select
                  value={form.productId}
                  onValueChange={(value) => setForm((current) => ({ ...current, productId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product: POSProduct) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} · {currency.format(Number(product.price))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Onde fica</Label>
                  <Select
                    value={form.configType}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, configType: value as RoomServiceConfigType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MINIBAR">Frigobar</SelectItem>
                      <SelectItem value="IN_ROOM">No quarto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantidade padrão</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  rows={3}
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  placeholder="Ex.: repor diariamente, verificar validade, item lacrado..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={upsertConfiguration.isPending || !form.productId}>
                  Salvar item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function RoomConfigBucket({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: RoomServiceConfiguration[];
  emptyLabel: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{title}</div>
        <Badge variant="secondary">{items.length} itens</Badge>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white px-3 py-4 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium">{item.product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.product.category.label} · {currency.format(Number(item.product.price))}
                  </div>
                </div>
                <Badge variant="outline">Qtd. {item.quantity}</Badge>
              </div>
              {item.notes ? <div className="mt-2 text-sm text-muted-foreground">{item.notes}</div> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
