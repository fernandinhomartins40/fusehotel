import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BedDouble,
  CreditCard,
  Grid2x2,
  Keyboard,
  LogIn,
  LogOut,
  Maximize2,
  Minimize2,
  Receipt,
  Search,
  ShoppingCart,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CreateCustomerDialog } from '@/components/admin/customers/CreateCustomerDialog';
import { GuestSheet } from '@/components/admin/frontdesk/GuestSheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCustomers } from '@/hooks/useCustomers';
import { useCheckIn, useFrontdeskDashboard, useStays, useWalkInCheckIn } from '@/hooks/useFrontdesk';
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
  useUpdatePOSOrder,
  useUpdatePOSOrderStatus,
  useProductCategories,
} from '@/hooks/usePOS';
import { usePromotions } from '@/hooks/usePromotions';
import { useOperationsReport } from '@/hooks/useReports';
import { useRoomUnits } from '@/hooks/useRoomUnits';
import type {
  CashMovementType,
  PaymentMethod,
  POSOrderOrigin,
  POSOrderStatus,
  POSProduct,
  POSSettlementType,
  RoomUnit,
  Stay,
} from '@/types/pms';
import type { Reservation } from '@/types/reservation';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const originLabels: Record<POSOrderOrigin, string> = {
  FRONTDESK: 'Balcão',
  ROOM_SERVICE: 'Serviço de quarto',
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
  FOLIO: 'Conta do hóspede',
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  PIX: 'PIX',
  CREDIT_CARD: 'Crédito',
  DEBIT_CARD: 'Débito',
  BANK_TRANSFER: 'Transferência',
  VOUCHER: 'Voucher',
};

type CartItem = {
  productId: string;
  quantity: number;
};

type NumericField = 'serviceFee' | 'discount' | 'payment';
type DialogKey =
  | 'cash'
  | 'orders'
  | 'drafts'
  | 'references'
  | 'details'
  | 'checkin'
  | 'checkout'
  | 'room-service-orders'
  | 'charge-stay'
  | null;
type SalePreset = 'BALCAO' | 'COMANDA' | 'QUARTO';
type POSStep = 'items' | 'payment' | 'review';

const salePresetLabels: Record<SalePreset, string> = {
  BALCAO: 'Pagamento direto',
  COMANDA: 'Mesa / Comanda',
  QUARTO: 'Conta do hóspede',
};

const posStepLabels: Record<POSStep, string> = {
  items: 'Itens',
  payment: 'Pagamento',
  review: 'Revisão',
};

type SavedDraft = {
  id: string;
  reference: string;
  salePreset: SalePreset;
  settlementType: POSSettlementType;
  origin: POSOrderOrigin;
  customerName: string;
  tableNumber: string;
  selectedStayId: string;
  serviceFeeAmount: string;
  discountAmount: string;
  paymentMethod: PaymentMethod;
  paymentAmount: string;
  paymentReference: string;
  orderNotes: string;
  cartItems: CartItem[];
  updatedAt: string;
};

export default function POS() {
  const { data: report } = useOperationsReport();
  const { data: dashboard } = useFrontdeskDashboard();
  const { data: stays = [] } = useStays();
  const { data: roomUnits = [] } = useRoomUnits();
  const { data: customers = [] } = useCustomers({ role: 'CUSTOMER' });
  const { data: promotions = [] } = usePromotions({ isActive: true });
  const { data: products = [] } = usePOSProducts();
  const { data: orders = [] } = usePOSOrders();
  const { data: activeCashSession } = useActiveCashSession();
  const { data: productCategories = [] } = useProductCategories();
  const checkIn = useCheckIn();
  const walkInCheckIn = useWalkInCheckIn();

  const createOrder = useCreatePOSOrder();
  const updateOrder = useUpdatePOSOrder();
  const registerPayment = useRegisterPOSPayment();
  const updateOrderStatus = useUpdatePOSOrderStatus();
  const cancelOrder = useCancelPOSOrder();
  const refundPayment = useRefundPOSPayment();
  const openCashSession = useOpenCashSession();
  const closeCashSession = useCloseCashSession();
  const createCashMovement = useCreateCashMovement();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('ALL');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editingOrderId, setEditingOrderId] = useState('');
  const [activeDialog, setActiveDialog] = useState<DialogKey>(null);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [settlementType, setSettlementType] = useState<POSSettlementType>('DIRECT');
  const [origin, setOrigin] = useState<POSOrderOrigin>('FRONTDESK');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [selectedStayId, setSelectedStayId] = useState('');
  const [serviceFeeAmount, setServiceFeeAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [activeNumericField, setActiveNumericField] = useState<NumericField>('payment');
  const [salePreset, setSalePreset] = useState<SalePreset>('BALCAO');
  const [quickCode, setQuickCode] = useState('');
  const [quickQuantity, setQuickQuantity] = useState('1');
  const [draftReference, setDraftReference] = useState('');
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [referenceLookup, setReferenceLookup] = useState('');
  const [currentStep, setCurrentStep] = useState<POSStep>('items');
  const [roomSearch, setRoomSearch] = useState('');
  const [guestSheetOpen, setGuestSheetOpen] = useState(false);
  const [guestSheetStay, setGuestSheetStay] = useState<Stay | null>(null);
  const [guestSheetInitialTab, setGuestSheetInitialTab] = useState<'conta' | 'consumo' | 'conferencia' | 'acoes' | 'historico'>('conta');
  const [checkInReservation, setCheckInReservation] = useState<Reservation | null>(null);
  const [checkInRoomId, setCheckInRoomId] = useState('');
  const [walkInSearch, setWalkInSearch] = useState('');
  const [walkInForm, setWalkInForm] = useState({
    roomUnitId: '',
    customerId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestWhatsApp: '',
    guestCpf: '',
    checkInDate: new Date().toISOString().slice(0, 10),
    checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    adults: '1',
    children: '0',
    notes: '',
    promotionId: '',
  });
  const [refundPaymentId, setRefundPaymentId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundNotes, setRefundNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [openingFloat, setOpeningFloat] = useState('');
  const [countedCashAmount, setCountedCashAmount] = useState('');
  const [cashNotes, setCashNotes] = useState('');
  const [cashMovementType, setCashMovementType] = useState<Extract<CashMovementType, 'SUPPLY' | 'WITHDRAWAL'>>(
    'SUPPLY'
  );
  const [cashMovementAmount, setCashMovementAmount] = useState('');
  const [cashMovementDescription, setCashMovementDescription] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const scannerBufferRef = useRef('');
  const scannerTimeoutRef = useRef<number | null>(null);

  const inHouseStays = useMemo(() => stays.filter((stay) => stay.status === 'IN_HOUSE'), [stays]);
  const arrivals = useMemo(() => dashboard?.arrivals ?? [], [dashboard?.arrivals]);
  const activeProducts = useMemo(() => products.filter((product) => product.isActive), [products]);
  const openOrders = useMemo(
    () => orders.filter((order) => order.status !== 'CLOSED' && order.status !== 'CANCELLED'),
    [orders]
  );
  const roomServiceOrders = useMemo(
    () => orders.filter((order) => order.origin === 'ROOM_SERVICE' && order.status !== 'CANCELLED'),
    [orders]
  );

  const availableRoomUnitsByAccommodation = useMemo(() => {
    return roomUnits.reduce<Record<string, RoomUnit[]>>((acc, roomUnit) => {
      if (!roomUnit.isActive) return acc;
      const roomReady =
        ['AVAILABLE', 'INSPECTED'].includes(roomUnit.status) &&
        ['CLEAN', 'INSPECTED'].includes(roomUnit.housekeepingStatus);
      if (!roomReady) return acc;
      if (!acc[roomUnit.accommodationId]) acc[roomUnit.accommodationId] = [];
      acc[roomUnit.accommodationId].push(roomUnit);
      return acc;
    }, {});
  }, [roomUnits]);

  const availableWalkInRooms = useMemo(
    () =>
      roomUnits.filter(
        (roomUnit) =>
          roomUnit.isActive &&
          ['AVAILABLE', 'INSPECTED'].includes(roomUnit.status) &&
          ['CLEAN', 'INSPECTED'].includes(roomUnit.housekeepingStatus)
      ),
    [roomUnits]
  );

  const customerSearchResults = useMemo(() => {
    const query = walkInSearch.trim().toLowerCase();
    if (!query) return [];
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone, customer.whatsapp, customer.cpf]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [customers, walkInSearch]);

  const selectedWalkInCustomer = useMemo(
    () => customers.find((customer) => customer.id === walkInForm.customerId),
    [customers, walkInForm.customerId]
  );

  const selectedWalkInRoom = useMemo(
    () => availableWalkInRooms.find((roomUnit) => roomUnit.id === walkInForm.roomUnitId),
    [availableWalkInRooms, walkInForm.roomUnitId]
  );
  const checkInCandidateRooms = checkInReservation
    ? availableRoomUnitsByAccommodation[checkInReservation.accommodationId] ?? []
    : [];

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      const matchesCategory = category === 'ALL' || product.categoryId === category;
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
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  const selectedStay = useMemo(
    () => inHouseStays.find((stay) => stay.id === selectedStayId) ?? null,
    [inHouseStays, selectedStayId]
  );

  const editingOrder = useMemo(
    () => orders.find((order) => order.id === editingOrderId) ?? null,
    [editingOrderId, orders]
  );

  const normalizedReferenceLookup = useMemo(() => referenceLookup.trim().toLowerCase(), [referenceLookup]);

  const referencedOpenOrders = useMemo(() => {
    if (!normalizedReferenceLookup) return openOrders.slice(0, 8);

    return openOrders.filter((order) =>
      [order.tableNumber, order.customerName, order.orderNumber]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedReferenceLookup))
    );
  }, [normalizedReferenceLookup, openOrders]);

  const canEditSelectedOrder = useMemo(() => {
    if (!selectedOrder) return false;

    return (
      (selectedOrder.status === 'OPEN' || selectedOrder.status === 'PREPARING') &&
      Number(selectedOrder.paidAmount) === 0 &&
      !selectedOrder.postedToFolioAt &&
      selectedOrder.payments.length === 0
    );
  }, [selectedOrder]);

  const matchedStayByRoom = useMemo(() => {
    const room = roomSearch.trim().toLowerCase();
    if (!room) return null;
    return inHouseStays.find((stay) => stay.roomUnit?.code?.toLowerCase() === room) ?? null;
  }, [inHouseStays, roomSearch]);

  const resolvedCustomerName = useMemo(() => {
    if (settlementType === 'FOLIO') {
      return selectedStay?.reservation.guestName ?? '';
    }
    return customerName.trim() || (salePreset === 'COMANDA' ? `Mesa ${tableNumber}` : 'Consumidor');
  }, [customerName, salePreset, selectedStay, settlementType, tableNumber]);

  const stepSequence: POSStep[] = ['items', 'payment', 'review'];
  const stepIndex = stepSequence.indexOf(currentStep);

  const setNumericValue = (field: NumericField, value: string) => {
    if (field === 'serviceFee') setServiceFeeAmount(value);
    if (field === 'discount') setDiscountAmount(value);
    if (field === 'payment') setPaymentAmount(value);
  };

  const getNumericValue = (field: NumericField) => {
    if (field === 'serviceFee') return serviceFeeAmount;
    if (field === 'discount') return discountAmount;
    return paymentAmount;
  };

  const applyKeypad = (key: string) => {
    const current = getNumericValue(activeNumericField);
    if (key === 'clear') return setNumericValue(activeNumericField, '');
    if (key === 'back') return setNumericValue(activeNumericField, current.slice(0, -1));
    if (key === '.' && current.includes('.')) return;
    const next = current === '0' && key !== '.' ? key : `${current}${key}`;
    setNumericValue(activeNumericField, next);
  };

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
    setEditingOrderId('');
    setCustomerName('');
    setTableNumber('');
    setSelectedStayId('');
    setServiceFeeAmount('');
    setDiscountAmount('');
    setPaymentAmount('');
    setPaymentReference('');
    setOrderNotes('');
    setDraftReference('');
    setReferenceLookup('');
    setRoomSearch('');
    setCurrentStep('items');
  };

  const applySalePreset = (preset: SalePreset) => {
    setSalePreset(preset);

    if (preset === 'BALCAO') {
      setOrigin('FRONTDESK');
      setSettlementType('DIRECT');
      setSelectedStayId('');
      setTableNumber('');
      return;
    }

    if (preset === 'COMANDA') {
      setOrigin('RESTAURANT');
      setSettlementType('DIRECT');
      setSelectedStayId('');
      return;
    }

    if (preset === 'QUARTO') {
      setOrigin('ROOM_SERVICE');
      setSettlementType('FOLIO');
      setTableNumber('');
    }
  };

  const openGuestSheetFromStay = (
    stay: Stay,
    initialTab: 'conta' | 'consumo' | 'conferencia' | 'acoes' | 'historico'
  ) => {
    setGuestSheetStay(stay);
    setGuestSheetInitialTab(initialTab);
    setGuestSheetOpen(true);
  };

  const handleSelectArrivalForCheckIn = (reservation: Reservation) => {
    setCheckInReservation(reservation);
    setCheckInRoomId('');
  };

  const handleConfirmCheckIn = async () => {
    if (!checkInReservation || !checkInRoomId) return;

    await checkIn.mutateAsync({
      reservationId: checkInReservation.id,
      roomUnitId: checkInRoomId,
    });

    setCheckInReservation(null);
    setCheckInRoomId('');
    setActiveDialog(null);
  };

  const handleWalkInSearchChange = (value: string) => {
    setWalkInSearch(value);
    if (walkInForm.customerId) {
      setWalkInForm((current) => ({ ...current, customerId: '' }));
    }
  };

  const handleSelectCustomerFromSearch = (customerId: string) => {
    const customer = customers.find((item) => item.id === customerId);
    if (!customer) return;

    setWalkInSearch(customer.name);
    setWalkInForm((current) => ({
      ...current,
      customerId: customer.id,
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      guestWhatsApp: '',
      guestCpf: '',
    }));
  };

  const handleWalkInCheckIn = async () => {
    if (!walkInForm.roomUnitId) return;

    await walkInCheckIn.mutateAsync({
      roomUnitId: walkInForm.roomUnitId,
      customerId: walkInForm.customerId || undefined,
      guestName: walkInForm.customerId ? undefined : walkInForm.guestName.trim(),
      guestEmail: walkInForm.customerId ? undefined : walkInForm.guestEmail.trim() || undefined,
      guestPhone: walkInForm.customerId ? undefined : walkInForm.guestPhone.trim() || undefined,
      guestWhatsApp: walkInForm.customerId ? undefined : walkInForm.guestWhatsApp.trim() || undefined,
      guestCpf: walkInForm.customerId ? undefined : walkInForm.guestCpf.trim() || undefined,
      checkInDate: walkInForm.checkInDate,
      checkOutDate: walkInForm.checkOutDate,
      adults: Number(walkInForm.adults),
      children: Number(walkInForm.children || 0),
      notes: walkInForm.notes.trim() || undefined,
      promotionId: walkInForm.promotionId || undefined,
    });

    setWalkInForm({
      roomUnitId: '',
      customerId: '',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      guestWhatsApp: '',
      guestCpf: '',
      checkInDate: new Date().toISOString().slice(0, 10),
      checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      adults: '1',
      children: '0',
      notes: '',
      promotionId: '',
    });
    setWalkInSearch('');
    setActiveDialog(null);
  };

  const handleStartGuestCharge = (stay: Stay) => {
    if (cartItems.length || editingOrderId) {
      toast.error('Finalize ou limpe a venda atual antes de vincular outra conta.');
      return;
    }

    applySalePreset('QUARTO');
    setSelectedStayId(stay.id);
    setRoomSearch(stay.roomUnit?.code ?? '');
    setCustomerName(stay.reservation.guestName);
    setCurrentStep('items');
    setActiveDialog(null);
    toast.success(`Conta do hóspede ${stay.reservation.guestName} vinculada ao PDV`);
  };

  const resolveQuickProduct = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return null;

    const exactMatch =
      activeProducts.find((product) => product.sku?.toLowerCase() === normalized) ||
      activeProducts.find((product) => product.id.toLowerCase() === normalized) ||
      activeProducts.find((product) => product.name.toLowerCase() === normalized);

    if (exactMatch) return exactMatch;

    const partialMatches = activeProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.sku?.toLowerCase().includes(normalized)
    );

    if (partialMatches.length === 1) return partialMatches[0];
    return null;
  };

  const loadDrafts = () => {
    try {
      const raw = window.localStorage.getItem('fusehotel.pos.drafts');
      if (!raw) return [];
      const parsed = JSON.parse(raw) as SavedDraft[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const persistDrafts = (drafts: SavedDraft[]) => {
    setSavedDrafts(drafts);
    window.localStorage.setItem('fusehotel.pos.drafts', JSON.stringify(drafts));
  };

  const saveCurrentDraft = () => {
    if (!cartItems.length) {
      toast.error('Não há itens para salvar na pré-venda');
      return;
    }

    const reference =
      draftReference.trim() ||
      tableNumber.trim() ||
      customerName.trim() ||
      `pre-venda-${new Date().toISOString().slice(11, 19).replace(/:/g, '')}`;

    const currentDrafts = loadDrafts();
    const nextDraft: SavedDraft = {
      id: currentDrafts.find((draft) => draft.reference === reference)?.id ?? crypto.randomUUID(),
      reference,
      salePreset,
      settlementType,
      origin,
      customerName,
      tableNumber,
      selectedStayId,
      serviceFeeAmount,
      discountAmount,
      paymentMethod,
      paymentAmount,
      paymentReference,
      orderNotes,
      cartItems,
      updatedAt: new Date().toISOString(),
    };

    const nextDrafts = [
      nextDraft,
      ...currentDrafts.filter((draft) => draft.id !== nextDraft.id),
    ].slice(0, 40);

    persistDrafts(nextDrafts);
    setDraftReference(reference);
    toast.success(`Pré-venda ${reference} salva`);
  };

  const restoreDraft = (draft: SavedDraft) => {
    setSalePreset(draft.salePreset === ('MESA' as SalePreset) ? 'COMANDA' : draft.salePreset);
    setSettlementType(draft.settlementType);
    setOrigin(draft.origin);
    setCustomerName(draft.customerName);
    setTableNumber(draft.tableNumber);
    setSelectedStayId(draft.selectedStayId);
    setServiceFeeAmount(draft.serviceFeeAmount);
    setDiscountAmount(draft.discountAmount);
    setPaymentMethod(draft.paymentMethod);
    setPaymentAmount(draft.paymentAmount);
    setPaymentReference(draft.paymentReference);
    setOrderNotes(draft.orderNotes);
    setCartItems(draft.cartItems);
    setDraftReference(draft.reference);
    setCurrentStep('items');
    setActiveDialog(null);
    toast.success(`Pré-venda ${draft.reference} restaurada`);
  };

  const deleteDraft = (id: string) => {
    persistDrafts(loadDrafts().filter((draft) => draft.id !== id));
  };

  const openDraftByReference = () => {
    const normalized = draftReference.trim().toLowerCase();
    if (!normalized) {
      toast.error('Informe uma mesa, comanda ou referência');
      return;
    }

    const draft = savedDrafts.find((item) => item.reference.toLowerCase() === normalized);
    if (!draft) {
      toast.error('Pré-venda não encontrada');
      return;
    }

    restoreDraft(draft);
  };

  const suspendCurrentSale = () => {
    if (!cartItems.length) {
      toast.error('Não há itens para suspender');
      return;
    }

    saveCurrentDraft();
    clearDraft();
    toast.success('Venda suspensa com sucesso');
  };

  const resumeLatestDraft = () => {
    const [latestDraft] = savedDrafts;
    if (!latestDraft) {
      toast.error('Nenhuma pré-venda salva');
      return;
    }

    restoreDraft(latestDraft);
  };

  const selectReferencedOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveDialog('orders');
  };

  const reopenOrderInCart = (order: typeof orders[number]) => {
    if (
      (order.status !== 'OPEN' && order.status !== 'PREPARING') ||
      Number(order.paidAmount) > 0 ||
      order.postedToFolioAt ||
      order.payments.length > 0
    ) {
      toast.error('Este pedido não pode mais ser reaberto para edição');
      return;
    }

    setEditingOrderId(order.id);
    setSelectedOrderId(order.id);
    setCartItems(order.items.map((item) => ({ productId: item.productId, quantity: Number(item.quantity) })));
    setSettlementType(order.settlementType);
    setOrigin(order.origin);
    setCustomerName(order.customerName ?? '');
    setTableNumber(order.tableNumber ?? '');
    setDraftReference(order.tableNumber ?? order.customerName ?? order.orderNumber);
    setSelectedStayId(order.stayId ?? '');
    setServiceFeeAmount(String(Number(order.serviceFeeAmount || 0) || ''));
    setDiscountAmount(String(Number(order.discountAmount || 0) || ''));
    setPaymentAmount('');
    setPaymentReference('');
    setOrderNotes(order.notes ?? '');

    if (order.settlementType === 'FOLIO' || order.origin === 'ROOM_SERVICE') {
      setSalePreset('QUARTO');
    } else if (order.tableNumber) {
      setSalePreset('COMANDA');
    } else {
      setSalePreset('BALCAO');
    }

    setCurrentStep('review');
    setActiveDialog(null);
    toast.success(`Pedido ${order.orderNumber} carregado no carrinho`);
  };

  const handleQuickAdd = (customCode?: string, customQuantity?: number) => {
    const product = resolveQuickProduct(customCode ?? quickCode);
    const quantity = Math.max(customQuantity ?? Number(quickQuantity || 1), 1);

    if (!product) {
      toast.error('Produto não encontrado pelo código informado');
      return;
    }

    setCartItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...current, { productId: product.id, quantity }];
    });

    if (!customCode) {
      setQuickCode('');
      setQuickQuantity('1');
    }
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  useEffect(() => {
    setSavedDrafts(loadDrafts());
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (isTyping) return;

      if (event.altKey && event.key === '1') {
        event.preventDefault();
        setActiveDialog('room-service-orders');
      }

      if (event.altKey && event.key === '2') {
        event.preventDefault();
        setActiveDialog('cash');
      }

      if (event.altKey && event.key === '3') {
        event.preventDefault();
        setActiveDialog('checkin');
      }

      if (event.altKey && event.key === '4') {
        event.preventDefault();
        setActiveDialog('checkout');
      }

      if (event.altKey && event.key === '5') {
        event.preventDefault();
        setActiveDialog('charge-stay');
      }

      if (event.altKey && event.key === '9') {
        event.preventDefault();
        setActiveDialog('drafts');
      }

      if (event.altKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        suspendCurrentSale();
      }

      if (event.altKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        resumeLatestDraft();
      }

      if (event.shiftKey && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        void toggleFullscreen();
      }

      if (event.altKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        const quickInput = document.getElementById('pos-quick-code') as HTMLInputElement | null;
        quickInput?.focus();
      }

      if (event.altKey && event.key.toLowerCase() === 'g') {
        event.preventDefault();
        saveCurrentDraft();
      }

      if (event.altKey && event.key.toLowerCase() === '0') {
        event.preventDefault();
        setActiveDialog('references');
      }

      if (!event.ctrlKey && !event.altKey && !event.metaKey && event.key.length === 1) {
        scannerBufferRef.current += event.key;

        if (scannerTimeoutRef.current) {
          window.clearTimeout(scannerTimeoutRef.current);
        }

        scannerTimeoutRef.current = window.setTimeout(() => {
          scannerBufferRef.current = '';
        }, 120);
      }

      if (event.key === 'Enter' && scannerBufferRef.current.length >= 3) {
        event.preventDefault();
        const scannedCode = scannerBufferRef.current;
        scannerBufferRef.current = '';
        if (scannerTimeoutRef.current) {
          window.clearTimeout(scannerTimeoutRef.current);
        }
        setQuickCode(scannedCode);
        handleQuickAdd(scannedCode, Number(quickQuantity || 1));
      }

      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        void handleFinalizeSale();
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        if (activeDialog) {
          setActiveDialog(null);
        } else {
          clearDraft();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeydown);
      if (scannerTimeoutRef.current) {
        window.clearTimeout(scannerTimeoutRef.current);
      }
    };
  }, [activeDialog, paymentAmount, paymentMethod, quickQuantity, selectedStayId, total, savedDrafts]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  const canAdvanceCurrentStep = () => {
    if (currentStep === 'items') return cartDetailedItems.length > 0;
    if (currentStep === 'payment') {
      if (settlementType === 'FOLIO') return Boolean(selectedStayId);
      if (salePreset === 'COMANDA' && !tableNumber.trim()) return false;
      return Boolean(paymentMethod);
    }
    return true;
  };

  const goToNextStep = () => {
    if (!canAdvanceCurrentStep()) {
      if (currentStep === 'items') {
        toast.error('Adicione ao menos um item antes de continuar');
        return;
      }

      if (currentStep === 'payment') {
        if (settlementType === 'FOLIO' && !selectedStayId) {
          toast.error('Selecione uma hospedagem para lançar na conta');
        } else if (salePreset === 'COMANDA' && !tableNumber.trim()) {
          toast.error('Informe o número da mesa ou comanda');
        } else {
          toast.error('Selecione a forma de pagamento');
        }
      }
      return;
    }

    const nextStep = stepSequence[stepIndex + 1];
    if (nextStep) setCurrentStep(nextStep);
  };

  const goToPreviousStep = () => {
    const previousStep = stepSequence[stepIndex - 1];
    if (previousStep) setCurrentStep(previousStep);
  };

  const handleFinalizeSale = async () => {
    if (!cartDetailedItems.length) {
      toast.error('Adicione itens ao carrinho');
      return;
    }

    if (settlementType === 'FOLIO' && !selectedStayId) {
      toast.error('Selecione uma hospedagem para lançar na conta');
      return;
    }

    if (settlementType === 'DIRECT' && paymentMethod === 'CASH' && !activeCashSession) {
      toast.error('Abra o caixa antes de receber em dinheiro');
      return;
    }

    try {
      const payload = {
        stayId: settlementType === 'FOLIO' ? selectedStayId : undefined,
        roomUnitId:
          settlementType === 'FOLIO'
            ? inHouseStays.find((stay) => stay.id === selectedStayId)?.roomUnitId ?? undefined
            : undefined,
        origin,
        settlementType,
        customerName: customerName.trim() || undefined,
        tableNumber: tableNumber || undefined,
        serviceFeeAmount: Number(serviceFeeAmount || 0) || undefined,
        discountAmount: Number(discountAmount || 0) || undefined,
        notes: orderNotes || undefined,
        items: cartDetailedItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = editingOrderId
        ? await updateOrder.mutateAsync({
            id: editingOrderId,
            payload,
          })
        : await createOrder.mutateAsync(payload);

      if (settlementType === 'DIRECT') {
        const remainingAmount = Math.max(Number(order.totalAmount) - Number(order.paidAmount), 0);
        const amountToPay = editingOrderId ? Number(paymentAmount || 0) : Number(paymentAmount || total);

        if (amountToPay > 0) {
          await registerPayment.mutateAsync({
            orderId: order.id,
            amount: amountToPay,
            method: paymentMethod,
            cashSessionId: paymentMethod === 'CASH' ? activeCashSession?.id : undefined,
            reference: paymentReference || undefined,
          });
        }

        if (amountToPay >= remainingAmount && remainingAmount > 0) {
          await updateOrderStatus.mutateAsync({ id: order.id, status: 'CLOSED' });
        }
      } else {
        await updateOrderStatus.mutateAsync({ id: order.id, status: 'DELIVERED' });
      }

      if (draftReference.trim()) {
        persistDrafts(loadDrafts().filter((draft) => draft.reference !== draftReference.trim()));
      }

      setSelectedOrderId(order.id);
      clearDraft();
      setActiveDialog(order.origin === 'ROOM_SERVICE' ? 'room-service-orders' : 'orders');
    } catch {
      return;
    }
  };

  const handleRegisterPayment = async () => {
    if (!selectedOrder) {
      toast.error('Selecione um pedido');
      return;
    }

    const remainingAmount = Number(selectedOrder.totalAmount) - Number(selectedOrder.paidAmount);
    const amount = Number(paymentAmount || remainingAmount);

    if (amount <= 0) {
      toast.error('Informe um valor válido');
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
      });

      if (amount >= remainingAmount) {
        await updateOrderStatus.mutateAsync({ id: selectedOrder.id, status: 'CLOSED' });
      }

      setPaymentAmount('');
      setPaymentReference('');
    } catch {
      return;
    }
  };

  const handleRefundPayment = async () => {
    if (!refundPaymentId) {
      toast.error('Selecione um pagamento para estorno');
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

  const handleUpdateSelectedOrderStatus = async (status: POSOrderStatus) => {
    if (!selectedOrder) {
      toast.error('Selecione um pedido');
      return;
    }

    try {
      await updateOrderStatus.mutateAsync({ id: selectedOrder.id, status });
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
      toast.error('Informe o valor contado');
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
      toast.error('Informe valor e descrição');
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

  const renderItemsStep = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">1. Inclua produtos e serviços</h2>
        <p className="mt-1 text-sm text-slate-500">Busque, filtre por categoria ou use leitura rápida para montar a venda.</p>
      </div>

      <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar item, produto ou serviço"
              className="h-12 rounded-2xl border-slate-200 pl-9 text-base"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
            <span>Leitura rápida</span>
            <span>Alt + C</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_72px_112px]">
            <Input
              id="pos-quick-code"
              value={quickCode}
              onChange={(event) => setQuickCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleQuickAdd();
                }
              }}
              placeholder="Código ou SKU"
              className="h-11 rounded-xl bg-white"
            />
            <Input
              value={quickQuantity}
              onChange={(event) => setQuickQuantity(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleQuickAdd();
                }
              }}
              placeholder="Qtd"
              className="h-11 rounded-xl bg-white"
            />
            <Button className="h-11 rounded-xl" onClick={handleQuickAdd}>
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Categorias</div>
        <Button
          variant="outline"
          className="h-10 rounded-2xl border-slate-200 px-4"
          onClick={() => {
            setCategory('ALL');
            setSearch('');
          }}
        >
          Limpar busca
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCategory('ALL')}
          className={`min-w-[140px] rounded-2xl border px-4 py-4 text-left transition ${
            category === 'ALL'
              ? 'border-sky-700 bg-sky-700 text-white shadow-sm'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
          }`}
        >
          <div className="font-semibold">Todos</div>
        </button>
        {productCategories.filter((c) => c.isActive).map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`min-w-[140px] rounded-2xl border px-4 py-4 text-left transition ${
              category === cat.id
                ? 'border-sky-700 bg-sky-700 text-white shadow-sm'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="font-semibold">{cat.label}</div>
          </button>
        ))}
      </div>

      <ScrollArea className="h-[42vh] min-h-[320px] max-h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {!filteredProducts.length ? (
            <div className="col-span-full rounded-2xl border border-dashed p-8 text-center text-slate-500">
              Nenhum item encontrado.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addProductToCart(product)}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-sky-400 hover:bg-sky-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="line-clamp-2 font-medium text-slate-900">{product.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{product.category?.label ?? '—'}</div>
                  </div>
                  <Grid2x2 className="h-4 w-4 shrink-0 text-slate-400" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">{currency.format(Number(product.price))}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {product.trackStock ? `Estoque ${product.stockQuantity}` : 'Livre'}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">2. Como cobrar</h2>
        <p className="mt-1 text-sm text-slate-500">Escolha a forma de pagamento ou lance na conta do hóspede.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <ModeCard
          title="Pagamento direto"
          description="Receber agora no caixa (PIX, dinheiro, cartão)."
          active={settlementType === 'DIRECT' && salePreset === 'BALCAO'}
          onClick={() => applySalePreset('BALCAO')}
        />
        <ModeCard
          title="Mesa / comanda"
          description="Abrir comanda para receber depois ou lançar na conta."
          active={salePreset === 'COMANDA'}
          onClick={() => applySalePreset('COMANDA')}
        />
        <ModeCard
          title="Conta do hóspede"
          description="Debitar na conta do quarto, acertar no check-out."
          active={settlementType === 'FOLIO' && salePreset === 'QUARTO'}
          onClick={() => applySalePreset('QUARTO')}
        />
      </div>

      {salePreset === 'BALCAO' && settlementType === 'DIRECT' && (
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_180px]">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px]">
              <FieldButton
                label="Pagamento"
                value={paymentAmount}
                active={activeNumericField === 'payment'}
                onClick={() => setActiveNumericField('payment')}
                dark={false}
              />
              <Button variant="outline" className="rounded-2xl" onClick={() => setActiveDialog('details')}>
                Ajustes e detalhes
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(['PIX', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-2xl py-3 text-sm font-semibold transition ${
                    paymentMethod === method
                      ? 'bg-sky-700 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {paymentMethodLabels[method]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00', '.'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => applyKeypad(key)}
                className="rounded-2xl py-3 text-base font-semibold bg-sky-700 text-white hover:bg-sky-600 transition"
              >
                {key}
              </button>
            ))}
            <button
              type="button"
              onClick={() => applyKeypad('clear')}
              className="col-span-2 rounded-2xl py-3 text-base font-semibold bg-red-500 text-white transition"
            >
              C
            </button>
            <button
              type="button"
              onClick={() => applyKeypad('back')}
              className="rounded-2xl py-3 text-base font-semibold bg-amber-400 text-slate-950 transition"
            >
              ←
            </button>
          </div>
        </div>
      )}

      {salePreset === 'COMANDA' && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">Mesa ou comanda</div>
              <Input
                value={tableNumber}
                onChange={(event) => {
                  setTableNumber(event.target.value);
                  setDraftReference(event.target.value);
                }}
                placeholder="Número da mesa ou comanda"
                className="h-12 rounded-2xl bg-white"
              />
              <p className="text-xs text-slate-500">Referência para acompanhar o consumo.</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setActiveDialog('references')}>
                  Buscar referência
                </Button>
                <Button variant="outline" onClick={() => setActiveDialog('drafts')}>
                  Vendas salvas
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">Fechar comanda como</div>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => { setSettlementType('DIRECT'); setSelectedStayId(''); setRoomSearch(''); }}
                  className={`rounded-2xl border p-3 text-left text-sm transition ${
                    settlementType === 'DIRECT'
                      ? 'border-sky-600 bg-sky-50 font-medium text-sky-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Pagamento direto no caixa
                </button>
                <button
                  type="button"
                  onClick={() => { setSettlementType('FOLIO'); setOrigin('ROOM_SERVICE'); }}
                  className={`rounded-2xl border p-3 text-left text-sm transition ${
                    settlementType === 'FOLIO'
                      ? 'border-sky-600 bg-sky-50 font-medium text-sky-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Lançar na conta do hóspede
                </button>
              </div>
            </div>
          </div>

          {settlementType === 'DIRECT' && (
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px]">
                <FieldButton
                  label="Pagamento"
                  value={paymentAmount}
                  active={activeNumericField === 'payment'}
                  onClick={() => setActiveNumericField('payment')}
                  dark={false}
                />
                <Button variant="outline" className="rounded-2xl" onClick={() => setActiveDialog('details')}>
                  Ajustes e detalhes
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['PIX', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD'] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-2xl py-3 text-sm font-semibold transition ${
                      paymentMethod === method
                        ? 'bg-sky-700 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {paymentMethodLabels[method]}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600">
                Deixe o valor zerado para manter a comanda em aberto sem receber agora.
              </div>
            </div>
          )}

          {settlementType === 'FOLIO' && (
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">Vincular ao hóspede</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    value={roomSearch}
                    onChange={(event) => {
                      setRoomSearch(event.target.value);
                      const room = event.target.value.trim().toLowerCase();
                      const match = inHouseStays.find((stay) => stay.roomUnit?.code?.toLowerCase() === room);
                      if (match) setSelectedStayId(match.id);
                    }}
                    placeholder="Número do quarto"
                    className="h-12 rounded-2xl bg-white"
                  />
                  {roomSearch.trim() && !matchedStayByRoom && (
                    <p className="text-xs text-red-500">Nenhum hóspede encontrado neste quarto.</p>
                  )}
                  {matchedStayByRoom && (
                    <p className="text-xs text-emerald-600">
                      {matchedStayByRoom.reservation.guestName} — Quarto {matchedStayByRoom.roomUnit?.code}
                    </p>
                  )}
                </div>
                <Select value={selectedStayId || 'none'} onValueChange={(value) => {
                  setSelectedStayId(value === 'none' ? '' : value);
                  const stay = inHouseStays.find((s) => s.id === value);
                  if (stay?.roomUnit?.code) setRoomSearch(stay.roomUnit.code);
                }}>
                  <SelectTrigger className="h-12 rounded-2xl bg-white">
                    <SelectValue placeholder="Ou selecione pelo nome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Selecionar hospedagem</SelectItem>
                    {inHouseStays.map((stay) => (
                      <SelectItem key={stay.id} value={stay.id}>
                        {stay.reservation.guestName} — Quarto {stay.roomUnit?.code ?? 'S/N'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedStay && (
                <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                  O consumo da comanda será lançado na conta de <strong>{selectedStay.reservation.guestName}</strong> (Quarto {selectedStay.roomUnit?.code ?? 'S/N'}).
                  Saída prevista em {new Date(selectedStay.reservation.checkOutDate).toLocaleDateString('pt-BR')}.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {salePreset === 'QUARTO' && settlementType === 'FOLIO' && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">Buscar por quarto</div>
              <Input
                value={roomSearch}
                onChange={(event) => {
                  setRoomSearch(event.target.value);
                  const room = event.target.value.trim().toLowerCase();
                  const match = inHouseStays.find((stay) => stay.roomUnit?.code?.toLowerCase() === room);
                  if (match) setSelectedStayId(match.id);
                }}
                placeholder="Número do quarto"
                className="h-12 rounded-2xl bg-white"
              />
              {roomSearch.trim() && !matchedStayByRoom && (
                <p className="text-xs text-red-500">Nenhum hóspede encontrado neste quarto.</p>
              )}
              {matchedStayByRoom && (
                <p className="text-xs text-emerald-600">
                  {matchedStayByRoom.reservation.guestName} — Quarto {matchedStayByRoom.roomUnit?.code}
                </p>
              )}
            </div>

            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">Ou selecione pelo nome</div>
              <Select value={selectedStayId || 'none'} onValueChange={(value) => {
                setSelectedStayId(value === 'none' ? '' : value);
                const stay = inHouseStays.find((s) => s.id === value);
                if (stay?.roomUnit?.code) setRoomSearch(stay.roomUnit.code);
              }}>
                <SelectTrigger className="h-12 rounded-2xl bg-white">
                  <SelectValue placeholder="Selecionar hospedagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecionar hospedagem</SelectItem>
                  {inHouseStays.map((stay) => (
                    <SelectItem key={stay.id} value={stay.id}>
                      {stay.reservation.guestName} — Quarto {stay.roomUnit?.code ?? 'S/N'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedStay && (
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  <div><strong className="text-slate-900">{selectedStay.reservation.guestName}</strong></div>
                  <div>Quarto {selectedStay.roomUnit?.code ?? 'S/N'}</div>
                  <div>Saída prevista em {new Date(selectedStay.reservation.checkOutDate).toLocaleDateString('pt-BR')}</div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
            O consumo será lançado diretamente na conta da hospedagem e poderá ser acertado no check-out.
          </div>
          <Button variant="outline" className="rounded-2xl" onClick={() => setActiveDialog('details')}>
            Ajustes e detalhes
          </Button>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">3. Revise e conclua</h2>
        <p className="mt-1 text-sm text-slate-500">Confira os dados antes de finalizar a venda.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <DialogStat label="Cliente" value={resolvedCustomerName || 'Consumidor'} />
        <DialogStat
          label="Pagamento"
          value={settlementType === 'FOLIO' ? 'Conta do hóspede' : salePresetLabels[salePreset]}
        />
        <DialogStat label="Itens" value={`${cartDetailedItems.length}`} />
      </div>

      {settlementType === 'DIRECT' && (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-900 mb-3">Identificação do cliente (opcional)</div>
          <p className="text-xs text-slate-500 mb-3">Preencha apenas se o cliente solicitar CPF na nota ou quiser se identificar.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Nome do cliente"
              className="h-11 rounded-2xl bg-white"
            />
            <Input
              value={orderNotes}
              onChange={(event) => setOrderNotes(event.target.value)}
              placeholder="CPF para nota fiscal"
              className="h-11 rounded-2xl bg-white"
            />
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200">
        <div className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">Itens da venda</div>
        <div className="space-y-3 p-4">
          {!cartDetailedItems.length ? (
            <EmptyInline text="Nenhum item adicionado." />
          ) : (
            cartDetailedItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <div className="font-medium text-slate-900">{item.product.name}</div>
                  <div className="text-sm text-slate-500">{item.quantity} x {currency.format(Number(item.product.price))}</div>
                </div>
                <div className="font-semibold text-slate-900">{currency.format(item.total)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (currentStep === 'items') return renderItemsStep();
    if (currentStep === 'payment') return renderPaymentStep();
    return renderReviewStep();
  };

  return (
    <AdminLayout>
      <div className="space-y-4 p-4 md:p-6 lg:min-h-[calc(100dvh-4rem)]">
        <div className="rounded-3xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">PDV</div>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">Caixa / PDV</h1>
                  <p className="text-sm text-slate-500">Venda direta, room service e cobrança na conta do hóspede.</p>
                </div>
              </div>
              <div className="inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600 2xl:flex-none">
                <Keyboard className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate whitespace-nowrap">Alt+1 pedidos • Alt+2 caixa • Alt+3 check-in • Alt+4 checkout • Alt+5 despesas • Alt+9 pré-vendas • Alt+0 referências</span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:min-w-[540px]">
              <TopMetric label="Caixa" value={activeCashSession ? activeCashSession.code : 'Fechado'} icon={Wallet} dark={false} />
              <TopMetric label="Receita PDV" value={currency.format(report?.finance.posRevenueMonth ?? 0)} icon={CreditCard} dark={false} />
              <Button
                variant="outline"
                className="h-full min-h-[58px] justify-center rounded-2xl border-slate-200 px-4 text-slate-700 hover:bg-slate-50"
                onClick={() => void toggleFullscreen()}
              >
                {isFullscreen ? <Minimize2 className="mr-2 h-4 w-4 shrink-0" /> : <Maximize2 className="mr-2 h-4 w-4 shrink-0" />}
                {isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
          <div className="rounded-3xl border bg-slate-950 p-3 text-white shadow-sm">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <SideAction icon={LogIn} label="Check-in" description="Chegadas confirmadas e walk-in" shortcut="Alt + 3" active={activeDialog === 'checkin'} onClick={() => setActiveDialog('checkin')} />
              <SideAction icon={LogOut} label="Checkout" description="Conferência e saída do hóspede" shortcut="Alt + 4" active={activeDialog === 'checkout'} onClick={() => setActiveDialog('checkout')} />
              <SideAction icon={ShoppingCart} label="Pedidos" description="Serviço de quarto e entrega" shortcut="Alt + 1" active={activeDialog === 'room-service-orders'} onClick={() => setActiveDialog('room-service-orders')} />
              <SideAction icon={Receipt} label="Incluir despesas" description="Lançar produtos na conta do hóspede" shortcut="Alt + 5" active={activeDialog === 'charge-stay'} onClick={() => setActiveDialog('charge-stay')} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" className="rounded-2xl bg-white/10 text-white hover:bg-white/15" onClick={() => setActiveDialog('cash')}>
                Caixa
              </Button>
              <Button variant="secondary" size="sm" className="rounded-2xl bg-white/10 text-white hover:bg-white/15" onClick={() => setActiveDialog('drafts')}>
                Pré-vendas
              </Button>
              <Button variant="secondary" size="sm" className="rounded-2xl bg-white/10 text-white hover:bg-white/15" onClick={() => setActiveDialog('references')}>
                Referências
              </Button>
            </div>
          </div>

          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="rounded-3xl border bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {stepSequence.map((step, index) => {
                  const active = currentStep === step;
                  const completed = index < stepIndex;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        if (index <= stepIndex) setCurrentStep(step);
                      }}
                      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? 'border-sky-600 bg-sky-600 text-white'
                          : completed
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}
                    >
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        active ? 'bg-white/20 text-white' : completed ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium">{posStepLabels[step]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">{renderStepContent()}</div>
            </div>

            <div className="space-y-4 2xl:sticky 2xl:top-4 2xl:self-start">
              <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Resumo da venda</div>
                    <div className="mt-1 text-xl font-semibold">{posStepLabels[currentStep]}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingOrder && <Badge className="bg-amber-500/20 text-amber-200 hover:bg-amber-500/20">Editando {editingOrder.orderNumber}</Badge>}
                    <Badge className="bg-white/10 text-white hover:bg-white/10">{cartDetailedItems.length} itens</Badge>
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <SummaryRow label="Cliente" value={resolvedCustomerName || 'Consumidor'} />
                  <SummaryRow label="Cobrança" value={settlementType === 'FOLIO' ? 'Conta do hóspede' : salePresetLabels[salePreset]} />
                  <SummaryRow label="Referência" value={settlementType === 'FOLIO' ? (selectedStay ? `Quarto ${selectedStay.roomUnit?.code ?? 'S/N'}` : 'Aguardando') : (tableNumber || '—')} />
                  <SummaryRow label="Pagamento" value={settlementType === 'DIRECT' ? paymentMethodLabels[paymentMethod] : 'Conta do hóspede'} />
                </div>

                <ScrollArea className="mt-4 max-h-[260px] rounded-2xl border border-white/10 bg-white/5">
                  <div className="space-y-2 p-3">
                    {!cartDetailedItems.length ? (
                      <div className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-sm text-slate-400">Nenhum item adicionado.</div>
                    ) : (
                      cartDetailedItems.map((item) => (
                        <div key={item.productId} className="rounded-2xl border border-white/10 bg-black/10 px-3 py-2">
                          <div className="line-clamp-1 text-sm font-medium">{item.product.name}</div>
                          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                            <span>{item.quantity}x</span>
                            <span>{currency.format(item.total)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="mt-4 rounded-3xl bg-white px-4 py-5 text-slate-950">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>{currency.format(subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                    <span>Ajustes</span>
                    <span>{currency.format(Number(serviceFeeAmount || 0) - Number(discountAmount || 0))}</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <span className="text-base font-medium">Valor total</span>
                    <span className="text-4xl font-semibold">{currency.format(total)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-4 shadow-sm">
                <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-1">
                  <Button variant="outline" className="rounded-2xl" onClick={clearDraft}>
                    Limpar venda
                  </Button>
                  {stepIndex > 0 ? (
                    <Button variant="outline" className="rounded-2xl" onClick={goToPreviousStep}>
                      Voltar etapa
                    </Button>
                  ) : null}
                  {currentStep !== 'review' ? (
                    <Button className="rounded-2xl" onClick={goToNextStep}>
                      Próxima etapa
                    </Button>
                  ) : (
                    <Button
                      className="h-14 rounded-2xl bg-emerald-500 text-base font-semibold text-white hover:bg-emerald-600"
                      onClick={handleFinalizeSale}
                      disabled={createOrder.isPending || updateOrder.isPending || registerPayment.isPending || updateOrderStatus.isPending}
                    >
                      {editingOrder
                        ? settlementType === 'DIRECT'
                          ? Number(paymentAmount || 0) > 0
                            ? 'Salvar e receber'
                            : 'Salvar comanda'
                          : 'Atualizar e lançar consumo'
                        : settlementType === 'DIRECT'
                          ? 'Receber e finalizar'
                          : 'Lançar consumo'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <Dialog open={activeDialog === 'details'} onOpenChange={(open) => setActiveDialog(open ? 'details' : null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajustes e detalhes</DialogTitle>
            <DialogDescription>Use apenas quando precisar complementar a venda.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <FieldButton label="Taxa" value={serviceFeeAmount} active={activeNumericField === 'serviceFee'} onClick={() => setActiveNumericField('serviceFee')} dark={false} />
              <FieldButton label="Desconto" value={discountAmount} active={activeNumericField === 'discount'} onClick={() => setActiveNumericField('discount')} dark={false} />
            </div>

            {settlementType === 'DIRECT' ? (
              <Input
                value={paymentReference}
                onChange={(event) => setPaymentReference(event.target.value)}
                placeholder="NSU ou referência"
              />
            ) : null}

            <Textarea
              value={orderNotes}
              onChange={(event) => setOrderNotes(event.target.value)}
              placeholder="Observações internas"
              className="min-h-24"
            />

            <div className="grid grid-cols-3 gap-2">
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00', '.'].map((key) => (
                <button
                  key={`details-${key}`}
                  type="button"
                  onClick={() => applyKeypad(key)}
                  className="rounded-2xl py-3 text-base font-semibold bg-sky-700 text-white hover:bg-sky-600 transition"
                >
                  {key}
                </button>
              ))}
              <button
                type="button"
                onClick={() => applyKeypad('clear')}
                className="col-span-2 rounded-2xl py-3 text-base font-semibold bg-red-500 text-white transition"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => applyKeypad('back')}
                className="rounded-2xl py-3 text-base font-semibold bg-amber-400 text-slate-950 transition"
              >
                ←
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <GuestSheet
        stay={guestSheetStay}
        open={guestSheetOpen}
        onOpenChange={setGuestSheetOpen}
        initialTab={guestSheetInitialTab}
      />

      <Dialog open={activeDialog === 'checkin'} onOpenChange={(open) => setActiveDialog(open ? 'checkin' : null)}>
        <DialogContent className="max-h-[90dvh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Check-in pelo PDV</DialogTitle>
            <DialogDescription>Use o mesmo fluxo da recepção para abrir uma hospedagem sem sair do caixa.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="arrivals" className="space-y-4">
            <TabsList>
              <TabsTrigger value="arrivals">Chegadas confirmadas</TabsTrigger>
              <TabsTrigger value="walkin">Walk-in</TabsTrigger>
            </TabsList>

            <TabsContent value="arrivals" className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
                <Card>
                  <CardContent className="space-y-3 p-4">
                    <div className="font-medium">Reservas aguardando check-in</div>
                    {!arrivals.length ? (
                      <EmptyInline text="Nenhuma chegada confirmada no momento." />
                    ) : (
                      arrivals.map((reservation) => (
                        <button
                          key={reservation.id}
                          type="button"
                          onClick={() => handleSelectArrivalForCheckIn(reservation)}
                          className={`w-full rounded-2xl border p-3 text-left transition ${
                            checkInReservation?.id === reservation.id ? 'border-slate-900 bg-slate-50' : 'hover:border-slate-300'
                          }`}
                        >
                          <div className="font-medium">{reservation.guestName}</div>
                          <div className="mt-1 text-sm text-slate-500">{reservation.reservationCode}</div>
                          <div className="mt-2 text-sm text-slate-600">
                            {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')} - {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
                          </div>
                        </button>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-4 p-4">
                    {!checkInReservation ? (
                      <EmptyInline text="Selecione uma chegada para escolher o quarto e confirmar o check-in." />
                    ) : (
                      <>
                        <div className="rounded-2xl border p-4">
                          <div className="font-medium">{checkInReservation.guestName}</div>
                          <div className="mt-1 text-sm text-slate-500">{checkInReservation.reservationCode}</div>
                          <div className="mt-3 text-sm text-slate-600">
                            {checkInReservation.accommodation?.name} • {checkInReservation.numberOfGuests} hóspede(s)
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Selecionar quarto disponível</Label>
                          <Select value={checkInRoomId || 'none'} onValueChange={(value) => setCheckInRoomId(value === 'none' ? '' : value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha um quarto" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Selecione</SelectItem>
                              {checkInCandidateRooms.map((roomUnit) => (
                                <SelectItem key={roomUnit.id} value={roomUnit.id}>
                                  {roomUnit.code} - {roomUnit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!checkInCandidateRooms.length && (
                            <p className="text-sm text-amber-600">Nenhum quarto disponível para esta reserva.</p>
                          )}
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCheckInReservation(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={() => void handleConfirmCheckIn()} disabled={!checkInRoomId || checkIn.isPending}>
                            Confirmar check-in
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="walkin" className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <Card>
                  <CardContent className="space-y-4 p-4">
                    <div className="space-y-2">
                      <Label>Pesquisar cliente</Label>
                      <Input
                        value={walkInSearch}
                        onChange={(event) => handleWalkInSearchChange(event.target.value)}
                        placeholder="Nome, WhatsApp, telefone, email ou CPF"
                      />
                    </div>

                    {walkInSearch.trim() ? (
                      <div className="rounded-2xl border">
                        {customerSearchResults.length ? (
                          <div className="max-h-72 overflow-y-auto py-1">
                            {customerSearchResults.slice(0, 8).map((customer) => (
                              <button
                                key={customer.id}
                                type="button"
                                className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                                  walkInForm.customerId === customer.id ? 'bg-sky-50' : ''
                                }`}
                                onClick={() => handleSelectCustomerFromSearch(customer.id)}
                              >
                                <span className="font-medium text-slate-900">{customer.name}</span>
                                <span className="text-slate-500">
                                  {customer.whatsapp || customer.phone || customer.email || 'Sem contato'}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-3 py-2 text-sm text-slate-500">Nenhum hóspede encontrado para essa pesquisa.</div>
                        )}
                      </div>
                    ) : null}

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setCustomerDialogOpen(true)}>
                        Cadastrar cliente
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Cliente cadastrado</Label>
                      <Select
                        value={walkInForm.customerId || 'none'}
                        onValueChange={(value) =>
                          setWalkInForm((current) => ({
                            ...current,
                            customerId: value === 'none' ? '' : value,
                            guestName: value === 'none' ? current.guestName : '',
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar cliente existente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Informar hóspede manualmente</SelectItem>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} {customer.whatsapp ? `- ${customer.whatsapp}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedWalkInCustomer ? (
                      <div className="rounded-2xl border p-4 text-sm text-slate-600">
                        <div className="font-medium text-slate-900">{selectedWalkInCustomer.name}</div>
                        <div>{selectedWalkInCustomer.email}</div>
                        <div>{selectedWalkInCustomer.whatsapp || selectedWalkInCustomer.phone || 'Sem telefone'}</div>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Nome do hóspede</Label>
                          <Input value={walkInForm.guestName} onChange={(event) => setWalkInForm((current) => ({ ...current, guestName: event.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={walkInForm.guestEmail} onChange={(event) => setWalkInForm((current) => ({ ...current, guestEmail: event.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Telefone</Label>
                          <Input value={walkInForm.guestPhone} onChange={(event) => setWalkInForm((current) => ({ ...current, guestPhone: event.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>WhatsApp</Label>
                          <Input value={walkInForm.guestWhatsApp} onChange={(event) => setWalkInForm((current) => ({ ...current, guestWhatsApp: event.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>CPF</Label>
                          <Input value={walkInForm.guestCpf} onChange={(event) => setWalkInForm((current) => ({ ...current, guestCpf: event.target.value }))} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-4 p-4">
                    <div className="space-y-2">
                      <Label>Quarto disponível</Label>
                      <Select
                        value={walkInForm.roomUnitId || 'none'}
                        onValueChange={(value) => setWalkInForm((current) => ({ ...current, roomUnitId: value === 'none' ? '' : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar quarto disponível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Selecione</SelectItem>
                          {availableWalkInRooms.map((roomUnit) => (
                            <SelectItem key={roomUnit.id} value={roomUnit.id}>
                              {roomUnit.code} - {roomUnit.name} - {roomUnit.accommodation?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Check-in</Label>
                        <Input type="date" value={walkInForm.checkInDate} onChange={(event) => setWalkInForm((current) => ({ ...current, checkInDate: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Check-out</Label>
                        <Input type="date" value={walkInForm.checkOutDate} onChange={(event) => setWalkInForm((current) => ({ ...current, checkOutDate: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Adultos</Label>
                        <Input type="number" min={1} value={walkInForm.adults} onChange={(event) => setWalkInForm((current) => ({ ...current, adults: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Crianças</Label>
                        <Input type="number" min={0} value={walkInForm.children} onChange={(event) => setWalkInForm((current) => ({ ...current, children: event.target.value }))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Promoção / Pacote</Label>
                      <Select
                        value={walkInForm.promotionId || 'none'}
                        onValueChange={(value) => setWalkInForm((current) => ({ ...current, promotionId: value === 'none' ? '' : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Nenhuma promoção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma promoção</SelectItem>
                          {promotions.map((promotion: any) => (
                            <SelectItem key={promotion.id} value={promotion.id}>
                              {promotion.title}
                              {promotion.discountPercent ? ` (-${promotion.discountPercent}%)` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={walkInForm.notes}
                        onChange={(event) => setWalkInForm((current) => ({ ...current, notes: event.target.value }))}
                        placeholder="Preferências, garantia, observações da recepção..."
                      />
                    </div>

                    <div className="rounded-2xl border p-4 text-sm text-slate-600">
                      <div className="font-medium text-slate-900">
                        {selectedWalkInRoom?.accommodation?.name || 'Selecione um quarto'}
                      </div>
                      <div>{selectedWalkInRoom ? `${selectedWalkInRoom.code} - ${selectedWalkInRoom.name}` : 'Sem quarto definido'}</div>
                    </div>

                    <DialogFooter>
                      <Button onClick={() => void handleWalkInCheckIn()} disabled={!walkInForm.roomUnitId || walkInCheckIn.isPending}>
                        Fazer check-in no quarto
                      </Button>
                    </DialogFooter>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'checkout'} onOpenChange={(open) => setActiveDialog(open ? 'checkout' : null)}>
        <DialogContent className="max-h-[90dvh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout pelo PDV</DialogTitle>
            <DialogDescription>Abra a ficha da hospedagem para conferir o quarto, receber saldo pendente e concluir a saída.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            {!inHouseStays.length ? (
              <EmptyInline text="Nenhuma hospedagem ativa no momento." />
            ) : (
              inHouseStays.map((stay) => {
                const balance = Number(stay.folio?.balance ?? 0);
                const checkoutReady = Boolean(stay.checkoutReleasedAt);
                return (
                  <div key={stay.id} className="rounded-2xl border p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="font-medium">{stay.reservation.guestName}</div>
                        <div className="mt-1 text-sm text-slate-500">
                          Quarto {stay.roomUnit?.code ?? 'S/N'} • Saída prevista em {new Date(stay.reservation.checkOutDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="outline">{checkoutReady ? 'Conferência liberada' : 'Aguardando conferência'}</Badge>
                          {balance > 0 && <Badge variant="outline">Saldo {currency.format(balance)}</Badge>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setActiveDialog(null);
                            openGuestSheetFromStay(stay, checkoutReady ? 'acoes' : 'conferencia');
                          }}
                        >
                          Abrir checkout
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'charge-stay'} onOpenChange={(open) => setActiveDialog(open ? 'charge-stay' : null)}>
        <DialogContent className="max-h-[90dvh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Incluir despesas na conta do hóspede</DialogTitle>
            <DialogDescription>Selecione uma hospedagem ativa para lançar produtos e serviços diretamente na conta do quarto.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            {!inHouseStays.length ? (
              <EmptyInline text="Nenhuma hospedagem ativa disponível para lançamento em conta." />
            ) : (
              inHouseStays.map((stay) => (
                <div key={stay.id} className="rounded-2xl border p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="font-medium">{stay.reservation.guestName}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        Quarto {stay.roomUnit?.code ?? 'S/N'} • Saldo atual {currency.format(Number(stay.folio?.balance ?? 0))}
                      </div>
                    </div>
                    <Button onClick={() => handleStartGuestCharge(stay)}>Lançar despesas no PDV</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'room-service-orders'} onOpenChange={(open) => setActiveDialog(open ? 'room-service-orders' : null)}>
        <DialogContent className="max-h-[90dvh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pedidos do serviço de quarto</DialogTitle>
            <DialogDescription>Visualize, coloque em preparo, entregue e gerencie pedidos feitos pelo hóspede sem sair do PDV.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="font-medium">Pedidos do quarto</div>
                {!roomServiceOrders.length ? (
                  <EmptyInline text="Nenhum pedido de serviço de quarto encontrado." />
                ) : (
                  roomServiceOrders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`w-full rounded-2xl border p-3 text-left transition ${
                        selectedOrderId === order.id ? 'border-slate-900 bg-slate-50' : 'hover:border-slate-300'
                      }`}
                    >
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {order.customerName || order.stay?.reservation.guestName || 'Hóspede'} • Quarto {order.roomUnit?.code || order.stay?.roomUnit?.code || 'S/N'}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline">{orderStatusLabels[order.status]}</Badge>
                        <span className="text-sm font-medium text-slate-900">{currency.format(Number(order.totalAmount))}</span>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-4">
                {!selectedOrder || selectedOrder.origin !== 'ROOM_SERVICE' ? (
                  <EmptyInline text="Selecione um pedido de serviço de quarto para gerenciar." />
                ) : (
                  <>
                    <div className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{selectedOrder.orderNumber}</div>
                          <div className="mt-1 text-sm text-slate-500">
                            {selectedOrder.customerName || selectedOrder.stay?.reservation.guestName || 'Hóspede'} • Quarto {selectedOrder.roomUnit?.code || selectedOrder.stay?.roomUnit?.code || 'S/N'}
                          </div>
                        </div>
                        <Badge variant="outline">{orderStatusLabels[selectedOrder.status]}</Badge>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-600">
                        <span>Total {currency.format(Number(selectedOrder.totalAmount))}</span>
                        <span>Pago {currency.format(Number(selectedOrder.paidAmount))}</span>
                        <span>Liquidação {settlementLabels[selectedOrder.settlementType]}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedOrder.status === 'OPEN' && (
                          <Button variant="outline" onClick={() => void handleUpdateSelectedOrderStatus('PREPARING')} disabled={updateOrderStatus.isPending}>
                            Colocar em preparo
                          </Button>
                        )}
                        {(selectedOrder.status === 'OPEN' || selectedOrder.status === 'PREPARING') && (
                          <Button variant="outline" onClick={() => void handleUpdateSelectedOrderStatus('DELIVERED')} disabled={updateOrderStatus.isPending}>
                            Marcar como entregue
                          </Button>
                        )}
                        {selectedOrder.status === 'DELIVERED' && selectedOrder.settlementType === 'DIRECT' && (
                          <Button variant="outline" onClick={() => void handleUpdateSelectedOrderStatus('CLOSED')} disabled={updateOrderStatus.isPending}>
                            Fechar pedido
                          </Button>
                        )}
                        {selectedOrder.stay && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActiveDialog(null);
                              openGuestSheetFromStay(selectedOrder.stay as Stay, 'conta');
                            }}
                          >
                            Abrir conta do hóspede
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                          <span>{item.quantity}x {item.productName}</span>
                          <span>{currency.format(Number(item.totalPrice))}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-3 xl:grid-cols-[1fr_220px]">
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
        </DialogContent>
      </Dialog>

      <CreateCustomerDialog
        open={customerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
        hideRoleField
        defaultRole="CUSTOMER"
      />

      <Dialog open={activeDialog === 'cash'} onOpenChange={(open) => setActiveDialog(open ? 'cash' : null)}>
        <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Operações de caixa</DialogTitle>
            <DialogDescription>Abertura, sangria, suprimento e fechamento.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="font-medium">Status atual</div>
                {!activeCashSession ? (
                  <>
                    <Input value={openingFloat} onChange={(event) => setOpeningFloat(event.target.value)} placeholder="Fundo inicial" />
                    <Textarea value={cashNotes} onChange={(event) => setCashNotes(event.target.value)} placeholder="Observações" />
                    <Button className="w-full" onClick={handleOpenCash} disabled={openCashSession.isPending}>
                      Abrir caixa
                    </Button>
                  </>
                ) : (
                  <div className="rounded-2xl border p-4">
                    <div className="font-medium">{activeCashSession.code}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      Aberto em {new Date(activeCashSession.openedAt).toLocaleString('pt-BR')}
                    </div>
                    <div className="mt-3 text-sm text-slate-600">
                      Fundo {currency.format(Number(activeCashSession.openingFloat))}
                    </div>
                    <div className="text-sm text-slate-600">
                      Esperado {currency.format(Number(activeCashSession.expectedCashAmount ?? 0))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="font-medium">Movimentar e fechar</div>
                <Select value={cashMovementType} onValueChange={(value) => setCashMovementType(value as Extract<CashMovementType, 'SUPPLY' | 'WITHDRAWAL'>)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPPLY">Suprimento</SelectItem>
                    <SelectItem value="WITHDRAWAL">Sangria</SelectItem>
                  </SelectContent>
                </Select>
                <Input value={cashMovementAmount} onChange={(event) => setCashMovementAmount(event.target.value)} placeholder="Valor" />
                <Input value={cashMovementDescription} onChange={(event) => setCashMovementDescription(event.target.value)} placeholder="Descrição" />
                <Button variant="outline" onClick={handleCashMovement} disabled={createCashMovement.isPending}>
                  Registrar movimentação
                </Button>
                <Input value={countedCashAmount} onChange={(event) => setCountedCashAmount(event.target.value)} placeholder="Valor contado" />
                <Textarea value={cashNotes} onChange={(event) => setCashNotes(event.target.value)} placeholder="Observações do fechamento" />
                <Button onClick={handleCloseCash} disabled={closeCashSession.isPending}>
                  Fechar caixa
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'drafts'} onOpenChange={(open) => setActiveDialog(open ? 'drafts' : null)}>
        <DialogContent className="max-h-[90dvh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pré-vendas e comandas salvas</DialogTitle>
            <DialogDescription>Retome vendas suspensas, mesas e comandas em aberto.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="font-medium">Nova referência</div>
                <Input
                  value={draftReference}
                  onChange={(event) => setDraftReference(event.target.value)}
                  placeholder="Mesa, comanda ou nome da pré-venda"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={saveCurrentDraft}>
                    Salvar atual
                  </Button>
                  <Button onClick={openDraftByReference}>Abrir</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="font-medium">Salvas localmente</div>
                {!savedDrafts.length ? (
                  <EmptyInline text="Nenhuma pré-venda salva." />
                ) : (
                  savedDrafts.map((draft) => (
                    <div key={draft.id} className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{draft.reference}</div>
                          <div className="mt-1 text-sm text-slate-500">
                            {salePresetLabels[draft.salePreset]} • {draft.cartItems.length} item(ns) • {new Date(draft.updatedAt).toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <Badge variant="outline">{settlementLabels[draft.settlementType]}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => restoreDraft(draft)}>
                          Retomar
                        </Button>
                        <Button variant="destructive" onClick={() => deleteDraft(draft.id)}>
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'references'} onOpenChange={(open) => setActiveDialog(open ? 'references' : null)}>
        <DialogContent className="max-h-[90dvh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Referências rápidas</DialogTitle>
            <DialogDescription>Encontre mesas, comandas, nomes ou pedidos sem sair do caixa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="font-medium">Buscar referência</div>
                <Input
                  value={referenceLookup}
                  onChange={(event) => setReferenceLookup(event.target.value)}
                  placeholder="Mesa, comanda, cliente ou pedido"
                />
                <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-600">
                  {normalizedReferenceLookup
                    ? `${referencedOpenOrders.length} pedido(s) encontrado(s) em aberto`
                    : 'Digite uma referência para filtrar pedidos e vendas suspensas.'}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setActiveDialog('orders')}>
                    Ir para pedidos
                  </Button>
                  <Button variant="outline" onClick={() => setActiveDialog('drafts')}>
                    Ir para pré-vendas
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card>
                <CardContent className="space-y-3 p-4">
                  <div className="font-medium">Pedidos em aberto</div>
                  {!referencedOpenOrders.length ? (
                    <EmptyInline text="Nenhum pedido aberto para esta referência." />
                  ) : (
                    referencedOpenOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => selectReferencedOrder(order.id)}
                        className="w-full rounded-2xl border p-4 text-left transition hover:border-slate-400 hover:bg-slate-50"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            selectReferencedOrder(order.id);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{order.orderNumber}</div>
                            <div className="mt-1 text-sm text-slate-500">
                              {order.tableNumber || order.customerName || 'Sem referência'} • {originLabels[order.origin]}
                            </div>
                          </div>
                          <Badge variant="outline">{orderStatusLabels[order.status]}</Badge>
                        </div>
                        <div className="mt-3 text-sm font-medium text-slate-900">
                          Total {currency.format(Number(order.totalAmount))} • Pago {currency.format(Number(order.paidAmount))}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              reopenOrderInCart(order);
                            }}
                            disabled={
                              !(
                                (order.status === 'OPEN' || order.status === 'PREPARING') &&
                                Number(order.paidAmount) === 0 &&
                                !order.postedToFolioAt &&
                                order.payments.length === 0
                              )
                            }
                          >
                            Editar no carrinho
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-3 p-4">
                  <div className="font-medium">Pré-vendas salvas</div>
                  {!savedDrafts.filter((draft) =>
                    !normalizedReferenceLookup || draft.reference.toLowerCase().includes(normalizedReferenceLookup)
                  ).length ? (
                    <EmptyInline text="Nenhuma pré-venda salva para esta referência." />
                  ) : (
                    savedDrafts
                      .filter((draft) => !normalizedReferenceLookup || draft.reference.toLowerCase().includes(normalizedReferenceLookup))
                      .map((draft) => (
                        <div key={draft.id} className="rounded-2xl border p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium">{draft.reference}</div>
                              <div className="mt-1 text-sm text-slate-500">
                                {salePresetLabels[draft.salePreset]} • {draft.cartItems.length} item(ns)
                              </div>
                            </div>
                            <Badge variant="outline">{settlementLabels[draft.settlementType]}</Badge>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button variant="outline" onClick={() => restoreDraft(draft)}>
                              Retomar
                            </Button>
                            <Button variant="destructive" onClick={() => deleteDraft(draft.id)}>
                              Excluir
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'orders'} onOpenChange={(open) => setActiveDialog(open ? 'orders' : null)}>
        <DialogContent className="max-h-[90dvh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pedidos e recebimento</DialogTitle>
            <DialogDescription>Gerencie pedidos abertos, recebimentos, estornos e cancelamentos.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="font-medium">Pedidos em aberto</div>
                {!openOrders.length ? (
                  <EmptyInline text="Nenhum pedido aberto." />
                ) : (
                  openOrders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`w-full rounded-2xl border p-3 text-left transition ${
                        selectedOrderId === order.id ? 'border-slate-900 bg-slate-50' : 'hover:border-slate-300'
                      }`}
                    >
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {originLabels[order.origin]} • {settlementLabels[order.settlementType]}
                      </div>
                      <div className="mt-2 text-sm font-medium text-slate-900">
                        {currency.format(Number(order.totalAmount))}
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-4">
                {!selectedOrder ? (
                  <EmptyInline text="Selecione um pedido para gerenciar." />
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
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => reopenOrderInCart(selectedOrder)} disabled={!canEditSelectedOrder}>
                          Editar no carrinho
                        </Button>
                        {!canEditSelectedOrder && (
                          <span className="self-center text-xs text-slate-500">
                            Disponível apenas para pedidos abertos sem pagamento.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
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
                      <div className="grid gap-3 xl:grid-cols-2">
                        <div className="space-y-3 rounded-2xl border p-4">
                          <div className="font-medium">Receber pagamento</div>
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
                          <Input value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} placeholder="Valor" />
                          <Input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} placeholder="Referência" />
                          <Button onClick={handleRegisterPayment} disabled={registerPayment.isPending}>
                            Receber
                          </Button>
                        </div>

                        <div className="space-y-3 rounded-2xl border p-4">
                          <div className="font-medium">Estorno</div>
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
                          <Textarea value={refundNotes} onChange={(event) => setRefundNotes(event.target.value)} placeholder="Motivo" />
                          <Button variant="outline" onClick={handleRefundPayment} disabled={refundPayment.isPending}>
                            Estornar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
                        Este pedido será lançado na conta do hóspede.
                      </div>
                    )}

                    <div className="grid gap-3 xl:grid-cols-[1fr_220px]">
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
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function TopMetric({
  label,
  value,
  icon: Icon,
  dark = true,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
  dark?: boolean;
}) {
  return (
    <div className={`h-full rounded-2xl px-3 py-2 ${dark ? 'bg-white/10 backdrop-blur' : 'border border-slate-200 bg-slate-50'}`}>
      <div className="flex min-h-[44px] items-center gap-2">
        <div className={`rounded-lg p-1.5 ${dark ? 'bg-white/10' : 'bg-white'}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <div className={`truncate whitespace-nowrap text-[10px] uppercase tracking-[0.08em] ${dark ? 'text-sky-100/90' : 'text-slate-500'}`}>{label}</div>
          <div className={`truncate whitespace-nowrap text-sm font-semibold leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</div>
        </div>
      </div>
    </div>
  );
}

function DialogStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.08em] text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-white">{value}</span>
    </div>
  );
}

function ModeCard({
  title,
  description,
  active,
  onClick,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-4 text-left transition ${
        active ? 'border-sky-600 bg-sky-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className={`text-sm font-semibold ${active ? 'text-sky-700' : 'text-slate-900'}`}>{title}</div>
      <div className={`mt-2 text-sm ${active ? 'text-sky-600' : 'text-slate-500'}`}>{description}</div>
    </button>
  );
}

function SideAction({
  icon: Icon,
  label,
  description,
  shortcut,
  active,
  onClick,
}: {
  icon: typeof ShoppingCart;
  label: string;
  description: string;
  shortcut: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[88px] rounded-2xl border p-3 text-left transition lg:min-w-0 ${
        active
          ? 'border-sky-500 bg-sky-600 text-white'
          : 'border-white/5 bg-white/5 text-slate-300 hover:border-white/10 hover:bg-white/10'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-xl p-2 ${active ? 'bg-white/15' : 'bg-white/5'}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${active ? 'bg-white/15 text-white' : 'bg-white/5 text-slate-400'}`}>
          {shortcut}
        </span>
      </div>
      <div className="mt-3">
        <div className="text-sm font-semibold">{label}</div>
        <div className={`mt-1 text-xs leading-relaxed ${active ? 'text-sky-50' : 'text-slate-400'}`}>{description}</div>
      </div>
    </button>
  );
}

function FieldButton({
  label,
  value,
  active,
  onClick,
  dark = true,
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
        dark
          ? active
            ? 'border-sky-500 bg-sky-500/10 text-white'
            : 'border-white/10 bg-white/5 text-slate-300'
          : active
            ? 'border-sky-500 bg-sky-50 text-sky-700'
            : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="font-semibold">{value || '0'}</span>
    </button>
  );
}

function EmptyInline({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-slate-500">{text}</div>;
}
