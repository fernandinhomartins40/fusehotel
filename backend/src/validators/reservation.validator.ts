import { z } from 'zod';
import { ReservationStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { emailSchema, phoneSchema, cpfSchema, paginationSchema, sortOrderSchema } from './common.validator';

/**
 * Reservation Validation Schemas
 */

// Create reservation schema
export const createReservationSchema = z.object({
  accommodationId: z.string().uuid(),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  numberOfGuests: z.number().int().min(1, 'At least one guest is required'),
  guestName: z.string().min(3, 'Guest name must be at least 3 characters'),
  guestEmail: emailSchema,
  guestPhone: phoneSchema.refine((val) => val !== undefined, {
    message: 'Phone is required',
  }),
  guestCpf: cpfSchema,
  numberOfExtraBeds: z.number().int().nonnegative().optional(),
  specialRequests: z.string().max(500).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
}).refine(
  (data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return checkIn >= today;
  },
  { message: 'Check-in date cannot be in the past', path: ['checkInDate'] }
).refine(
  (data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);

    return checkOut > checkIn;
  },
  { message: 'Check-out date must be after check-in date', path: ['checkOutDate'] }
);

// Update reservation schema
export const updateReservationSchema = z.object({
  checkInDate: z.coerce.date().optional(),
  checkOutDate: z.coerce.date().optional(),
  numberOfGuests: z.number().int().min(1).optional(),
  guestName: z.string().min(3).optional(),
  guestEmail: emailSchema.optional(),
  guestPhone: phoneSchema,
  guestCpf: cpfSchema,
  numberOfExtraBeds: z.number().int().nonnegative().optional(),
  specialRequests: z.string().max(500).optional(),
  status: z.nativeEnum(ReservationStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
});

// Reservation list query schema
export const reservationListQuerySchema = paginationSchema.extend({
  userId: z.string().uuid().optional(),
  accommodationId: z.string().uuid().optional(),
  status: z.nativeEnum(ReservationStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortBy: z.enum(['checkInDate', 'createdAt', 'totalAmount']).optional(),
  sortOrder: sortOrderSchema,
});

// Cancel reservation schema
export const cancelReservationSchema = z.object({
  reason: z.string().max(500).optional(),
});

// Update reservation status schema
export const updateReservationStatusSchema = z.object({
  status: z.nativeEnum(ReservationStatus),
});

// Process payment schema
export const processPaymentSchema = z.object({
  reservationId: z.string().uuid(),
  amount: z.number().positive(),
  method: z.nativeEnum(PaymentMethod),
  transactionId: z.string().optional(),
  gateway: z.string().optional(),
});
