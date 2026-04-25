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

export type POSProductCategory = 'FOOD' | 'BEVERAGE' | 'SERVICE' | 'CONVENIENCE' | 'OTHER';

export type POSOrderOrigin = 'ROOM_SERVICE' | 'FRONTDESK' | 'RESTAURANT' | 'BAR';

export type POSOrderStatus = 'OPEN' | 'PREPARING' | 'DELIVERED' | 'CLOSED' | 'CANCELLED';

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
  reservation?: {
    reservationCode: string;
    guestName: string;
  } | null;
}

export interface FrontdeskDashboard {
  referenceDate: string;
  arrivals: Reservation[];
  inHouse: Stay[];
  departures: Stay[];
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
  category: POSProductCategory;
  price: number;
  isActive: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
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
  status: POSOrderStatus;
  notes: string | null;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  stay?: Stay | null;
  roomUnit?: RoomUnit | null;
  items: POSOrderItem[];
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
  };
}
