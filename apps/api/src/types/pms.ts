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
  referenceId?: string;
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
  description?: string;
}

export interface CreatePOSOrderDto {
  stayId?: string;
  roomUnitId?: string;
  origin: POSOrderOrigin;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
  }>;
}

export interface UpdatePOSOrderStatusDto {
  status: POSOrderStatus;
}
