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
