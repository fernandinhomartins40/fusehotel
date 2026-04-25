import { z } from 'zod';
import {
  FolioEntrySource,
  FolioEntryType,
  HousekeepingStatus,
  HousekeepingTaskStatus,
  RoomUnitStatus,
} from '../types';
import { uuidSchema } from './common.validators';

export const createRoomUnitSchema = z.object({
  accommodationId: uuidSchema,
  name: z.string().min(2).max(80),
  code: z.string().min(1).max(20),
  floor: z.number().int().optional(),
  notes: z.string().max(500).optional(),
});

export const updateRoomUnitSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  floor: z.number().int().optional(),
  status: z.nativeEnum(RoomUnitStatus).optional(),
  housekeepingStatus: z.nativeEnum(HousekeepingStatus).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

export const checkInSchema = z.object({
  reservationId: uuidSchema,
  roomUnitId: uuidSchema,
  notes: z.string().max(500).optional(),
});

export const checkOutSchema = z.object({
  stayId: uuidSchema,
  notes: z.string().max(500).optional(),
});

export const createFolioEntrySchema = z.object({
  type: z.nativeEnum(FolioEntryType),
  source: z.nativeEnum(FolioEntrySource),
  description: z.string().min(3).max(120),
  amount: z.number().positive(),
  quantity: z.number().int().positive().default(1),
});

export const updateHousekeepingTaskStatusSchema = z.object({
  status: z.nativeEnum(HousekeepingTaskStatus),
});
