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
const posSettlementTypeSchema = z.enum(['DIRECT', 'FOLIO']);
const paymentMethodSchema = z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BANK_TRANSFER', 'CASH', 'VOUCHER']);
const cashMovementTypeSchema = z.enum(['SUPPLY', 'WITHDRAWAL', 'CLOSING_ADJUSTMENT']);
const reservationSourceSchema = z.enum([
  'WEBSITE',
  'PHONE',
  'EMAIL',
  'WHATSAPP',
  'WALK_IN',
  'BOOKING',
  'AIRBNB',
  'EXPEDIA',
  'CORPORATE',
  'OTHER',
]);
const quoteStatusSchema = z.enum(['OPEN', 'SENT', 'EXPIRED', 'CONVERTED', 'CANCELLED']);
const markupTypeSchema = z.enum(['FIXED', 'PERCENT']);
const channelConnectionTypeSchema = z.enum(['BOOKING', 'AIRBNB', 'EXPEDIA', 'DIRECT', 'OTHER']);
const businessAccountTypeSchema = z.enum(['COMPANY', 'OPERATOR', 'AGENCY', 'CORPORATE']);
const lostFoundStatusSchema = z.enum(['OPEN', 'RETURNED', 'DISCARDED']);
const stockMovementTypeSchema = z.enum([
  'PURCHASE_IN',
  'TRANSFER_IN',
  'TRANSFER_OUT',
  'ADJUSTMENT_IN',
  'ADJUSTMENT_OUT',
]);
const financialEntryTypeSchema = z.enum(['RECEIVABLE', 'PAYABLE']);
const financialEntryStatusSchema = z.enum(['OPEN', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED']);

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

export const walkInCheckInSchema = z
  .object({
    roomUnitId: uuidSchema,
    customerId: uuidSchema.optional(),
    guestName: z.string().min(3).max(120).optional(),
    guestEmail: z.string().email('Email invalido').max(120).optional().or(z.literal('')),
    guestPhone: z.string().max(30).optional(),
    guestWhatsApp: z.string().max(30).optional(),
    guestCpf: z.string().max(20).optional(),
    checkInDate: z.string().min(10).max(30),
    checkOutDate: z.string().min(10).max(30),
    adults: z.number().int().positive(),
    children: z.number().int().min(0).optional(),
    notes: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.customerId && !data.guestName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['guestName'],
        message: 'Selecione um cliente ou informe o nome do hóspede',
      });
    }

    if (!data.customerId && !data.guestWhatsApp?.trim() && !data.guestPhone?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['guestWhatsApp'],
        message: 'Informe ao menos WhatsApp ou telefone para o walk-in',
      });
    }
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
  assignedToId: uuidSchema.optional(),
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
  sku: z.string().max(50).optional(),
  category: posProductCategorySchema,
  price: z.number().positive(),
  costPrice: z.number().nonnegative().optional(),
  stockQuantity: z.number().nonnegative().optional(),
  minStockQuantity: z.number().nonnegative().optional(),
  saleUnit: z.string().max(10).optional(),
  trackStock: z.boolean().optional(),
  description: z.string().max(500).optional(),
});

export const createPOSOrderSchema = z.object({
  stayId: uuidSchema.optional(),
  roomUnitId: uuidSchema.optional(),
  origin: posOrderOriginSchema,
  settlementType: posSettlementTypeSchema.optional(),
  customerName: z.string().min(2).max(120).optional(),
  tableNumber: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
  serviceFeeAmount: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  items: z
    .array(
      z.object({
        productId: uuidSchema,
        quantity: z.number().int().positive(),
        notes: z.string().max(500).optional(),
      })
    )
    .min(1),
}).superRefine((data, ctx) => {
  const needsStayOrRoom =
    data.origin === 'ROOM_SERVICE' || data.settlementType === 'FOLIO';
  const isDirectSale =
    (data.settlementType ?? (data.origin === 'ROOM_SERVICE' ? 'FOLIO' : 'DIRECT')) === 'DIRECT';

  if (needsStayOrRoom && !data.stayId && !data.roomUnitId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe uma hospedagem ou quarto para o pedido',
      path: ['stayId'],
    });
  }

  if (isDirectSale && !data.customerName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe o cliente do pedido',
      path: ['customerName'],
    });
  }
});

export const updatePOSOrderSchema = z.object({
  stayId: uuidSchema.optional(),
  roomUnitId: uuidSchema.optional(),
  origin: posOrderOriginSchema,
  settlementType: posSettlementTypeSchema.optional(),
  customerName: z.string().min(2).max(120).optional(),
  tableNumber: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
  serviceFeeAmount: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  items: z
    .array(
      z.object({
        productId: uuidSchema,
        quantity: z.number().int().positive(),
        notes: z.string().max(500).optional(),
      })
    )
    .min(1),
}).superRefine((data, ctx) => {
  const needsStayOrRoom =
    data.origin === 'ROOM_SERVICE' || data.settlementType === 'FOLIO';
  const isDirectSale =
    (data.settlementType ?? (data.origin === 'ROOM_SERVICE' ? 'FOLIO' : 'DIRECT')) === 'DIRECT';

  if (needsStayOrRoom && !data.stayId && !data.roomUnitId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe uma hospedagem ou quarto para o pedido',
      path: ['stayId'],
    });
  }

  if (isDirectSale && !data.customerName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe o cliente do pedido',
      path: ['customerName'],
    });
  }
});

export const updatePOSOrderStatusSchema = z.object({
  status: posOrderStatusSchema,
});

export const registerPOSPaymentSchema = z.object({
  orderId: uuidSchema,
  amount: z.number().positive(),
  method: paymentMethodSchema,
  cashSessionId: uuidSchema.optional(),
  transactionId: z.string().max(120).optional(),
  reference: z.string().max(120).optional(),
  gateway: z.string().max(80).optional(),
  notes: z.string().max(500).optional(),
});

export const refundPOSPaymentSchema = z.object({
  paymentId: uuidSchema,
  amount: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

export const cancelPOSOrderSchema = z.object({
  reason: z.string().min(3).max(500),
  refundPayments: z.boolean().optional(),
});

export const openCashSessionSchema = z.object({
  openingFloat: z.number().nonnegative().optional(),
  notes: z.string().max(500).optional(),
});

export const closeCashSessionSchema = z.object({
  countedCashAmount: z.number().nonnegative(),
  notes: z.string().max(500).optional(),
});

export const createCashMovementSchema = z.object({
  type: cashMovementTypeSchema,
  amount: z.number().positive(),
  description: z.string().min(3).max(200),
  method: paymentMethodSchema.optional(),
});

export const createRatePlanSchema = z.object({
  accommodationId: uuidSchema,
  name: z.string().min(2).max(120),
  basePrice: z.number().positive(),
  markupType: markupTypeSchema.optional(),
  markupValue: z.number().nonnegative().optional(),
  minStay: z.number().int().positive().optional(),
  maxStay: z.number().int().positive().optional(),
  allotment: z.number().int().nonnegative().optional(),
  closedToArrival: z.boolean().optional(),
  closedToDeparture: z.boolean().optional(),
  isActive: z.boolean().optional(),
  salesChannel: z.string().max(80).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

export const updateRatePlanSchema = createRatePlanSchema.partial().omit({ accommodationId: true });

export const createInventoryBlockSchema = z.object({
  accommodationId: uuidSchema,
  roomUnitId: uuidSchema.optional(),
  title: z.string().min(2).max(120),
  reason: z.string().max(500).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  stopSell: z.boolean().optional(),
  allotment: z.number().int().nonnegative().optional(),
  salesChannel: z.string().max(80).optional(),
});

export const updateInventoryBlockSchema = createInventoryBlockSchema.partial().omit({ accommodationId: true });

export const createChannelConnectionSchema = z.object({
  name: z.string().min(2).max(120),
  type: channelConnectionTypeSchema,
  isActive: z.boolean().optional(),
  syncEnabled: z.boolean().optional(),
  externalCode: z.string().max(120).optional(),
  notes: z.string().max(500).optional(),
});

export const updateChannelConnectionSchema = createChannelConnectionSchema.partial().extend({
  markSynced: z.boolean().optional(),
});

export const createQuoteSchema = z.object({
  accommodationId: uuidSchema,
  guestName: z.string().min(2).max(120),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().max(30).optional(),
  source: reservationSourceSchema.optional(),
  checkInDate: z.string().datetime(),
  checkOutDate: z.string().datetime(),
  numberOfGuests: z.number().int().positive(),
  numberOfExtraBeds: z.number().int().nonnegative().optional(),
  paymentLinkUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  status: quoteStatusSchema.optional(),
});

export const updateQuoteSchema = createQuoteSchema.partial().omit({ accommodationId: true, checkInDate: true, checkOutDate: true, numberOfGuests: true, numberOfExtraBeds: true });

export const createBusinessAccountSchema = z.object({
  name: z.string().min(2).max(120),
  type: businessAccountTypeSchema,
  document: z.string().max(40).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  markupType: markupTypeSchema.optional(),
  markupValue: z.number().nonnegative().optional(),
  paymentTermsDays: z.number().int().nonnegative().optional(),
  notes: z.string().max(1000).optional(),
  isActive: z.boolean().optional(),
});

export const updateBusinessAccountSchema = createBusinessAccountSchema.partial();

export const createFeedbackSchema = z.object({
  reservationId: uuidSchema,
  rating: z.number().int().min(1).max(5),
  source: z.string().max(80).optional(),
  comment: z.string().max(1000).optional(),
});

export const issuePreCheckInSchema = z.object({
  reservationId: uuidSchema,
});

export const submitPreCheckInSchema = z.object({
  guestData: z.record(z.any()).optional(),
  documentData: z.record(z.any()).optional(),
  signatureData: z.string().optional(),
});

export const createInventoryMovementSchema = z.object({
  productId: uuidSchema,
  type: stockMovementTypeSchema,
  quantity: z.number().positive(),
  unitCost: z.number().nonnegative().optional(),
  referenceId: z.string().max(120).optional(),
  notes: z.string().max(500).optional(),
});

export const createFinancialEntrySchema = z.object({
  type: financialEntryTypeSchema,
  status: financialEntryStatusSchema.optional(),
  description: z.string().min(2).max(200),
  category: z.string().max(80).optional(),
  amount: z.number().positive(),
  dueDate: z.string().datetime().optional(),
  issuedAt: z.string().datetime().optional(),
  customerName: z.string().max(120).optional(),
  supplierName: z.string().max(120).optional(),
  referenceType: z.string().max(80).optional(),
  referenceId: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
});

export const registerFinancialSettlementSchema = z.object({
  amount: z.number().positive(),
  notes: z.string().max(500).optional(),
});

export const createHousekeepingStaffSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().max(30).optional(),
  role: z.string().max(80).optional(),
  isActive: z.boolean().optional(),
});

export const updateHousekeepingStaffSchema = createHousekeepingStaffSchema.partial();

export const createLostFoundItemSchema = z.object({
  roomUnitId: uuidSchema.optional(),
  stayId: uuidSchema.optional(),
  title: z.string().min(2).max(120),
  description: z.string().max(1000).optional(),
  foundBy: z.string().max(120).optional(),
  storedLocation: z.string().max(120).optional(),
});

export const updateLostFoundItemSchema = createLostFoundItemSchema.partial().extend({
  status: lostFoundStatusSchema.optional(),
  claimedBy: z.string().max(120).optional(),
});
