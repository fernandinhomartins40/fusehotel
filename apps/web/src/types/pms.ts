import type { Reservation } from './reservation';

export type RoomUnitStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'DIRTY'
  | 'CLEANING'
  | 'INSPECTED'
  | 'OUT_OF_ORDER'
  | 'OUT_OF_SERVICE'
  | 'BLOCKED';

export type HousekeepingStatus = 'CLEAN' | 'DIRTY' | 'IN_PROGRESS' | 'INSPECTED';

export type StayStatus = 'RESERVED' | 'IN_HOUSE' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';

export type FolioEntryType =
  | 'DAILY_RATE'
  | 'EXTRA_BED'
  | 'SERVICE_FEE'
  | 'TAX'
  | 'DISCOUNT'
  | 'PAYMENT'
  | 'REFUND'
  | 'ROOM_SERVICE'
  | 'POS'
  | 'ADJUSTMENT';

export type FolioEntrySource = 'RESERVATION' | 'STAY' | 'POS' | 'MANUAL' | 'SYSTEM';

export type HousekeepingTaskStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'INSPECTED'
  | 'CANCELLED';

export type MaintenanceOrderStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type MaintenanceOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ProductCategory {
  id: string;
  slug: string;
  label: string;
  color: string | null;
  order: number;
  isActive: boolean;
}

export type POSOrderOrigin = 'ROOM_SERVICE' | 'FRONTDESK' | 'RESTAURANT' | 'BAR';

export type POSOrderStatus = 'OPEN' | 'PREPARING' | 'DELIVERED' | 'CLOSED' | 'CANCELLED';

export type POSSettlementType = 'DIRECT' | 'FOLIO';

export type CashSessionStatus = 'OPEN' | 'CLOSED';

export type CashMovementType =
  | 'OPENING_FLOAT'
  | 'SALE'
  | 'REFUND'
  | 'SUPPLY'
  | 'WITHDRAWAL'
  | 'CLOSING_ADJUSTMENT';

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER' | 'CASH' | 'VOUCHER';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type ReservationSource =
  | 'WEBSITE'
  | 'PHONE'
  | 'EMAIL'
  | 'WHATSAPP'
  | 'WALK_IN'
  | 'BOOKING'
  | 'AIRBNB'
  | 'EXPEDIA'
  | 'CORPORATE'
  | 'OTHER';
export type QuoteStatus = 'OPEN' | 'SENT' | 'EXPIRED' | 'CONVERTED' | 'CANCELLED';
export type PreCheckInStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'CHECKED_IN' | 'CANCELLED';
export type FNRHStatus = 'PENDING' | 'READY' | 'SENT' | 'ERROR';
export type LostFoundStatus = 'OPEN' | 'RETURNED' | 'DISCARDED';
export type StockMovementType =
  | 'PURCHASE_IN'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'CONSUMPTION'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT';
export type FinancialEntryType = 'RECEIVABLE' | 'PAYABLE';
export type FinancialEntryStatus = 'OPEN' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type MarkupType = 'FIXED' | 'PERCENT';
export type BusinessAccountType = 'COMPANY' | 'OPERATOR' | 'AGENCY' | 'CORPORATE';
export type ChannelConnectionType = 'BOOKING' | 'AIRBNB' | 'EXPEDIA' | 'DIRECT' | 'OTHER';
export type ServiceCategory = 'ACCOMMODATION' | 'GASTRONOMY' | 'RECREATION' | 'BUSINESS' | 'SPECIAL';
export type RoomServiceConfigType = 'MINIBAR' | 'IN_ROOM';

export interface RoomUnit {
  id: string;
  accommodationId: string;
  name: string;
  code: string;
  floor: number | null;
  status: RoomUnitStatus;
  housekeepingStatus: HousekeepingStatus;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  accommodation?: {
    id: string;
    name: string;
    type: string;
  };
}

export interface Stay {
  id: string;
  reservationId: string;
  roomUnitId: string | null;
  status: StayStatus;
  adults: number;
  children: number;
  doNotDisturb?: boolean;
  doNotDisturbNote?: string | null;
  doNotDisturbUpdatedAt?: string | null;
  roomServiceConferenceAt?: string | null;
  roomServiceConferenceNotes?: string | null;
  notes: string | null;
  expectedCheckInAt: string | null;
  expectedCheckOutAt: string | null;
  actualCheckInAt: string | null;
  actualCheckOutAt: string | null;
  createdAt: string;
  updatedAt: string;
  reservation: Reservation & {
    accommodation?: {
      id: string;
      name: string;
      type: string;
    };
  };
  roomUnit?: RoomUnit | null;
  folio?: {
    id: string;
    balance: number;
    isClosed: boolean;
  } | null;
}

export interface FolioEntry {
  id: string;
  type: FolioEntryType;
  source: FolioEntrySource;
  description: string;
  amount: number;
  quantity: number;
  postedAt: string;
  createdAt: string;
}

export interface Folio {
  id: string;
  stayId: string;
  balance: number;
  isClosed: boolean;
  openedAt: string;
  closedAt: string | null;
  entries: FolioEntry[];
  stay: Stay;
}

export interface HousekeepingTask {
  id: string;
  roomUnitId: string;
  stayId: string | null;
  reservationId: string | null;
  status: HousekeepingTaskStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  title: string;
  notes: string | null;
  scheduledFor: string | null;
  startedAt: string | null;
  completedAt: string | null;
  inspectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  roomUnit: RoomUnit;
  assignedTo?: HousekeepingStaff | null;
  reservation?: {
    reservationCode: string;
    guestName: string;
  } | null;
}

export interface HousekeepingStaff {
  id: string;
  name: string;
  phone: string | null;
  role: string | null;
  isActive: boolean;
  tasks?: Array<{
    id: string;
    title: string;
    status: HousekeepingTaskStatus;
  }>;
}

export interface LostFoundItem {
  id: string;
  roomUnitId: string | null;
  stayId: string | null;
  title: string;
  description: string | null;
  foundBy: string | null;
  storedLocation: string | null;
  status: LostFoundStatus;
  foundAt: string;
  claimedBy: string | null;
  claimedAt: string | null;
  roomUnit?: RoomUnit | null;
  stay?: Stay | null;
}

export interface RoomMapRoom {
  id: string;
  code: string;
  name: string;
  floor: number | null;
  status: RoomUnitStatus;
  housekeepingStatus: HousekeepingStatus;
  accommodationId: string;
  accommodation: { id: string; name: string; type: string };
  guest: {
    stayId: string;
    guestName: string;
    reservationCode: string;
    checkOutDate: string;
    checkInDate: string;
    numberOfNights: number;
    folioBalance: number;
    doNotDisturb?: boolean;
    doNotDisturbNote?: string | null;
  } | null;
  housekeepingTasks: Array<{
    id: string;
    roomUnitId: string;
    status: string;
    priority: string;
    title: string;
  }>;
  maintenanceOrders: Array<{
    id: string;
    roomUnitId: string;
    status: string;
    priority: string;
    title: string;
  }>;
  todayArrivals: Array<{
    id: string;
    reservationCode: string;
    guestName: string;
    accommodationId: string;
    checkInDate: string;
    checkOutDate: string;
  }>;
}

export interface RoomMapData {
  rooms: RoomMapRoom[];
  floors: number[];
}

export interface FrontdeskDashboard {
  referenceDate: string;
  arrivals: Reservation[];
  inHouse: Stay[];
  departures: Stay[];
  alerts: Array<{
    type: 'DO_NOT_DISTURB';
    stayId: string;
    roomUnitId: string | null;
    roomCode: string | null;
    guestName: string;
    note: string | null;
    updatedAt: string | null;
  }>;
  roomStats: {
    total: number;
    available: number;
    occupied: number;
    dirty: number;
    cleaning: number;
    outOfOrder: number;
  };
}

export interface MaintenanceOrder {
  id: string;
  roomUnitId: string;
  status: MaintenanceOrderStatus;
  priority: MaintenanceOrderPriority;
  title: string;
  description: string | null;
  notes: string | null;
  estimatedCost: number | null;
  actualCost: number | null;
  openedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  roomUnit: RoomUnit & {
    accommodation?: {
      id: string;
      name: string;
    };
  };
}

export interface POSProduct {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  category: ProductCategory;
  image: string | null;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockQuantity: number;
  saleUnit: string;
  trackStock: boolean;
  isActive: boolean;
  isRoomServiceEnabled: boolean;
  description: string | null;
  showOnServicesPage: boolean;
  servicesPageCategory: ServiceCategory | null;
  servicesPageOrder: number | null;
  servicesPageSubtitle: string | null;
  servicesPageFeatures: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoomServiceConfiguration {
  id: string;
  roomUnitId: string;
  productId: string;
  configType: RoomServiceConfigType;
  quantity: number;
  notes: string | null;
  roomUnit: RoomUnit & {
    accommodation?: {
      id: string;
      name: string;
    };
  };
  product: POSProduct;
}

export interface RoomServiceConferencePreview {
  stay: {
    id: string;
    roomUnitId: string | null;
    guestName: string;
    reservationCode: string;
    roomCode: string | null;
    roomName: string | null;
    conferenceCompletedAt: string | null;
    conferenceNotes: string | null;
  };
  items: Array<{
    id: string;
    configType: RoomServiceConfigType;
    configuredQuantity: number;
    notes: string | null;
    product: POSProduct;
    alreadyChargedQuantity: number;
  }>;
}

export interface MyRoomServiceStay extends Stay {
  roomServiceConfigurations: RoomServiceConfiguration[];
  roomServiceOrders: POSOrder[];
}

export interface POSOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
}

export interface POSOrder {
  id: string;
  orderNumber: string;
  stayId: string | null;
  roomUnitId: string | null;
  origin: POSOrderOrigin;
  settlementType: POSSettlementType;
  status: POSOrderStatus;
  customerName: string | null;
  tableNumber: string | null;
  notes: string | null;
  subtotalAmount: number;
  serviceFeeAmount: number;
  discountAmount: number;
  paidAmount: number;
  totalAmount: number;
  postedToFolioAt: string | null;
  closedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  stay?: Stay | null;
  roomUnit?: RoomUnit | null;
  items: POSOrderItem[];
  payments: POSPayment[];
}

export interface POSPayment {
  id: string;
  orderId: string;
  cashSessionId: string | null;
  amount: number;
  refundedAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  reference: string | null;
  gateway: string | null;
  notes: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  createdByUserId: string | null;
  createdByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CashMovement {
  id: string;
  cashSessionId: string;
  orderId: string | null;
  paymentId: string | null;
  type: CashMovementType;
  method: PaymentMethod | null;
  amount: number;
  description: string;
  performedByUserId: string | null;
  performedByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CashSession {
  id: string;
  code: string;
  status: CashSessionStatus;
  openingFloat: number;
  expectedCashAmount: number | null;
  countedCashAmount: number | null;
  differenceAmount: number | null;
  notes: string | null;
  openedByUserId: string | null;
  openedByEmail: string | null;
  closedByUserId: string | null;
  closedByEmail: string | null;
  openedAt: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  movements: CashMovement[];
  payments: POSPayment[];
}

export interface RatePlan {
  id: string;
  accommodationId: string;
  name: string;
  basePrice: number;
  markupType: MarkupType;
  markupValue: number;
  minStay: number;
  maxStay: number | null;
  allotment: number | null;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  isActive: boolean;
  salesChannel: string | null;
  startsAt: string | null;
  endsAt: string | null;
  accommodation?: {
    id: string;
    name: string;
    pricePerNight: number;
  };
}

export interface InventoryBlock {
  id: string;
  accommodationId: string;
  roomUnitId: string | null;
  title: string;
  reason: string | null;
  startsAt: string;
  endsAt: string;
  stopSell: boolean;
  allotment: number | null;
  salesChannel: string | null;
  accommodation?: {
    id: string;
    name: string;
  };
  roomUnit?: RoomUnit | null;
}

export interface ChannelConnection {
  id: string;
  name: string;
  type: ChannelConnectionType;
  isActive: boolean;
  syncEnabled: boolean;
  externalCode: string | null;
  notes: string | null;
  lastSyncedAt: string | null;
}

export interface ReservationQuote {
  id: string;
  quoteCode: string;
  accommodationId: string;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string | null;
  source: ReservationSource;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfExtraBeds: number;
  amount: number;
  status: QuoteStatus;
  paymentLinkUrl: string | null;
  expiresAt: string | null;
  notes: string | null;
  convertedReservationId: string | null;
  accommodation?: {
    id: string;
    name: string;
  };
}

export interface PreCheckIn {
  id: string;
  reservationId: string;
  token: string;
  status: PreCheckInStatus;
  fnrhStatus: FNRHStatus;
  guestData: Record<string, unknown> | null;
  documentData: Record<string, unknown> | null;
  signatureData: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  checkedInAt: string | null;
  sentToGovernmentAt: string | null;
  lastError: string | null;
  reservation?: any;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  unitCost: number | null;
  referenceId: string | null;
  notes: string | null;
  createdAt: string;
}

export interface FinancialEntry {
  id: string;
  type: FinancialEntryType;
  status: FinancialEntryStatus;
  description: string;
  category: string | null;
  amount: number;
  paidAmount: number;
  dueDate: string | null;
  issuedAt: string;
  paidAt: string | null;
  customerName: string | null;
  supplierName: string | null;
  referenceType: string | null;
  referenceId: string | null;
  notes: string | null;
}

export interface FinancialSummary {
  receivableTotal: number;
  receivableOpen: number;
  payableTotal: number;
  payableOpen: number;
}

export interface BusinessAccount {
  id: string;
  name: string;
  type: BusinessAccountType;
  document: string | null;
  email: string | null;
  phone: string | null;
  commissionRate: number | null;
  markupType: MarkupType | null;
  markupValue: number | null;
  paymentTermsDays: number | null;
  notes: string | null;
  isActive: boolean;
}

export interface GuestFeedback {
  id: string;
  reservationId: string;
  rating: number;
  source: string | null;
  comment: string | null;
  respondedAt: string | null;
  reservation?: {
    id: string;
    reservationCode: string;
    guestName: string;
  };
}

export interface OperationsReport {
  referenceDate: string;
  rooms: {
    total: number;
    occupied: number;
    occupancyRate: number;
  };
  frontdesk: {
    arrivalsToday: number;
    departuresToday: number;
    inHouse: number;
  };
  operations: {
    pendingHousekeeping: number;
    openMaintenance: number;
  };
  finance: {
    reservationRevenueMonth: number;
    reservationCountMonth: number;
    outstandingFolios: number;
    posRevenueMonth: number;
    posOrdersMonth: number;
    receivablesOpen: number;
    payablesOpen: number;
    revpar: number;
  };
  commercial: {
    quotesMonth: number;
    conversionRate: number;
    activeBusinessAccounts: number;
    channelSales: Array<{
      source: ReservationSource;
      reservations: number;
      revenue: number;
    }>;
  };
}
