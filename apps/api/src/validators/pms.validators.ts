import { z } from 'zod';
import {
  FolioEntrySource,
  FolioEntryType,
  HousekeepingStatus,
  HousekeepingTaskStatus,
  RoomUnitStatus,
} from '@prisma/client';

const uuidSchema = z.string().uuid('Identificador invalido');
const maintenancePrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
const maintenanceStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
const posProductCategorySchema = z.enum(['FOOD', 'BEVERAGE', 'SERVICE', 'CONVENIENCE', 'OTHER']);
const posOrderOriginSchema = z.enum(['ROOM_SERVICE', 'FRONTDESK', 'RESTAURANT', 'BAR']);
const posOrderStatusSchema = z.enum(['OPEN', 'PREPARING', 'DELIVERED', 'CLOSED', 'CANCELLED']);

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

export const createMaintenanceOrderSchema = z.object({
  roomUnitId: uuidSchema,
  title: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),
  priority: maintenancePrioritySchema.optional(),
  notes: z.string().max(500).optional(),
  estimatedCost: z.number().nonnegative().optional(),
  markRoomOutOfOrder: z.boolean().optional(),
});

export const updateMaintenanceOrderSchema = z.object({
  status: maintenanceStatusSchema.optional(),
  priority: maintenancePrioritySchema.optional(),
  notes: z.string().max(500).optional(),
  actualCost: z.number().nonnegative().optional(),
});

export const createPOSProductSchema = z.object({
  name: z.string().min(2).max(120),
  category: posProductCategorySchema,
  price: z.number().positive(),
  description: z.string().max(500).optional(),
});

export const createPOSOrderSchema = z.object({
  stayId: uuidSchema.optional(),
  roomUnitId: uuidSchema.optional(),
  origin: posOrderOriginSchema,
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: uuidSchema,
        quantity: z.number().int().positive(),
        notes: z.string().max(500).optional(),
      })
    )
    .min(1),
}).refine((data) => Boolean(data.stayId || data.roomUnitId), {
  message: 'Informe uma hospedagem ou quarto para o pedido',
  path: ['stayId'],
});

export const updatePOSOrderStatusSchema = z.object({
  status: posOrderStatusSchema,
});
