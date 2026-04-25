import { useMemo, useState } from 'react';
import {
  BarChart3,
  BedDouble,
  ChefHat,
  ClipboardCheck,
  ConciergeBell,
  Receipt,
  ShoppingCart,
  Wallet,
  Wrench,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAdminReservations } from '@/hooks/useAdminReservations';
import { useAddFolioEntry, useFolio } from '@/hooks/useFolios';
import { useCheckIn, useCheckOut, useFrontdeskDashboard, useStays } from '@/hooks/useFrontdesk';
import { useHousekeepingTasks, useUpdateHousekeepingStatus } from '@/hooks/useHousekeeping';
import {
  useCreateMaintenanceOrder,
  useMaintenanceOrders,
  useUpdateMaintenanceOrder,
} from '@/hooks/useMaintenance';
import {
  useCreatePOSOrder,
  useCreatePOSProduct,
  usePOSOrders,
  usePOSProducts,
  useUpdatePOSOrderStatus,
} from '@/hooks/usePOS';
import { useOperationsReport } from '@/hooks/useReports';
import { useRoomUnits } from '@/hooks/useRoomUnits';
import type {
  FolioEntryType,
  HousekeepingTaskStatus,
  MaintenanceOrderPriority,
  MaintenanceOrderStatus,
  POSOrderStatus,
  POSProductCategory,
  RoomUnit,
  Stay,
} from '@/types/pms';
import type { Reservation } from '@/types/reservation';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const folioEntryLabels: Record<FolioEntryType, string> = {
  DAILY_RATE: 'Diária',
  EXTRA_BED: 'Cama extra',
  SERVICE_FEE: 'Taxa de serviço',
  TAX: 'Imposto',
  DISCOUNT: 'Desconto',
  PAYMENT: 'Pagamento',
  REFUND: 'Reembolso',
  ROOM_SERVICE: 'Room service',
  POS: 'PDV',
  ADJUSTMENT: 'Ajuste',
};

const housekeepingLabels: Record<HousekeepingTaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluída',
  INSPECTED: 'Inspecionada',
  CANCELLED: 'Cancelada',
};

const maintenancePriorityLabels: Record<MaintenanceOrderPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

const maintenanceStatusLabels: Record<MaintenanceOrderStatus, string> = {
  OPEN: 'Aberta',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
};

const posStatusLabels: Record<POSOrderStatus, string> = {
  OPEN: 'Aberto',
  PREPARING: 'Em preparo',
  DELIVERED: 'Entregue',
  CLOSED: 'Fechado',
  CANCELLED: 'Cancelado',
};

const posCategoryLabels: Record<POSProductCategory, string> = {
  FOOD: 'Alimentos',
  BEVERAGE: 'Bebidas',
  SERVICE: 'Serviços',
  CONVENIENCE: 'Conveniência',
  OTHER: 'Outros',
};

export default function POS() {
  const { data: dashboard } = useFrontdeskDashboard();
  const { data: reservations = [] } = useAdminReservations({ status: 'CONFIRMED' });
  const { data: stays = [] } = useStays();
  const { data: roomUnits = [] } = useRoomUnits();
  const { data: housekeepingTasks = [] } = useHousekeepingTasks();
  const { data: maintenanceOrders = [] } = useMaintenanceOrders();
  const { data: products = [] } = usePOSProducts();
  const { data: orders = [] } = usePOSOrders();
  const { data: report } = useOperationsReport();

  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const addFolioEntry = useAddFolioEntry();
  const updateHousekeeping = useUpdateHousekeepingStatus();
  const createMaintenanceOrder = useCreateMaintenanceOrder();
  const updateMaintenanceOrder = useUpdateMaintenanceOrder();
  const createProduct = useCreatePOSProduct();
  const createOrder = useCreatePOSOrder();
  const updateOrderStatus = useUpdatePOSOrderStatus();

  const [selectedRooms, setSelectedRooms] = useState<Record<string, string>>({});
  const [selectedStayId, setSelectedStayId] = useState('');
  const [billingForm, setBillingForm] = useState({
    type: 'PAYMENT' as FolioEntryType,
    amount: '',
    description: '',
  });
  const [maintenanceForm, setMaintenanceForm] = useState({
    roomUnitId: '',
    title: '',
    description: '',
    priority: 'MEDIUM' as MaintenanceOrderPriority,
    estimatedCost: '',
  });
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'FOOD' as POSProductCategory,
    price: '',
    description: '',
  });
  const [orderForm, setOrderForm] = useState({
    stayId: '',
    productId: '',
    quantity: '1',
    notes: '',
  });

  const { data: folio } = useFolio(selectedStayId || undefined);

  const arrivals = useMemo(() => dashboard?.arrivals ?? [], [dashboard]);
  const inHouseStays = useMemo(() => stays.filter((stay) => stay.status === 'IN_HOUSE'), [stays]);
  const availableRoomUnitsByAccommodation = useMemo(() => {
    return roomUnits.reduce<Record<string, RoomUnit[]>>((accumulator, roomUnit) => {
      const availableStatuses = ['AVAILABLE', 'INSPECTED'];
      const availableHousekeeping = ['CLEAN', 'INSPECTED'];

      if (
        !roomUnit.isActive ||
        !availableStatuses.includes(roomUnit.status) ||
        !availableHousekeeping.includes(roomUnit.housekeepingStatus)
      ) {
        return accumulator;
      }

      if (!accumulator[roomUnit.accommodationId]) {
        accumulator[roomUnit.accommodationId] = [];
      }

      accumulator[roomUnit.accommodationId].push(roomUnit);
      return accumulator;
    }, {});
  }, [roomUnits]);

  const activePOSProducts = useMemo(() => products.filter((product) => product.isActive), [products]);
  const selectedStay = useMemo(
    () => inHouseStays.find((stay) => stay.id === selectedStayId) ?? null,
    [inHouseStays, selectedStayId]
  );

  const handleCheckIn = (reservation: Reservation) => {
    const roomUnitId = selectedRooms[reservation.id];
    if (!roomUnitId) return;
    checkIn.mutate({ reservationId: reservation.id, roomUnitId });
  };

  const handleCheckOut = (stay: Stay) => {
    checkOut.mutate({ stayId: stay.id });
  };

  const handleBillingSubmit = () => {
    if (!folio || !billingForm.amount || !billingForm.description) return;
    addFolioEntry.mutate({
      folioId: folio.id,
      payload: {
        type: billingForm.type,
        source: 'MANUAL',
        description: billingForm.description,
        amount: Number(billingForm.amount),
      },
    });
    setBillingForm({ type: 'PAYMENT', amount: '', description: '' });
  };

  const handleMaintenanceCreate = () => {
    if (!maintenanceForm.roomUnitId || !maintenanceForm.title) return;
    createMaintenanceOrder.mutate({
      roomUnitId: maintenanceForm.roomUnitId,
      title: maintenanceForm.title,
      description: maintenanceForm.description || undefined,
      priority: maintenanceForm.priority,
      estimatedCost: maintenanceForm.estimatedCost ? Number(maintenanceForm.estimatedCost) : undefined,
      markRoomOutOfOrder: true,
    });
    setMaintenanceForm({
      roomUnitId: '',
      title: '',
      description: '',
      priority: 'MEDIUM',
      estimatedCost: '',
    });
  };

  const handleProductCreate = () => {
    if (!productForm.name || !productForm.price) return;
    createProduct.mutate({
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      description: productForm.description || undefined,
    });
    setProductForm({ name: '', category: 'FOOD', price: '', description: '' });
  };

  const handlePOSOrderCreate = () => {
    if (!orderForm.stayId || !orderForm.productId || !orderForm.quantity) return;
    createOrder.mutate({
      stayId: orderForm.stayId,
      origin: 'ROOM_SERVICE',
      notes: orderForm.notes || undefined,
      items: [
        {
          productId: orderForm.productId,
          quantity: Number(orderForm.quantity),
          notes: orderForm.notes || undefined,
        },
      ],
    });
    setOrderForm({ stayId: '', productId: '', quantity: '1', notes: '' });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Central PDV</h1>
            <p className="mt-1 text-gray-600">
              Operação centralizada para faturamento, recepção, pedidos, governança e manutenção.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <QuickMetric
              label="Hospedados"
              value={String(report?.frontdesk.inHouse ?? inHouseStays.length)}
              icon={BedDouble}
            />
            <QuickMetric
              label="Chegadas hoje"
              value={String(report?.frontdesk.arrivalsToday ?? arrivals.length)}
              icon={ConciergeBell}
            />
            <QuickMetric
              label="Receita do PDV"
              value={currencyFormatter.format(report?.finance.posRevenueMonth ?? 0)}
              icon={ShoppingCart}
            />
            <QuickMetric
              label="Fólios em aberto"
              value={currencyFormatter.format(report?.finance.outstandingFolios ?? 0)}
              icon={Wallet}
            />
          </div>
        </div>

        <Tabs defaultValue="faturamento" className="space-y-6">
          <TabsList className="h-auto w-full justify-start overflow-auto rounded-xl bg-white p-1">
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
            <TabsTrigger value="recepcao">Recepção</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="governanca">Governança</TabsTrigger>
            <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
            <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          </TabsList>

          <TabsContent value="faturamento" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Conta da hospedagem
                  </CardTitle>
                  <CardDescription>
                    Selecione uma hospedagem ativa para operar o faturamento.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedStayId} onValueChange={setSelectedStayId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a hospedagem" />
                    </SelectTrigger>
                    <SelectContent>
                      {inHouseStays.map((stay) => (
                        <SelectItem key={stay.id} value={stay.id}>
                          {(stay.roomUnit?.code || 'Sem quarto') + ' - ' + stay.reservation.guestName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedStay ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                      <div className="font-medium">{selectedStay.reservation.guestName}</div>
                      <div className="text-slate-600">
                        Quarto: {selectedStay.roomUnit?.code || 'Não atribuído'}
                      </div>
                      <div className="text-slate-600">
                        Saída prevista: {new Date(selectedStay.reservation.checkOutDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <Label>Tipo de lançamento</Label>
                    <Select
                      value={billingForm.type}
                      onValueChange={(value) => setBillingForm((current) => ({ ...current, type: value as FolioEntryType }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['PAYMENT', 'POS', 'ROOM_SERVICE', 'ADJUSTMENT'] as FolioEntryType[]).map((type) => (
                          <SelectItem key={type} value={type}>
                            {folioEntryLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={billingForm.amount}
                      onChange={(event) => setBillingForm((current) => ({ ...current, amount: event.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={billingForm.description}
                      onChange={(event) => setBillingForm((current) => ({ ...current, description: event.target.value }))}
                      placeholder="Ex.: pagamento em dinheiro, ajuste de consumo, taxa extra"
                    />
                  </div>

                  <Button className="w-full" onClick={handleBillingSubmit} disabled={!folio || addFolioEntry.isPending}>
                    Registrar lançamento
                  </Button>

                  {selectedStay ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleCheckOut(selectedStay)}
                      disabled={checkOut.isPending}
                    >
                      Finalizar check-out
                    </Button>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fólio</CardTitle>
                  <CardDescription>
                    Histórico de lançamentos e saldo atual da hospedagem selecionada.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!folio ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-slate-500">
                      Selecione uma hospedagem ativa para visualizar o fólio.
                    </div>
                  ) : (
                    <>
                      <div className="rounded-xl border bg-slate-50 p-4">
                        <div className="text-sm text-slate-500">Saldo atual</div>
                        <div className="mt-1 text-3xl font-semibold">
                          {currencyFormatter.format(Number(folio.balance))}
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {folio.entries.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4}>Nenhum lançamento registrado.</TableCell>
                            </TableRow>
                          ) : (
                            folio.entries.map((entry) => (
                              <TableRow key={entry.id}>
                                <TableCell>{new Date(entry.postedAt).toLocaleString('pt-BR')}</TableCell>
                                <TableCell>{folioEntryLabels[entry.type]}</TableCell>
                                <TableCell>{entry.description}</TableCell>
                                <TableCell className="text-right">
                                  {currencyFormatter.format(Number(entry.amount))}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recepcao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chegadas previstas</CardTitle>
                <CardDescription>Operação de check-in centralizada no PDV.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reserva</TableHead>
                      <TableHead>Hóspede</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Quarto</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!arrivals.length ? (
                      <TableRow>
                        <TableCell colSpan={6}>Nenhuma chegada pendente para hoje.</TableCell>
                      </TableRow>
                    ) : (
                      arrivals.map((reservation) => {
                        const candidateRooms =
                          availableRoomUnitsByAccommodation[reservation.accommodationId] ?? [];

                        return (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-mono">{reservation.reservationCode}</TableCell>
                            <TableCell>{reservation.guestName}</TableCell>
                            <TableCell>{reservation.accommodation?.name || '-'}</TableCell>
                            <TableCell>
                              {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')} até{' '}
                              {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={selectedRooms[reservation.id] ?? ''}
                                onValueChange={(value) =>
                                  setSelectedRooms((current) => ({ ...current, [reservation.id]: value }))
                                }
                              >
                                <SelectTrigger className="w-[220px]">
                                  <SelectValue placeholder="Selecionar quarto" />
                                </SelectTrigger>
                                <SelectContent>
                                  {candidateRooms.map((roomUnit) => (
                                    <SelectItem key={roomUnit.id} value={roomUnit.id}>
                                      {roomUnit.code} - {roomUnit.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => handleCheckIn(reservation)}
                                disabled={!selectedRooms[reservation.id] || checkIn.isPending}
                              >
                                Fazer check-in
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hospedagens em andamento</CardTitle>
                <CardDescription>
                  Acompanhe saldo, consumo e saída prevista sem sair da central.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reserva</TableHead>
                      <TableHead>Hóspede</TableHead>
                      <TableHead>Quarto</TableHead>
                      <TableHead>Saldo</TableHead>
                      <TableHead>Saída prevista</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!inHouseStays.length ? (
                      <TableRow>
                        <TableCell colSpan={5}>Nenhuma hospedagem ativa.</TableCell>
                      </TableRow>
                    ) : (
                      inHouseStays.map((stay) => (
                        <TableRow key={stay.id}>
                          <TableCell className="font-mono">{stay.reservation.reservationCode}</TableCell>
                          <TableCell>{stay.reservation.guestName}</TableCell>
                          <TableCell>{stay.roomUnit?.code || 'Sem quarto'}</TableCell>
                          <TableCell>
                            <Badge variant={Number(stay.folio?.balance || 0) > 0 ? 'destructive' : 'default'}>
                              {currencyFormatter.format(Number(stay.folio?.balance || 0))}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(stay.reservation.checkOutDate).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pedidos" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[360px_360px_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    Produtos
                  </CardTitle>
                  <CardDescription>
                    Cadastro rápido do cardápio interno e itens de conveniência.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Nome do item"
                    value={productForm.name}
                    onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
                  />

                  <Select
                    value={productForm.category}
                    onValueChange={(value) =>
                      setProductForm((current) => ({ ...current, category: value as POSProductCategory }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(posCategoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Preço"
                    value={productForm.price}
                    onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))}
                  />

                  <Textarea
                    placeholder="Descrição"
                    value={productForm.description}
                    onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))}
                  />

                  <Button className="w-full" onClick={handleProductCreate} disabled={createProduct.isPending}>
                    Salvar produto
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Pedido
                  </CardTitle>
                  <CardDescription>
                    Crie pedidos de room service com lançamento posterior no fólio.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={orderForm.stayId}
                    onValueChange={(value) => setOrderForm((current) => ({ ...current, stayId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Hospedagem" />
                    </SelectTrigger>
                    <SelectContent>
                      {inHouseStays.map((stay) => (
                        <SelectItem key={stay.id} value={stay.id}>
                          {(stay.roomUnit?.code || 'Sem quarto') + ' - ' + stay.reservation.guestName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={orderForm.productId}
                    onValueChange={(value) => setOrderForm((current) => ({ ...current, productId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {activePOSProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {currencyFormatter.format(Number(product.price))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Quantidade"
                    value={orderForm.quantity}
                    onChange={(event) => setOrderForm((current) => ({ ...current, quantity: event.target.value }))}
                  />

                  <Textarea
                    placeholder="Observações do pedido"
                    value={orderForm.notes}
                    onChange={(event) => setOrderForm((current) => ({ ...current, notes: event.target.value }))}
                  />

                  <Button className="w-full" onClick={handlePOSOrderCreate} disabled={createOrder.isPending}>
                    Criar pedido
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fila de pedidos</CardTitle>
                  <CardDescription>
                    Controle o preparo, a entrega e o fechamento sem sair da central.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pedido</TableHead>
                        <TableHead>Hóspede</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!orders.length ? (
                        <TableRow>
                          <TableCell colSpan={5}>Nenhum pedido registrado.</TableCell>
                        </TableRow>
                      ) : (
                        orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono">{order.orderNumber}</TableCell>
                            <TableCell>{order.stay?.reservation.guestName || '-'}</TableCell>
                            <TableCell>{currencyFormatter.format(Number(order.totalAmount))}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    order.status === 'CANCELLED'
                                      ? 'destructive'
                                      : order.status === 'DELIVERED'
                                        ? 'default'
                                        : 'outline'
                                  }
                                >
                                  {posStatusLabels[order.status]}
                                </Badge>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) =>
                                    updateOrderStatus.mutate({ id: order.id, status: value as POSOrderStatus })
                                  }
                                >
                                  <SelectTrigger className="w-[160px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(posStatusLabels).map(([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleString('pt-BR')}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="governanca" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Governança operacional
                </CardTitle>
                <CardDescription>
                  Atualize limpeza e liberação dos quartos direto do PDV.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quarto</TableHead>
                      <TableHead>Reserva</TableHead>
                      <TableHead>Tarefa</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!housekeepingTasks.length ? (
                      <TableRow>
                        <TableCell colSpan={5}>Nenhuma tarefa de governança encontrada.</TableCell>
                      </TableRow>
                    ) : (
                      housekeepingTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.roomUnit.code + ' - ' + task.roomUnit.name}</TableCell>
                          <TableCell>{task.reservation?.reservationCode || '-'}</TableCell>
                          <TableCell>{task.title}</TableCell>
                          <TableCell>
                            <Badge variant={task.priority === 'URGENT' ? 'destructive' : 'outline'}>
                              {maintenancePriorityLabels[task.priority]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={task.status}
                              onValueChange={(value) =>
                                updateHousekeeping.mutate({ id: task.id, status: value as HousekeepingTaskStatus })
                              }
                            >
                              <SelectTrigger className="w-[190px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(housekeepingLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manutencao" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Nova ordem
                  </CardTitle>
                  <CardDescription>
                    Registre ocorrências técnicas sem sair da central PDV.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={maintenanceForm.roomUnitId}
                    onValueChange={(value) => setMaintenanceForm((current) => ({ ...current, roomUnitId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Quarto" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomUnits.map((roomUnit) => (
                        <SelectItem key={roomUnit.id} value={roomUnit.id}>
                          {roomUnit.code} - {roomUnit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Título"
                    value={maintenanceForm.title}
                    onChange={(event) => setMaintenanceForm((current) => ({ ...current, title: event.target.value }))}
                  />

                  <Select
                    value={maintenanceForm.priority}
                    onValueChange={(value) =>
                      setMaintenanceForm((current) => ({ ...current, priority: value as MaintenanceOrderPriority }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(maintenancePriorityLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Custo estimado"
                    value={maintenanceForm.estimatedCost}
                    onChange={(event) =>
                      setMaintenanceForm((current) => ({ ...current, estimatedCost: event.target.value }))
                    }
                  />

                  <Textarea
                    placeholder="Descrição do problema"
                    value={maintenanceForm.description}
                    onChange={(event) =>
                      setMaintenanceForm((current) => ({ ...current, description: event.target.value }))
                    }
                  />

                  <Button className="w-full" onClick={handleMaintenanceCreate} disabled={createMaintenanceOrder.isPending}>
                    Criar ordem de manutenção
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ordens abertas</CardTitle>
                  <CardDescription>
                    Acompanhe andamento e devolução do quarto para a operação.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quarto</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Abertura</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!maintenanceOrders.length ? (
                        <TableRow>
                          <TableCell colSpan={5}>Nenhuma ordem de manutenção cadastrada.</TableCell>
                        </TableRow>
                      ) : (
                        maintenanceOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.roomUnit.code}</TableCell>
                            <TableCell>{order.title}</TableCell>
                            <TableCell>
                              <Badge variant={order.priority === 'URGENT' ? 'destructive' : 'outline'}>
                                {maintenancePriorityLabels[order.priority]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value) =>
                                  updateMaintenanceOrder.mutate({ id: order.id, data: { status: value as MaintenanceOrderStatus } })
                                }
                              >
                                <SelectTrigger className="w-[190px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(maintenanceStatusLabels).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{new Date(order.openedAt).toLocaleString('pt-BR')}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="indicadores" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryCard
                title="Taxa de ocupação"
                value={`${report?.rooms.occupancyRate ?? 0}%`}
                subtitle={`${report?.rooms.occupied ?? 0} de ${report?.rooms.total ?? 0} quartos ocupados`}
                icon={BedDouble}
              />
              <SummaryCard
                title="Receita de reservas no mês"
                value={currencyFormatter.format(report?.finance.reservationRevenueMonth ?? 0)}
                subtitle={`${report?.finance.reservationCountMonth ?? 0} reservas no período`}
                icon={Wallet}
              />
              <SummaryCard
                title="Receita de PDV no mês"
                value={currencyFormatter.format(report?.finance.posRevenueMonth ?? 0)}
                subtitle={`${report?.finance.posOrdersMonth ?? 0} pedidos faturados`}
                icon={BarChart3}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recepção</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MetricLine label="Chegadas hoje" value={String(report?.frontdesk.arrivalsToday ?? 0)} />
                  <MetricLine label="Saídas hoje" value={String(report?.frontdesk.departuresToday ?? 0)} />
                  <MetricLine label="Hospedados" value={String(report?.frontdesk.inHouse ?? 0)} />
                  <MetricLine label="Fólios em aberto" value={currencyFormatter.format(report?.finance.outstandingFolios ?? 0)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MetricLine label="Tarefas de governança" value={String(report?.operations.pendingHousekeeping ?? 0)} />
                  <MetricLine label="Manutenções abertas" value={String(report?.operations.openMaintenance ?? 0)} />
                  <MetricLine label="Data de referência" value={report?.referenceDate ?? '-'} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function QuickMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof BedDouble;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-full bg-blue-50 p-2 text-blue-600">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-xs text-slate-500">{label}</div>
          <div className="truncate text-sm font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof BedDouble;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
          <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
        </div>
        <div className="rounded-full bg-blue-50 p-3 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
