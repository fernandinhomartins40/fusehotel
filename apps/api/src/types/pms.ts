import { FolioEntrySource, FolioEntryType, HousekeepingStatus, HousekeepingTaskStatus, RoomUnitStatus } from '@prisma/client';

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
