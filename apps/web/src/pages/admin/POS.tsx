import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BedDouble,
  CreditCard,
  Grid2x2,
  Hotel,
  Keyboard,
  Maximize2,
  Minus,
  Minimize2,
  Plus,
  Receipt,
  Search,
  ShoppingCart,
  Wallet,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  useUpdatePOSOrder,
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
  FOLIO: 'Lançar na conta',
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  PIX: 'PIX',
  CREDIT_CARD: 'Crédito',
  DEBIT_CARD: 'Débito',
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

type NumericField = 'serviceFee' | 'discount' | 'payment';
type DialogKey = 'cash' | 'hotel' | 'orders' | 'drafts' | 'references' | 'details' | null;
type SalePreset = 'BALCAO' | 'MESA' | 'COMANDA' | 'QUARTO';
type HotelTab = 'frontdesk' | 'housekeeping' | 'maintenance';

const salePresetLabels: Record<SalePreset, string> = {
  BALCAO: 'Balcão',
  MESA: 'Mesa',
  COMANDA: 'Comanda',
  QUARTO: 'Quarto',
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
  const { data: products = [] } = usePOSProducts();
  const { data: orders = [] } = usePOSOrders();
  const { data: activeCashSession } = useActiveCashSession();
  const { data: housekeepingTasks = [] } = useHousekeepingTasks();
  const { data: maintenanceOrders = [] } = useMaintenanceOrders();

  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const createOrder = useCreatePOSOrder();
  const updateOrder = useUpdatePOSOrder();
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
  const [editingOrderId, setEditingOrderId] = useState('');
  const [activeDialog, setActiveDialog] = useState<DialogKey>(null);
  const [hotelTab, setHotelTab] = useState<HotelTab>('frontdesk');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<Record<string, string>>({});
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
  const [showDirectCustomerInput, setShowDirectCustomerInput] = useState(false);
  const [activeNumericField, setActiveNumericField] = useState<NumericField>('payment');
  const [salePreset, setSalePreset] = useState<SalePreset>('BALCAO');
  const [quickCode, setQuickCode] = useState('');
  const [quickQuantity, setQuickQuantity] = useState('1');
  const [draftReference, setDraftReference] = useState('');
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [referenceLookup, setReferenceLookup] = useState('');
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
  const [maintenanceRoomUnitId, setMaintenanceRoomUnitId] = useState('');
  const [maintenanceTitle, setMaintenanceTitle] = useState('');
  const [maintenancePriority, setMaintenancePriority] = useState<MaintenanceOrderPriority>('MEDIUM');
  const [maintenanceDescription, setMaintenanceDescription] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const scannerBufferRef = useRef('');
  const scannerTimeoutRef = useRef<number | null>(null);

  const arrivals = useMemo(() => dashboard?.arrivals ?? [], [dashboard]);
  const inHouseStays = useMemo(() => stays.filter((stay) => stay.status === 'IN_HOUSE'), [stays]);
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
    setShowDirectCustomerInput(false);
    setDraftReference('');
    setReferenceLookup('');
  };

  const applySalePreset = (preset: SalePreset) => {
    setSalePreset(preset);

    if (preset === 'BALCAO') {
      setOrigin('FRONTDESK');
      setSettlementType('DIRECT');
      return;
    }

    if (preset === 'MESA' || preset === 'COMANDA') {
      setOrigin('RESTAURANT');
      setSettlementType('DIRECT');
      return;
    }

    if (preset === 'QUARTO') {
      setOrigin('ROOM_SERVICE');
      setSettlementType('FOLIO');
    }
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
    setSalePreset(draft.salePreset);
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
    setShowDirectCustomerInput(Boolean(draft.customerName));
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
    setShowDirectCustomerInput(Boolean(order.customerName));

    if (order.settlementType === 'FOLIO' || order.origin === 'ROOM_SERVICE') {
      setSalePreset('QUARTO');
    } else if (order.tableNumber) {
      setSalePreset('COMANDA');
    } else {
      setSalePreset('BALCAO');
    }

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
        setActiveDialog('orders');
      }

      if (event.altKey && event.key === '2') {
        event.preventDefault();
        setActiveDialog('cash');
      }

      if (event.altKey && event.key === '3') {
        event.preventDefault();
        openHotelDialog('frontdesk');
      }

      if (event.altKey && event.key === '4') {
        event.preventDefault();
        openHotelDialog('housekeeping');
      }

      if (event.altKey && event.key === '5') {
        event.preventDefault();
        applySalePreset('BALCAO');
      }

      if (event.altKey && event.key === '6') {
        event.preventDefault();
        applySalePreset('MESA');
      }

      if (event.altKey && event.key === '7') {
        event.preventDefault();
        applySalePreset('COMANDA');
      }

      if (event.altKey && event.key === '8') {
        event.preventDefault();
        applySalePreset('QUARTO');
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
        customerName: settlementType === 'DIRECT' ? customerName || undefined : undefined,
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
      setActiveDialog('orders');
    } catch {
      return;
    }
  };

  const handleCheckIn = (reservation: Reservation) => {
    const roomUnitId = selectedRooms[reservation.id];
    if (!roomUnitId) {
      toast.error('Selecione um quarto para o check-in');
      return;
    }
    checkIn.mutate({ reservationId: reservation.id, roomUnitId });
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

  const handleCreateMaintenance = () => {
    if (!maintenanceRoomUnitId || !maintenanceTitle.trim()) {
      toast.error('Informe quarto e título');
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
    setMaintenanceDescription('');
    setMaintenancePriority('MEDIUM');
  };

  const openHotelDialog = (tab: HotelTab = 'frontdesk') => {
    setHotelTab(tab);
    setActiveDialog('hotel');
  };

  return (
    <AdminLayout>
      <div className="space-y-4 p-4 md:p-6 lg:min-h-[calc(100dvh-4rem)]">
        <div className="rounded-3xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">PDV</div>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">PDV do hotel</h1>
                  <p className="text-sm text-slate-500">Venda, conta da hospedagem e operação rápida do hotel.</p>
                </div>
              </div>
              <div className="inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600 xl:flex-none">
                <Keyboard className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate whitespace-nowrap">Alt + 1 pedidos • Alt + 2 caixa • Alt + 3 hotel • Ctrl + Enter finalizar</span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[540px]">
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

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <div className="rounded-3xl border bg-slate-950 p-3 text-white shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Operação rápida</div>
                  <div className="mt-1 text-sm text-slate-300">Acesse as ações do turno sem sair do caixa.</div>
                </div>
                <div className="hidden text-xs text-slate-500 xl:block">Alt + 1, 2, 3 e 9</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
                <SideAction
                  icon={ShoppingCart}
                  label="Pedidos"
                  description="Abertos e recebimento"
                  shortcut="Alt + 1"
                  active={activeDialog === 'orders'}
                  onClick={() => setActiveDialog('orders')}
                />
                <SideAction
                  icon={Wallet}
                  label="Caixa"
                  description="Abertura, sangria e fechamento"
                  shortcut="Alt + 2"
                  active={activeDialog === 'cash'}
                  onClick={() => setActiveDialog('cash')}
                />
                <SideAction
                  icon={Hotel}
                  label="Hotel"
                  description="Check-in, quartos e saída"
                  shortcut="Alt + 3"
                  active={activeDialog === 'hotel'}
                  onClick={() => openHotelDialog('frontdesk')}
                />
                <SideAction
                  icon={Receipt}
                  label="Pré-venda"
                  description="Suspensas e retomada"
                  shortcut="Alt + 9"
                  active={activeDialog === 'drafts'}
                  onClick={() => setActiveDialog('drafts')}
                />
                <SideAction
                  icon={Search}
                  label="Referências"
                  description="Mesa, comanda ou hóspede"
                  shortcut="Alt + 0"
                  active={activeDialog === 'references'}
                  onClick={() => setActiveDialog('references')}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-3">
                  <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Catálogo</div>
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

              <div className="mt-4 flex items-center justify-between gap-3">
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

              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value as POSProductCategory | 'ALL')}
                    className={`min-w-[140px] rounded-2xl border px-4 py-4 text-left transition ${
                      category === value
                        ? 'border-sky-700 bg-sky-700 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="font-semibold">{label}</div>
                  </button>
                ))}
              </div>

              <ScrollArea className="mt-4 max-h-[50vh] rounded-2xl border border-slate-200 xl:max-h-[56vh]">
                <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
                            <div className="mt-1 text-xs text-slate-500">{categoryLabels[product.category]}</div>
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
          </div>

          <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-sm lg:sticky lg:top-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Venda atual</div>
                <div className="mt-1 text-2xl font-semibold">Carrinho</div>
              </div>
              <div className="flex items-center gap-2">
                {editingOrder && <Badge className="bg-amber-500/20 text-amber-200 hover:bg-amber-500/20">Editando {editingOrder.orderNumber}</Badge>}
                <Badge className="bg-white/10 text-white hover:bg-white/10">{cartDetailedItems.length} itens</Badge>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applySalePreset('BALCAO')}
                className={`rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  settlementType === 'DIRECT' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Direto
              </button>
              <button
                type="button"
                onClick={() => {
                  setSettlementType('FOLIO');
                  applySalePreset('QUARTO');
                }}
                className={`rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  settlementType === 'FOLIO' ? 'bg-sky-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Conta
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-white/5 p-3">
              {settlementType === 'DIRECT' ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {tableNumber ? `${salePresetLabels[salePreset]} ${tableNumber}` : 'Venda de balcão'}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {customerName ? `Cliente identificado: ${customerName}` : 'Sem identificação obrigatória para continuar.'}
                      </div>
                    </div>
                    <Badge className="bg-white/10 text-white hover:bg-white/10">Direto</Badge>
                  </div>

                  {showDirectCustomerInput ? (
                    <Input
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Cliente (opcional)"
                      className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
                    />
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                      onClick={() => setShowDirectCustomerInput((current) => !current)}
                    >
                      {showDirectCustomerInput || customerName ? 'Editar cliente' : 'Identificar cliente'}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                      onClick={() => setActiveDialog('drafts')}
                    >
                      {tableNumber ? 'Editar mesa/comanda' : 'Usar mesa/comanda'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">Lançar na conta da hospedagem</div>
                      <div className="mt-1 text-xs text-slate-400">Selecione apenas a hospedagem que receberá o consumo.</div>
                    </div>
                    <Badge className="bg-sky-500/15 text-sky-100 hover:bg-sky-500/15">Conta</Badge>
                  </div>

                  <Select value={selectedStayId || 'none'} onValueChange={(value) => setSelectedStayId(value === 'none' ? '' : value)}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
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
                </div>
              )}
            </div>

            <ScrollArea className="mt-4 max-h-[34vh] rounded-2xl border border-white/10 bg-white/5 xl:max-h-[40vh]">
              <div className="space-y-3 p-3">
                {!cartDetailedItems.length ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-400">
                    Toque em um produto para adicionar ao carrinho.
                  </div>
                ) : (
                  cartDetailedItems.map((item) => (
                    <div key={item.productId} className="rounded-2xl border border-white/10 bg-black/10 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="line-clamp-2 font-medium">{item.product.name}</div>
                          <div className="mt-1 text-xs text-slate-400">{currency.format(Number(item.product.price))} por unidade</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, 0)}
                          className="rounded-xl bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="rounded-xl bg-white/5 p-2 hover:bg-white/10"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <div className="min-w-10 text-center font-semibold">{item.quantity}</div>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="rounded-xl bg-white/5 p-2 hover:bg-white/10"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-lg font-semibold">{currency.format(item.total)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_170px]">
              <div className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_152px]">
                  <FieldButton label="Pagamento" value={paymentAmount} active={activeNumericField === 'payment'} onClick={() => setActiveNumericField('payment')} />
                  <Button
                    variant="outline"
                    className="h-full rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => setActiveDialog('details')}
                  >
                    Ajustes e detalhes
                  </Button>
                </div>

                {settlementType === 'DIRECT' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('PIX')}
                      className={`rounded-2xl py-3 text-sm font-semibold transition ${
                        paymentMethod === 'PIX' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      PIX
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`rounded-2xl py-3 text-sm font-semibold transition ${
                        paymentMethod === 'CASH' ? 'bg-lime-500 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      Dinheiro
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={`rounded-2xl py-3 text-sm font-semibold transition ${
                        paymentMethod === 'CREDIT_CARD' ? 'bg-orange-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      Crédito
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('DEBIT_CARD')}
                      className={`rounded-2xl py-3 text-sm font-semibold transition ${
                        paymentMethod === 'DEBIT_CARD' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      Débito
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-4 gap-2 xl:grid-cols-3">
                {['7', '8', '9', 'clear', '4', '5', '6', 'back', '1', '2', '3', '.', '00', '0'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyKeypad(key)}
                    className={`rounded-2xl py-3 text-base font-semibold transition ${
                      key === 'clear'
                        ? 'bg-red-500 text-white'
                        : key === 'back'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-sky-700 text-white hover:bg-sky-600'
                    }`}
                  >
                    {key === 'clear' ? 'C' : key === 'back' ? '←' : key}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearDraft}
                  className="col-span-2 rounded-2xl bg-white/5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 xl:col-span-3"
                >
                  Limpar venda
                </button>
              </div>
            </div>

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

            <Button
              className="mt-4 h-14 rounded-2xl bg-emerald-500 text-base font-semibold text-white hover:bg-emerald-600"
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

            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', 'clear', '4', '5', '6', 'back', '1', '2', '3', '.', '00', '0'].map((key) => (
                <button
                  key={`details-${key}`}
                  type="button"
                  onClick={() => applyKeypad(key)}
                  className={`rounded-2xl py-3 text-base font-semibold transition ${
                    key === 'clear'
                      ? 'bg-red-500 text-white'
                      : key === 'back'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-sky-700 text-white hover:bg-sky-600'
                  }`}
                >
                  {key === 'clear' ? 'C' : key === 'back' ? '←' : key}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      <Dialog open={activeDialog === 'hotel'} onOpenChange={(open) => setActiveDialog(open ? 'hotel' : null)}>
        <DialogContent className="max-h-[90dvh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Operação do hotel</DialogTitle>
            <DialogDescription>Recepção, governança e manutenção no mesmo fluxo.</DialogDescription>
          </DialogHeader>
          <Tabs value={hotelTab} onValueChange={(value) => setHotelTab(value as HotelTab)} className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <TabsList className="h-auto flex-wrap rounded-2xl bg-slate-100 p-1">
                <TabsTrigger value="frontdesk" className="rounded-xl px-4 py-2">Recepção</TabsTrigger>
                <TabsTrigger value="housekeeping" className="rounded-xl px-4 py-2">Governança</TabsTrigger>
                <TabsTrigger value="maintenance" className="rounded-xl px-4 py-2">Manutenção</TabsTrigger>
              </TabsList>
              <div className="grid gap-2 sm:grid-cols-3">
                <DialogStat label="Chegadas" value={String(arrivals.length)} />
                <DialogStat label="Hospedados" value={String(inHouseStays.length)} />
                <DialogStat
                  label="Limpeza pendente"
                  value={String(
                    housekeepingTasks.filter((task) => task.status !== 'INSPECTED' && task.status !== 'CANCELLED').length
                  )}
                />
              </div>
            </div>

            <TabsContent value="frontdesk" className="mt-0">
              <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                  <CardContent className="space-y-3 p-4">
                    <div className="font-medium">Chegadas</div>
                    {!arrivals.length ? (
                      <EmptyInline text="Nenhuma chegada pendente." />
                    ) : (
                      arrivals.map((reservation) => (
                        <div key={reservation.id} className="rounded-2xl border p-3">
                          <div className="font-medium">{reservation.guestName}</div>
                          <div className="mt-1 text-sm text-slate-500">
                            {reservation.reservationCode} • {reservation.accommodation?.name ?? 'Acomodação'}
                          </div>
                          <div className="mt-3 flex gap-3">
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
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">Hospedados</div>
                      <Button asChild variant="outline">
                        <Link to="/admin/frontdesk">Abrir recepção</Link>
                      </Button>
                    </div>
                    {!inHouseStays.length ? (
                      <EmptyInline text="Nenhuma hospedagem ativa." />
                    ) : (
                      inHouseStays.map((stay) => (
                        <div key={stay.id} className="rounded-2xl border p-3">
                          <div className="font-medium">{stay.reservation.guestName}</div>
                          <div className="mt-1 text-sm text-slate-500">
                            Quarto {stay.roomUnit?.code ?? 'Sem quarto'} • Saída {new Date(stay.reservation.checkOutDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-500">
                              Conta {currency.format(Number(stay.folio?.balance ?? 0))}
                            </span>
                            <Button
                              variant="outline"
                              onClick={() => checkOut.mutate({ stayId: stay.id })}
                              disabled={checkOut.isPending}
                            >
                              Check-out
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="housekeeping" className="mt-0">
              <div className="space-y-3">
                {!housekeepingTasks.length ? (
                  <EmptyInline text="Nenhuma tarefa aberta." />
                ) : (
                  housekeepingTasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
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
                          <SelectTrigger className="w-full md:w-[210px]">
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
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="mt-0">
              <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
                <Card>
                  <CardContent className="space-y-3 p-4">
                    <div className="font-medium">Nova ordem</div>
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
                    <Input value={maintenanceTitle} onChange={(event) => setMaintenanceTitle(event.target.value)} placeholder="Título da ocorrência" />
                    <Select value={maintenancePriority} onValueChange={(value) => setMaintenancePriority(value as MaintenanceOrderPriority)}>
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
                    <Textarea value={maintenanceDescription} onChange={(event) => setMaintenanceDescription(event.target.value)} placeholder="Descrição do problema" />
                    <Button onClick={handleCreateMaintenance} disabled={createMaintenanceOrder.isPending}>
                      Criar ordem
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-3 p-4">
                    <div className="font-medium">Ordens abertas</div>
                    {!maintenanceOrders.length ? (
                      <EmptyInline text="Nenhuma ordem cadastrada." />
                    ) : (
                      maintenanceOrders.map((order) => (
                        <div key={order.id} className="rounded-2xl border p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
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
                              <SelectTrigger className="w-full md:w-[210px]">
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
              </div>
            </TabsContent>
          </Tabs>
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
                        Este pedido está configurado para lançamento na conta da hospedagem.
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
