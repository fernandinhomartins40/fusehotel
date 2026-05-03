import { useEffect, useMemo, useState } from 'react';
import { differenceInDays } from 'date-fns';
import { AlertTriangle, ConciergeBell, Loader2, Minus, Plus, ShieldOff, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateRoomServiceOrder,
  useMyRoomServiceOrders,
  useMyRoomServiceStay,
  useRoomServiceCatalog,
  useToggleDoNotDisturb,
} from '@/hooks/useRoomService';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const orderStatusLabels: Record<string, string> = {
  OPEN: 'Aberto',
  PREPARING: 'Em preparo',
  DELIVERED: 'Entregue',
  CLOSED: 'Fechado',
  CANCELLED: 'Cancelado',
};

export function RoomServiceTab() {
  const { data: stay, isLoading: stayLoading } = useMyRoomServiceStay();
  const { data: catalog = [], isLoading: catalogLoading } = useRoomServiceCatalog();
  const { data: orders = [], isLoading: ordersLoading } = useMyRoomServiceOrders();
  const createOrder = useCreateRoomServiceOrder();
  const toggleDoNotDisturb = useToggleDoNotDisturb();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dndEnabled, setDndEnabled] = useState(false);
  const [dndNote, setDndNote] = useState('');
  const [cart, setCart] = useState<Record<string, { quantity: number; notes: string }>>({});
  const [generalNote, setGeneralNote] = useState('');

  const categories = useMemo(() => {
    const unique = new Map<string, string>();
    catalog.forEach((product) => unique.set(product.categoryId, product.category.label));
    return Array.from(unique.entries());
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    return catalog.filter((product) => {
      const matchesCategory = selectedCategory === 'ALL' || product.categoryId === selectedCategory;
      const haystack = [product.name, product.description, product.category.label].filter(Boolean).join(' ').toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [catalog, search, selectedCategory]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, item]) => item.quantity > 0)
        .map(([productId, item]) => {
          const product = catalog.find((entry) => entry.id === productId);
          return product
            ? {
                product,
                quantity: item.quantity,
                notes: item.notes,
                total: Number(product.price) * item.quantity,
              }
            : null;
        })
        .filter(Boolean),
    [cart, catalog]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item?.total ?? 0), 0),
    [cartItems]
  );

  const currentNight = useMemo(() => {
    if (!stay) return null;
    return Math.max(1, differenceInDays(new Date(), new Date(stay.reservation.checkInDate)) + 1);
  }, [stay]);

  useEffect(() => {
    if (stay) {
      setDndEnabled(Boolean(stay.doNotDisturb));
      setDndNote(stay.doNotDisturbNote ?? '');
    }
  }, [stay]);

  const updateQuantity = (productId: string, delta: number) => {
    setCart((current) => {
      const nextQuantity = Math.max(0, Number(current[productId]?.quantity ?? 0) + delta);
      return {
        ...current,
        [productId]: {
          quantity: nextQuantity,
          notes: current[productId]?.notes ?? '',
        },
      };
    });
  };

  const updateProductNotes = (productId: string, notes: string) => {
    setCart((current) => ({
      ...current,
      [productId]: {
        quantity: Math.max(1, Number(current[productId]?.quantity ?? 1)),
        notes,
      },
    }));
  };

  const handleSubmitOrder = () => {
    if (!cartItems.length) return;

    createOrder.mutate(
      {
        items: cartItems.map((item) => ({
          productId: item!.product.id,
          quantity: item!.quantity,
          notes: item!.notes || undefined,
        })),
        notes: generalNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          setCart({});
          setGeneralNote('');
        },
      }
    );
  };

  const handleSaveDnd = () => {
    toggleDoNotDisturb.mutate({
      enabled: dndEnabled,
      note: dndNote.trim() || undefined,
    });
  };

  if (stayLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!stay) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <ShieldOff className="mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Nenhuma hospedagem ativa</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            O serviço de quarto e o modo não perturbe ficam disponíveis apenas durante a hospedagem.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Meu quarto</CardTitle>
            <CardDescription>
              Quarto {stay.roomUnit?.code || '—'} · {stay.roomUnit?.name || 'Sem identificação'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Reserva</div>
              <div className="mt-2 text-base font-semibold">{stay.reservation.reservationCode}</div>
            </div>
            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Estadia</div>
              <div className="mt-2 text-base font-semibold">
                Noite {currentNight} de {differenceInDays(new Date(stay.reservation.checkOutDate), new Date(stay.reservation.checkInDate))}
              </div>
            </div>
            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Conta atual</div>
              <div className="mt-2 text-base font-semibold">
                {currency.format(Number(stay.folio?.balance ?? 0))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Não perturbe</CardTitle>
            <CardDescription>
              Bloqueia governança e manutenção enquanto esta sinalização estiver ativa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <div className="font-medium">Ativar no quarto</div>
                <div className="text-sm text-muted-foreground">
                  O hotel receberá um alerta enquanto estiver ligado.
                </div>
              </div>
              <Switch checked={dndEnabled} onCheckedChange={setDndEnabled} />
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Textarea
                value={dndNote}
                onChange={(event) => setDndNote(event.target.value)}
                rows={3}
                placeholder="Ex.: bebê dormindo, reunião no quarto, retornar após 14h..."
              />
            </div>
            {stay.doNotDisturb && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <div>O hotel está vendo este quarto como não perturbe.</div>
                </div>
              </div>
            )}
            <Button className="w-full" onClick={handleSaveDnd} disabled={toggleDoNotDisturb.isPending}>
              Salvar sinalização
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Catálogo de quarto</CardTitle>
            <CardDescription>
              Solicite produtos e serviços. O pedido vai para o hotel e o valor entra na sua conta da hospedagem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar item, produto ou serviço"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as categorias</SelectItem>
                  {categories.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {catalogLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredCatalog.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredCatalog.map((product) => {
                  const quantity = cart[product.id]?.quantity ?? 0;
                  return (
                    <div key={product.id} className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.category.label}</div>
                        </div>
                        <Badge variant="outline">{currency.format(Number(product.price))}</Badge>
                      </div>
                      {product.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                      )}
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(product.id, -1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="w-12 text-center font-semibold">{quantity}</div>
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(product.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {quantity > 0 && (
                        <div className="mt-3 space-y-2">
                          <Label className="text-xs">Observação do item</Label>
                          <Input
                            value={cart[product.id]?.notes ?? ''}
                            onChange={(event) => updateProductNotes(product.id, event.target.value)}
                            placeholder="Ex.: sem gelo, entregar após 20h..."
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Nenhum item disponível para o serviço de quarto.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedido atual</CardTitle>
            <CardDescription>Monte o pedido e envie para o hotel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.length > 0 ? (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item!.product.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">{item!.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item!.quantity} × {currency.format(Number(item!.product.price))}
                        </div>
                      </div>
                      <div className="font-semibold">{currency.format(item!.total)}</div>
                    </div>
                    {item!.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">{item!.notes}</div>
                    )}
                  </div>
                ))}
                <div className="space-y-2">
                  <Label>Observação geral</Label>
                  <Textarea
                    value={generalNote}
                    onChange={(event) => setGeneralNote(event.target.value)}
                    rows={3}
                    placeholder="Ex.: entregar junto, bater à porta, levar na varanda..."
                  />
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total estimado</span>
                    <span className="text-lg font-semibold">{currency.format(cartTotal)}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={handleSubmitOrder} disabled={createOrder.isPending}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Solicitar ao hotel
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Selecione os itens desejados para montar o pedido.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus pedidos</CardTitle>
          <CardDescription>Histórico de solicitações feitas durante a hospedagem.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="rounded-xl border p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium">{order.orderNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{orderStatusLabels[order.status] || order.status}</Badge>
                    <Badge>{currency.format(Number(order.totalAmount))}</Badge>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span>
                        {item.quantity} × {item.productName}
                      </span>
                      <span>{currency.format(Number(item.totalPrice))}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">Nenhum pedido enviado nesta hospedagem.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
