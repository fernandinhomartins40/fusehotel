import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  BedDouble,
  Receipt,
  Search,
  Store,
  Trash2,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCheckIn, useCheckOut, useFrontdeskDashboard, useStays } from '@/hooks/useFrontdesk';
import { useHousekeepingTasks, useUpdateHousekeepingStatus } from '@/hooks/useHousekeeping';
import {
  useCreateMaintenanceOrder,
  useMaintenanceOrders,
  useUpdateMaintenanceOrder,
} from '@/hooks/useMaintenance';
import {
  useActiveCashSession,
  useCancelPOSOrder,
  useCloseCashSession,
  useCreateCashMovement,
  useCreatePOSOrder,
  useOpenCashSession,
  usePOSOrders,
  usePOSProducts,
  useRegisterPOSPayment,
  useRefundPOSPayment,
  useUpdatePOSOrderStatus,
} from '@/hooks/usePOS';
import { useOperationsReport } from '@/hooks/useReports';
import { useRoomUnits } from '@/hooks/useRoomUnits';
import type {
  CashMovementType,
  HousekeepingTaskStatus,
  MaintenanceOrderPriority,
  MaintenanceOrderStatus,
  PaymentMethod,
  POSOrder,
  POSOrderOrigin,
  POSOrderStatus,
  POSProduct,
  POSProductCategory,
  POSSettlementType,
  RoomUnit,
} from '@/types/pms';
import type { Reservation } from '@/types/reservation';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const categoryLabels: Record<POSProductCategory | 'ALL', string> = {
  ALL: 'Todos',
  FOOD: 'Alimentos',
  BEVERAGE: 'Bebidas',
  SERVICE: 'Serviços',
  CONVENIENCE: 'Conveniência',
  OTHER: 'Outros',
};

const originLabels: Record<POSOrderOrigin, string> = {
  FRONTDESK: 'Balcão',
  ROOM_SERVICE: 'Room service',
  RESTAURANT: 'Restaurante',
  BAR: 'Bar',
};

const orderStatusLabels: Record<POSOrderStatus, string> = {
  OPEN: 'Aberto',
  PREPARING: 'Em preparo',
  DELIVERED: 'Entregue',
  CLOSED: 'Fechado',
  CANCELLED: 'Cancelado',
};

const settlementLabels: Record<POSSettlementType, string> = {
  DIRECT: 'Pagamento direto',
  FOLIO: 'Lançar no fólio',
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de crédito',
  DEBIT_CARD: 'Cartão de débito',
  BANK_TRANSFER: 'Transferência',
  VOUCHER: 'Voucher',
};

const housekeepingStatusLabels: Record<HousekeepingTaskStatus, string> = {
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

type CartItem = {
  productId: string;
  quantity: number;
};

export default function POS() {
  const { data: report } = useOperationsReport();
  const { data: dashboard } = useFrontdeskDashboard();
  const { data: stays = [] } = useStays();
  const { data: roomUnits = [] } = useRoomUnits();
  const { data: products = [] } = usePOSProducts();
  const { data: orders = [] } = usePOSOrders();
  const { data: activeCashSession } = useActiveCashSession();
  const { data: housekeepingTasks = [] } = useHousekeepingTasks();
  const { data: maintenanceOrders = [] } = useMaintenanceOrders();

  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const createOrder = useCreatePOSOrder();
  const registerPayment = useRegisterPOSPayment();
  const updateOrderStatus = useUpdatePOSOrderStatus();
  const cancelOrder = useCancelPOSOrder();
  const refundPayment = useRefundPOSPayment();
  const openCashSession = useOpenCashSession();
  const closeCashSession = useCloseCashSession();
  const createCashMovement = useCreateCashMovement();
  const updateHousekeeping = useUpdateHousekeepingStatus();
  const createMaintenanceOrder = useCreateMaintenanceOrder();
  const updateMaintenanceOrder = useUpdateMaintenanceOrder();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<POSProductCategory | 'ALL'>('ALL');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedRooms, setSelectedRooms] = useState<Record<string, string>>({});
  const [settlementType, setSettlementType] = useState<POSSettlementType>('DIRECT');
  const [origin, setOrigin] = useState<POSOrderOrigin>('FRONTDESK');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [selectedStayId, setSelectedStayId] = useState('');
  const [serviceFeeAmount, setServiceFeeAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [refundPaymentId, setRefundPaymentId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundNotes, setRefundNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [openingFloat, setOpeningFloat] = useState('');
  const [cashNotes, setCashNotes] = useState('');
  const [countedCashAmount, setCountedCashAmount] = useState('');
  const [cashMovementType, setCashMovementType] = useState<Extract<CashMovementType, 'SUPPLY' | 'WITHDRAWAL'>>(
    'SUPPLY'
  );
  const [cashMovementAmount, setCashMovementAmount] = useState('');
  const [cashMovementDescription, setCashMovementDescription] = useState('');
  const [maintenanceRoomUnitId, setMaintenanceRoomUnitId] = useState('');
  const [maintenanceTitle, setMaintenanceTitle] = useState('');
  const [maintenancePriority, setMaintenancePriority] = useState<MaintenanceOrderPriority>('MEDIUM');
  const [maintenanceDescription, setMaintenanceDescription] = useState('');

  const inHouseStays = useMemo(() => stays.filter((stay) => stay.status === 'IN_HOUSE'), [stays]);
  const arrivals = useMemo(() => dashboard?.arrivals ?? [], [dashboard]);
  const departures = useMemo(() => dashboard?.departures ?? [], [dashboard]);
  const activeProducts = useMemo(() => products.filter((product) => product.isActive), [products]);
  const openOrders = useMemo(
    () => orders.filter((order) => order.status !== 'CLOSED' && order.status !== 'CANCELLED'),
    [orders]
  );

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      const matchesCategory = category === 'ALL' || product.category === category;
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeProducts, category, search]);

  const cartDetailedItems = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = activeProducts.find((candidate) => candidate.id === item.productId);
        if (!product) return null;

        return {
          ...item,
          product,
          total: Number(product.price) * item.quantity,
        };
      })
      .filter(Boolean) as Array<CartItem & { product: POSProduct; total: number }>;
  }, [activeProducts, cartItems]);

  const subtotal = useMemo(
    () => cartDetailedItems.reduce((sum, item) => sum + item.total, 0),
    [cartDetailedItems]
  );

  const total = useMemo(() => {
    const service = Number(serviceFeeAmount || 0);
    const discount = Number(discountAmount || 0);
    return Math.max(subtotal + service - discount, 0);
  }, [discountAmount, serviceFeeAmount, subtotal]);

  const selectedOrder = useMemo(
    () => openOrders.find((order) => order.id === selectedOrderId) ?? null,
    [openOrders, selectedOrderId]
  );

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

  const addProductToCart = (product: POSProduct) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { productId: product.id, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCartItems((current) => current.filter((item) => item.productId !== productId));
      return;
    }

    setCartItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity: nextQuantity } : item))
    );
  };

  const clearDraft = () => {
    setCartItems([]);
    setCustomerName('');
    setTableNumber('');
    setSelectedStayId('');
    setServiceFeeAmount('');
    setDiscountAmount('');
    setOrderNotes('');
    setPaymentAmount('');
    setPaymentReference('');
    setPaymentNotes('');
  };

  const handleCheckIn = (reservation: Reservation) => {
    const roomUnitId = selectedRooms[reservation.id];
    if (!roomUnitId) {
      toast.error('Selecione um quarto para o check-in');
      return;
    }
    checkIn.mutate({ reservationId: reservation.id, roomUnitId });
  };

  const handleFinalizeSale = async () => {
    if (!cartDetailedItems.length) {
      toast.error('Adicione itens ao carrinho');
      return;
    }

    if (settlementType === 'FOLIO' && !selectedStayId) {
      toast.error('Selecione uma hospedagem para lançar no fólio');
      return;
    }

    if (settlementType === 'DIRECT' && paymentMethod === 'CASH' && !activeCashSession) {
      toast.error('Abra o caixa antes de receber em dinheiro');
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        stayId: settlementType === 'FOLIO' ? selectedStayId : undefined,
        roomUnitId:
          settlementType === 'FOLIO'
            ? inHouseStays.find((stay) => stay.id === selectedStayId)?.roomUnitId ?? undefined
            : undefined,
        origin,
        settlementType,
        customerName: settlementType === 'DIRECT' ? customerName || undefined : undefined,
        tableNumber: tableNumber || undefined,
        serviceFeeAmount: Number(serviceFeeAmount || 0) || undefined,
        discountAmount: Number(discountAmount || 0) || undefined,
        notes: orderNotes || undefined,
        items: cartDetailedItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      if (settlementType === 'DIRECT') {
        const amountToPay = Number(paymentAmount || total);

        if (amountToPay > 0) {
          await registerPayment.mutateAsync({
            orderId: order.id,
            amount: amountToPay,
            method: paymentMethod,
            cashSessionId: paymentMethod === 'CASH' ? activeCashSession?.id : undefined,
            reference: paymentReference || undefined,
            notes: paymentNotes || undefined,
          });
        }

        if (amountToPay >= total) {
          await updateOrderStatus.mutateAsync({ id: order.id, status: 'CLOSED' });
        }
      } else {
        await updateOrderStatus.mutateAsync({ id: order.id, status: 'DELIVERED' });
      }

      setSelectedOrderId(order.id);
      clearDraft();
    } catch {
      return;
    }
  };

  const handleRegisterPayment = async () => {
    if (!selectedOrder) {
      toast.error('Selecione um pedido em aberto');
      return;
    }

    const remainingAmount = Number(selectedOrder.totalAmount) - Number(selectedOrder.paidAmount);
    const amount = Number(paymentAmount || remainingAmount);

    if (amount <= 0) {
      toast.error('Informe um valor de pagamento válido');
      return;
    }

    if (paymentMethod === 'CASH' && !activeCashSession) {
      toast.error('Abra o caixa antes de receber em dinheiro');
      return;
    }

    try {
      await registerPayment.mutateAsync({
        orderId: selectedOrder.id,
        amount,
        method: paymentMethod,
        cashSessionId: paymentMethod === 'CASH' ? activeCashSession?.id : undefined,
        reference: paymentReference || undefined,
        notes: paymentNotes || undefined,
      });

      if (amount >= remainingAmount) {
        await updateOrderStatus.mutateAsync({ id: selectedOrder.id, status: 'CLOSED' });
      }

      setPaymentAmount('');
      setPaymentReference('');
      setPaymentNotes('');
    } catch {
      return;
    }
  };

  const handleRefundPayment = async () => {
    if (!refundPaymentId) {
      toast.error('Selecione um pagamento para estornar');
      return;
    }

    try {
      await refundPayment.mutateAsync({
        paymentId: refundPaymentId,
        amount: refundAmount ? Number(refundAmount) : undefined,
        notes: refundNotes || undefined,
      });
      setRefundPaymentId('');
      setRefundAmount('');
      setRefundNotes('');
    } catch {
      return;
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      toast.error('Informe o motivo do cancelamento');
      return;
    }

    try {
      await cancelOrder.mutateAsync({
        id: selectedOrder.id,
        reason: cancelReason,
        refundPayments: true,
      });
      setCancelReason('');
      setSelectedOrderId('');
    } catch {
      return;
    }
  };

  const handleOpenCash = () => {
    openCashSession.mutate({
      openingFloat: openingFloat ? Number(openingFloat) : undefined,
      notes: cashNotes || undefined,
    });
    setOpeningFloat('');
    setCashNotes('');
  };

  const handleCloseCash = () => {
    if (!countedCashAmount) {
      toast.error('Informe o valor contado no caixa');
      return;
    }

    closeCashSession.mutate({
      countedCashAmount: Number(countedCashAmount),
      notes: cashNotes || undefined,
    });
    setCountedCashAmount('');
    setCashNotes('');
  };

  const handleCashMovement = () => {
    if (!cashMovementAmount || !cashMovementDescription.trim()) {
      toast.error('Informe valor e descrição da movimentação');
      return;
    }

    createCashMovement.mutate({
      type: cashMovementType,
      amount: Number(cashMovementAmount),
      description: cashMovementDescription,
      method: 'CASH',
    });

    setCashMovementAmount('');
    setCashMovementDescription('');
  };

  const handleCreateMaintenance = () => {
    if (!maintenanceRoomUnitId || !maintenanceTitle.trim()) {
      toast.error('Informe quarto e título da manutenção');
      return;
    }

    createMaintenanceOrder.mutate({
      roomUnitId: maintenanceRoomUnitId,
      title: maintenanceTitle,
      description: maintenanceDescription || undefined,
      priority: maintenancePriority,
      markRoomOutOfOrder: true,
    });

    setMaintenanceRoomUnitId('');
    setMaintenanceTitle('');
    setMaintenancePriority('MEDIUM');
    setMaintenanceDescription('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">PDV</Badge>
              <Badge variant="outline">Balcão</Badge>
              <Badge variant="outline">Room service</Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">PDV do hotel</h1>
            <p className="mt-1 text-sm text-slate-600">
              Tela de operação literal para vender, cobrar, abrir caixa e atuar no dia a dia do hotel.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <TopMetric label="Caixa" value={activeCashSession ? activeCashSession.code : 'Fechado'} icon={Wallet} />
            <TopMetric label="Pedidos abertos" value={String(openOrders.length)} icon={Receipt} />
            <TopMetric label="Hospedados" value={String(report?.frontdesk.inHouse ?? inHouseStays.length)} icon={BedDouble} />
            <TopMetric
              label="Receita do PDV"
              value={currency.format(report?.finance.posRevenueMonth ?? 0)}
              icon={Store}
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_440px]">
          <div className="space-y-6">
            <Card>
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Buscar produto, item ou serviço"
                      className="pl-9"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <Button
                        key={value}
                        type="button"
                        variant={category === value ? 'default' : 'outline'}
                        onClick={() => setCategory(value as POSProductCategory | 'ALL')}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catálogo de venda</CardTitle>
                <CardDescription>Toque no item para adicionar ao carrinho.</CardDescription>
              </CardHeader>
              <CardContent>
                {!filteredProducts.length ? (
                  <EmptyState
                    title="Nenhum produto encontrado"
                    description="Ajuste a busca ou cadastre itens nas telas de gestão."
                    actionLabel="Abrir cadastros"
                    actionTo="/admin/accommodations"
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => addProductToCart(product)}
                        className="rounded-2xl border bg-white p-4 text-left transition hover:border-slate-300 hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="mt-1 text-sm text-slate-500">
                              {categoryLabels[product.category]}
                              {product.trackStock ? ` • Estoque ${product.stockQuantity}` : ''}
                            </div>
                          </div>
                          <Badge variant="outline">{currency.format(Number(product.price))}</Badge>
                        </div>
                        {product.description ? (
                          <div className="mt-3 line-clamp-2 text-sm text-slate-500">{product.description}</div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operação rápida do hotel</CardTitle>
                <CardDescription>Recepção, governança, manutenção e fila de pedidos sem sair do PDV.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pedidos" className="space-y-4">
                  <TabsList className="flex h-auto flex-wrap justify-start">
                    <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
                    <TabsTrigger value="recepcao">Recepção</TabsTrigger>
                    <TabsTrigger value="governanca">Governança</TabsTrigger>
                    <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pedidos" className="space-y-3">
                    {!openOrders.length ? (
                      <EmptyState title="Sem pedidos abertos" description="Todas as vendas do PDV estão fechadas." />
                    ) : (
                      <div className="space-y-3">
                        {openOrders.slice(0, 8).map((order) => (
                          <button
                            key={order.id}
                            type="button"
                            onClick={() => setSelectedOrderId(order.id)}
                            className={`w-full rounded-2xl border p-4 text-left transition ${
                              selectedOrderId === order.id ? 'border-slate-900 bg-slate-50' : 'hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-medium">{order.orderNumber}</div>
                                <div className="mt-1 text-sm text-slate-500">
                                  {originLabels[order.origin]} • {settlementLabels[order.settlementType]}
                                </div>
                              </div>
                              <Badge variant="outline">{orderStatusLabels[order.status]}</Badge>
                            </div>
                            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                              <span>Total {currency.format(Number(order.totalAmount))}</span>
                              <span>Pago {currency.format(Number(order.paidAmount))}</span>
                              <span>{new Date(order.createdAt).toLocaleString('pt-BR')}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="recepcao" className="grid gap-4 xl:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Chegadas de hoje</CardTitle>
                        <CardDescription>{arrivals.length} reservas para check-in</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {!arrivals.length ? (
                          <EmptyState title="Sem chegadas pendentes" description="Nenhuma reserva para check-in agora." />
                        ) : (
                          arrivals.slice(0, 6).map((reservation) => (
                            <div key={reservation.id} className="rounded-2xl border p-4">
                              <div className="font-medium">{reservation.guestName}</div>
                              <div className="mt-1 text-sm text-slate-500">
                                {reservation.reservationCode} • {reservation.accommodation?.name ?? 'Acomodação'}
                              </div>
                              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                <Select
                                  value={selectedRooms[reservation.id] ?? ''}
                                  onValueChange={(value) =>
                                    setSelectedRooms((current) => ({ ...current, [reservation.id]: value }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecionar quarto" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(availableRoomUnitsByAccommodation[reservation.accommodationId] ?? []).map((roomUnit) => (
                                      <SelectItem key={roomUnit.id} value={roomUnit.id}>
                                        {roomUnit.code} • {roomUnit.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button onClick={() => handleCheckIn(reservation)} disabled={checkIn.isPending}>
                                  Check-in
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Saídas e hospedados</CardTitle>
                        <CardDescription>
                          {departures.length} saídas previstas • {inHouseStays.length} hospedagens ativas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {!inHouseStays.length ? (
                          <EmptyState title="Sem hospedagens ativas" description="Nenhum hóspede em casa agora." />
                        ) : (
                          inHouseStays.slice(0, 6).map((stay) => (
                            <div key={stay.id} className="rounded-2xl border p-4">
                              <div className="font-medium">{stay.reservation.guestName}</div>
                              <div className="mt-1 text-sm text-slate-500">
                                Quarto {stay.roomUnit?.code ?? 'Sem quarto'} • Saída{' '}
                                {new Date(stay.reservation.checkOutDate).toLocaleDateString('pt-BR')}
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <span className="text-sm text-slate-500">
                                  Saldo do fólio {currency.format(Number(stay.folio?.balance ?? 0))}
                                </span>
                                <Button variant="outline" onClick={() => checkOut.mutate({ stayId: stay.id })} disabled={checkOut.isPending}>
                                  Check-out
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="governanca" className="space-y-3">
                    {!housekeepingTasks.length ? (
                      <EmptyState title="Sem tarefas" description="Nenhuma tarefa de governança aberta." />
                    ) : (
                      housekeepingTasks.slice(0, 8).map((task) => (
                        <div key={task.id} className="rounded-2xl border p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium">
                                {task.roomUnit.code} • {task.title}
                              </div>
                              <div className="mt-1 text-sm text-slate-500">
                                {task.reservation?.guestName ?? 'Sem hóspede'} • {task.priority}
                              </div>
                            </div>
                            <Select
                              value={task.status}
                              onValueChange={(value) =>
                                updateHousekeeping.mutate({ id: task.id, status: value as HousekeepingTaskStatus })
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(housekeepingStatusLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="manutencao" className="grid gap-4 xl:grid-cols-[340px_1fr]">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Nova manutenção</CardTitle>
                        <CardDescription>Registre uma ordem sem sair do PDV.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Select value={maintenanceRoomUnitId} onValueChange={setMaintenanceRoomUnitId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar quarto" />
                          </SelectTrigger>
                          <SelectContent>
                            {roomUnits.map((roomUnit) => (
                              <SelectItem key={roomUnit.id} value={roomUnit.id}>
                                {roomUnit.code} • {roomUnit.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          value={maintenanceTitle}
                          onChange={(event) => setMaintenanceTitle(event.target.value)}
                          placeholder="Título da ocorrência"
                        />

                        <Select
                          value={maintenancePriority}
                          onValueChange={(value) => setMaintenancePriority(value as MaintenanceOrderPriority)}
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

                        <Textarea
                          value={maintenanceDescription}
                          onChange={(event) => setMaintenanceDescription(event.target.value)}
                          placeholder="Descrição do problema"
                        />

                        <Button className="w-full" onClick={handleCreateMaintenance} disabled={createMaintenanceOrder.isPending}>
                          Criar ordem
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Ordens abertas</CardTitle>
                        <CardDescription>{maintenanceOrders.length} ordens registradas</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {!maintenanceOrders.length ? (
                          <EmptyState title="Sem manutenção aberta" description="Nenhuma ordem cadastrada." />
                        ) : (
                          maintenanceOrders.slice(0, 8).map((order) => (
                            <div key={order.id} className="rounded-2xl border p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="font-medium">
                                    {order.roomUnit.code} • {order.title}
                                  </div>
                                  <div className="mt-1 text-sm text-slate-500">
                                    {maintenancePriorityLabels[order.priority]} • {new Date(order.openedAt).toLocaleString('pt-BR')}
                                  </div>
                                </div>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) =>
                                    updateMaintenanceOrder.mutate({
                                      id: order.id,
                                      data: { status: value as MaintenanceOrderStatus },
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-[180px]">
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
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Caixa</CardTitle>
                <CardDescription>Controle rápido do turno atual.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!activeCashSession ? (
                  <>
                    <div className="space-y-2">
                      <Label>Fundo inicial</Label>
                      <Input value={openingFloat} onChange={(event) => setOpeningFloat(event.target.value)} placeholder="0,00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Textarea value={cashNotes} onChange={(event) => setCashNotes(event.target.value)} />
                    </div>
                    <Button className="w-full" onClick={handleOpenCash} disabled={openCashSession.isPending}>
                      Abrir caixa
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl border bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium">{activeCashSession.code}</div>
                          <div className="text-sm text-slate-500">
                            Aberto em {new Date(activeCashSession.openedAt).toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <Badge>Aberto</Badge>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-600">
                        <span>Fundo {currency.format(Number(activeCashSession.openingFloat))}</span>
                        <span>Esperado {currency.format(Number(activeCashSession.expectedCashAmount ?? 0))}</span>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Select value={cashMovementType} onValueChange={(value) => setCashMovementType(value as Extract<CashMovementType, 'SUPPLY' | 'WITHDRAWAL'>)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUPPLY">Suprimento</SelectItem>
                          <SelectItem value="WITHDRAWAL">Sangria</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={cashMovementAmount}
                        onChange={(event) => setCashMovementAmount(event.target.value)}
                        placeholder="Valor da movimentação"
                      />
                      <Input
                        value={cashMovementDescription}
                        onChange={(event) => setCashMovementDescription(event.target.value)}
                        placeholder="Descrição"
                      />
                      <Button variant="outline" onClick={handleCashMovement} disabled={createCashMovement.isPending}>
                        Registrar movimentação
                      </Button>
                    </div>

                    <div className="grid gap-3 rounded-2xl border p-4">
                      <Label>Fechamento do caixa</Label>
                      <Input
                        value={countedCashAmount}
                        onChange={(event) => setCountedCashAmount(event.target.value)}
                        placeholder="Valor contado"
                      />
                      <Textarea
                        value={cashNotes}
                        onChange={(event) => setCashNotes(event.target.value)}
                        placeholder="Observações do fechamento"
                      />
                      <Button onClick={handleCloseCash} disabled={closeCashSession.isPending}>
                        Fechar caixa
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Venda atual</CardTitle>
                <CardDescription>Monte o carrinho e finalize sem trocar de tela.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant={settlementType === 'DIRECT' ? 'default' : 'outline'} onClick={() => setSettlementType('DIRECT')}>
                    Pagamento direto
                  </Button>
                  <Button type="button" variant={settlementType === 'FOLIO' ? 'default' : 'outline'} onClick={() => setSettlementType('FOLIO')}>
                    Lançar no fólio
                  </Button>
                </div>

                <div className="grid gap-3">
                  <Select value={origin} onValueChange={(value) => setOrigin(value as POSOrderOrigin)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(originLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {settlementType === 'DIRECT' ? (
                    <>
                      <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nome do cliente" />
                      <Input value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} placeholder="Mesa, comanda ou referência" />
                    </>
                  ) : (
                    <Select value={selectedStayId || 'none'} onValueChange={(value) => setSelectedStayId(value === 'none' ? '' : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar hospedagem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Selecionar hospedagem</SelectItem>
                        {inHouseStays.map((stay) => (
                          <SelectItem key={stay.id} value={stay.id}>
                            {stay.reservation.guestName} • Quarto {stay.roomUnit?.code ?? 'Sem quarto'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-3 rounded-2xl border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Carrinho</span>
                    <Badge variant="outline">{cartDetailedItems.length} item(ns)</Badge>
                  </div>

                  {!cartDetailedItems.length ? (
                    <div className="rounded-xl border border-dashed p-4 text-sm text-slate-500">
                      Toque nos produtos para começar a venda.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cartDetailedItems.map((item) => (
                        <div key={item.productId} className="rounded-xl border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-sm text-slate-500">
                                {currency.format(Number(item.product.price))} por unidade
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => updateCartQuantity(item.productId, 0)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}>
                                -
                              </Button>
                              <span className="min-w-8 text-center font-medium">{item.quantity}</span>
                              <Button variant="outline" size="sm" onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}>
                                +
                              </Button>
                            </div>
                            <span className="font-semibold">{currency.format(item.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={serviceFeeAmount} onChange={(event) => setServiceFeeAmount(event.target.value)} placeholder="Taxa de serviço" />
                  <Input value={discountAmount} onChange={(event) => setDiscountAmount(event.target.value)} placeholder="Desconto" />
                </div>

                <Textarea value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} placeholder="Observações do pedido" />

                {settlementType === 'DIRECT' ? (
                  <div className="grid gap-3 rounded-2xl border p-4">
                    <div className="font-medium">Cobrança</div>
                    <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(paymentMethodLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} placeholder={`Valor recebido • padrão ${currency.format(total)}`} />
                    <Input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} placeholder="NSU, referência ou identificador" />
                    <Textarea value={paymentNotes} onChange={(event) => setPaymentNotes(event.target.value)} placeholder="Observações do pagamento" />
                  </div>
                ) : null}

                <div className="rounded-2xl bg-slate-950 p-4 text-white">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Subtotal</span>
                    <span>{currency.format(subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                    <span>Taxa / desconto</span>
                    <span>{currency.format(Number(serviceFeeAmount || 0) - Number(discountAmount || 0))}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xl font-semibold">
                    <span>Total</span>
                    <span>{currency.format(total)}</span>
                  </div>
                </div>

                <Button className="h-12 w-full text-base" onClick={handleFinalizeSale} disabled={createOrder.isPending || registerPayment.isPending || updateOrderStatus.isPending}>
                  {settlementType === 'DIRECT' ? 'Finalizar venda' : 'Lançar consumo no fólio'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedido selecionado</CardTitle>
                <CardDescription>Receba, feche, estorne ou cancele um pedido aberto.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedOrder ? (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-slate-500">
                    Selecione um pedido aberto na fila operacional.
                  </div>
                ) : (
                  <>
                    <div className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{selectedOrder.orderNumber}</div>
                          <div className="mt-1 text-sm text-slate-500">
                            {originLabels[selectedOrder.origin]} • {settlementLabels[selectedOrder.settlementType]}
                          </div>
                        </div>
                        <Badge variant="outline">{orderStatusLabels[selectedOrder.status]}</Badge>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-600">
                        <span>Total {currency.format(Number(selectedOrder.totalAmount))}</span>
                        <span>Pago {currency.format(Number(selectedOrder.paidAmount))}</span>
                        <span>Saldo {currency.format(Number(selectedOrder.totalAmount) - Number(selectedOrder.paidAmount))}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                          <span>
                            {item.quantity}x {item.productName}
                          </span>
                          <span>{currency.format(Number(item.totalPrice))}</span>
                        </div>
                      ))}
                    </div>

                    {selectedOrder.settlementType === 'DIRECT' ? (
                      <>
                        <div className="grid gap-3">
                          <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(paymentMethodLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} placeholder="Valor do pagamento" />
                          <Input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} placeholder="Referência do pagamento" />
                          <Textarea value={paymentNotes} onChange={(event) => setPaymentNotes(event.target.value)} placeholder="Observações" />
                          <Button onClick={handleRegisterPayment} disabled={registerPayment.isPending}>
                            Receber pagamento
                          </Button>
                        </div>

                        {!!selectedOrder.payments.length ? (
                          <div className="grid gap-3 rounded-2xl border p-4">
                            <Label>Estorno</Label>
                            <Select value={refundPaymentId || 'none'} onValueChange={(value) => setRefundPaymentId(value === 'none' ? '' : value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar pagamento" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Selecionar pagamento</SelectItem>
                                {selectedOrder.payments.map((payment) => (
                                  <SelectItem key={payment.id} value={payment.id}>
                                    {paymentMethodLabels[payment.method]} • {currency.format(Number(payment.amount))}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input value={refundAmount} onChange={(event) => setRefundAmount(event.target.value)} placeholder="Valor do estorno" />
                            <Textarea value={refundNotes} onChange={(event) => setRefundNotes(event.target.value)} placeholder="Motivo do estorno" />
                            <Button variant="outline" onClick={handleRefundPayment} disabled={refundPayment.isPending}>
                              Estornar pagamento
                            </Button>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
                        Este pedido está configurado para lançamento em fólio.
                      </div>
                    )}

                    <div className="grid gap-3">
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(value) =>
                          updateOrderStatus.mutate({ id: selectedOrder.id, status: value as POSOrderStatus })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(orderStatusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} placeholder="Motivo do cancelamento" />
                      <Button variant="destructive" onClick={handleCancelOrder} disabled={cancelOrder.isPending}>
                        Cancelar pedido
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function TopMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-full bg-slate-100 p-2 text-slate-700">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          <div className="text-sm font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed p-6 text-center">
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{description}</div>
      {actionLabel && actionTo ? (
        <Button asChild variant="outline" className="mt-4">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
