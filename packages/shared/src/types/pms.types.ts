import { BaseEntity } from './common.types';
import { ReservationStatus } from './reservation.types';

export enum RoomUnitStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  DIRTY = 'DIRTY',
  CLEANING = 'CLEANING',
  INSPECTED = 'INSPECTED',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  BLOCKED = 'BLOCKED',
}

export enum HousekeepingStatus {
  CLEAN = 'CLEAN',
  DIRTY = 'DIRTY',
  IN_PROGRESS = 'IN_PROGRESS',
  INSPECTED = 'INSPECTED',
}

export enum StayStatus {
  RESERVED = 'RESERVED',
  IN_HOUSE = 'IN_HOUSE',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum FolioEntryType {
  DAILY_RATE = 'DAILY_RATE',
  EXTRA_BED = 'EXTRA_BED',
  SERVICE_FEE = 'SERVICE_FEE',
  TAX = 'TAX',
  DISCOUNT = 'DISCOUNT',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  ROOM_SERVICE = 'ROOM_SERVICE',
  POS = 'POS',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum FolioEntrySource {
  RESERVATION = 'RESERVATION',
  STAY = 'STAY',
  POS = 'POS',
  MANUAL = 'MANUAL',
  SYSTEM = 'SYSTEM',
}

export enum HousekeepingTaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  INSPECTED = 'INSPECTED',
  CANCELLED = 'CANCELLED',
}

export enum HousekeepingTaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

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
}

export interface UpdateHousekeepingTaskStatusDto {
  status: HousekeepingTaskStatus;
}

export interface RoomUnitSummary extends BaseEntity {
  accommodationId: string;
  accommodationName: string;
  name: string;
  code: string;
  floor: number | null;
  status: RoomUnitStatus;
  housekeepingStatus: HousekeepingStatus;
  isActive: boolean;
  notes: string | null;
}

export interface FrontdeskReservationSummary {
  id: string;
  reservationCode: string;
  guestName: string;
  guestWhatsApp: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: ReservationStatus;
  accommodation: {
    id: string;
    name: string;
    type: string;
  };
}

export interface StaySummary extends BaseEntity {
  reservationId: string;
  reservationCode: string;
  roomUnitId: string | null;
  roomUnitCode: string | null;
  guestName: string;
  status: StayStatus;
  expectedCheckInAt: string | null;
  expectedCheckOutAt: string | null;
  actualCheckInAt: string | null;
  actualCheckOutAt: string | null;
  balance: number;
}

export interface FolioEntrySummary extends BaseEntity {
  type: FolioEntryType;
  source: FolioEntrySource;
  description: string;
  amount: number;
  quantity: number;
  postedAt: string;
}

export interface FolioSummary extends BaseEntity {
  stayId: string;
  balance: number;
  isClosed: boolean;
  openedAt: string;
  closedAt: string | null;
  entries: FolioEntrySummary[];
}

export interface HousekeepingTaskSummary extends BaseEntity {
  roomUnitId: string;
  roomUnitCode: string;
  roomUnitName: string;
  reservationCode: string | null;
  stayId: string | null;
  status: HousekeepingTaskStatus;
  priority: HousekeepingTaskPriority;
  title: string;
  notes: string | null;
  scheduledFor: string | null;
  startedAt: string | null;
  completedAt: string | null;
  inspectedAt: string | null;
}
