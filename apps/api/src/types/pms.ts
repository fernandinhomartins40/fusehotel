import {
  FolioEntrySource,
  FolioEntryType,
  HousekeepingStatus,
  HousekeepingTaskStatus,
  RoomUnitStatus,
} from '@prisma/client';

export type MaintenanceOrderStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type MaintenanceOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type POSProductCategory = 'FOOD' | 'BEVERAGE' | 'SERVICE' | 'CONVENIENCE' | 'OTHER';
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

export interface CreateRoomUnitDto {
  accommodationId: string;
  name: string;
  code: string;
  floor?: number;
  notes?: string;
}

export interface UpdateRoomUnitDto {
  name?: string;
  floor?: number;
  status?: RoomUnitStatus;
  housekeepingStatus?: HousekeepingStatus;
  isActive?: boolean;
  notes?: string;
}

export interface CheckInDto {
  reservationId: string;
  roomUnitId: string;
  notes?: string;
}

export interface WalkInCheckInDto {
  roomUnitId: string;
  customerId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestWhatsApp?: string;
  guestCpf?: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children?: number;
  notes?: string;
  promotionId?: string;
}

export interface CheckOutDto {
  stayId: string;
  notes?: string;
}

export interface CreateFolioEntryDto {
  type: FolioEntryType;
  source: FolioEntrySource;
  description: string;
  amount: number;
  quantity?: number;
  referenceId?: string;
}

export interface ConsumeProductDto {
  productId: string;
  quantity?: number;
}

export interface UpdateHousekeepingTaskStatusDto {
  status: HousekeepingTaskStatus;
}

export interface CreateMaintenanceOrderDto {
  roomUnitId: string;
  title: string;
  description?: string;
  priority?: MaintenanceOrderPriority;
  notes?: string;
  estimatedCost?: number;
  markRoomOutOfOrder?: boolean;
}

export interface UpdateMaintenanceOrderDto {
  status?: MaintenanceOrderStatus;
  priority?: MaintenanceOrderPriority;
  notes?: string;
  actualCost?: number;
}

export interface CreatePOSProductDto {
  name: string;
  category: POSProductCategory;
  price: number;
  sku?: string;
  costPrice?: number;
  stockQuantity?: number;
  minStockQuantity?: number;
  saleUnit?: string;
  trackStock?: boolean;
  description?: string;
}

export interface CreatePOSOrderDto {
  stayId?: string;
  roomUnitId?: string;
  origin: POSOrderOrigin;
  settlementType?: POSSettlementType;
  customerName?: string;
  tableNumber?: string;
  notes?: string;
  serviceFeeAmount?: number;
  discountAmount?: number;
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
  }>;
}

export interface UpdatePOSOrderDto {
  stayId?: string;
  roomUnitId?: string;
  origin: POSOrderOrigin;
  settlementType?: POSSettlementType;
  customerName?: string;
  tableNumber?: string;
  notes?: string;
  serviceFeeAmount?: number;
  discountAmount?: number;
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
  }>;
}

export interface UpdatePOSOrderStatusDto {
  status: POSOrderStatus;
}

export interface RegisterPOSPaymentDto {
  orderId: string;
  amount: number;
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER' | 'CASH' | 'VOUCHER';
  cashSessionId?: string;
  transactionId?: string;
  reference?: string;
  gateway?: string;
  notes?: string;
}

export interface RefundPOSPaymentDto {
  paymentId: string;
  amount?: number;
  notes?: string;
}

export interface CancelPOSOrderDto {
  reason: string;
  refundPayments?: boolean;
}

export interface OpenCashSessionDto {
  openingFloat?: number;
  notes?: string;
}

export interface CloseCashSessionDto {
  countedCashAmount: number;
  notes?: string;
}

export interface CreateCashMovementDto {
  type: Extract<CashMovementType, 'SUPPLY' | 'WITHDRAWAL' | 'CLOSING_ADJUSTMENT'>;
  amount: number;
  description: string;
  method?: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER' | 'CASH' | 'VOUCHER';
}

export interface CreateRatePlanDto {
  accommodationId: string;
  name: string;
  basePrice: number;
  markupType?: MarkupType;
  markupValue?: number;
  minStay?: number;
  maxStay?: number;
  allotment?: number;
  closedToArrival?: boolean;
  closedToDeparture?: boolean;
  isActive?: boolean;
  salesChannel?: string;
  startsAt?: string;
  endsAt?: string;
}

export interface CreateInventoryBlockDto {
  accommodationId: string;
  roomUnitId?: string;
  title: string;
  reason?: string;
  startsAt: string;
  endsAt: string;
  stopSell?: boolean;
  allotment?: number;
  salesChannel?: string;
}

export interface CreateChannelConnectionDto {
  name: string;
  type: ChannelConnectionType;
  isActive?: boolean;
  syncEnabled?: boolean;
  externalCode?: string;
  notes?: string;
}

export interface CreateQuoteDto {
  accommodationId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  source?: ReservationSource;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfExtraBeds?: number;
  paymentLinkUrl?: string;
  expiresAt?: string;
  notes?: string;
  status?: QuoteStatus;
}

export interface CreateBusinessAccountDto {
  name: string;
  type: BusinessAccountType;
  document?: string;
  email?: string;
  phone?: string;
  commissionRate?: number;
  markupType?: MarkupType;
  markupValue?: number;
  paymentTermsDays?: number;
  notes?: string;
  isActive?: boolean;
}

export interface CreateFeedbackDto {
  reservationId: string;
  rating: number;
  source?: string;
  comment?: string;
}

export interface CreateInventoryMovementDto {
  productId: string;
  type: Exclude<StockMovementType, 'CONSUMPTION'>;
  quantity: number;
  unitCost?: number;
  referenceId?: string;
  notes?: string;
}

export interface CreateFinancialEntryDto {
  type: FinancialEntryType;
  status?: FinancialEntryStatus;
  description: string;
  category?: string;
  amount: number;
  dueDate?: string;
  issuedAt?: string;
  customerName?: string;
  supplierName?: string;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
}

export interface RegisterFinancialSettlementDto {
  amount: number;
  notes?: string;
}

export interface CreateHousekeepingStaffDto {
  name: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

export interface CreateLostFoundItemDto {
  roomUnitId?: string;
  stayId?: string;
  title: string;
  description?: string;
  foundBy?: string;
  storedLocation?: string;
}
