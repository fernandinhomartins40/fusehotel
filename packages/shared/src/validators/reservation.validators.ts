/**
 * Reservation Validators
 *
 * Validadores para reservas
 */

import { z } from 'zod';
import { emailSchema, phoneSchema, cpfSchema, uuidSchema } from './common.validators';
import { ReservationStatus, PaymentStatus } from '../types';

/**
 * Schema de criação de reserva
 */
export const createReservationSchema = z
  .object({
    accommodationId: uuidSchema,
    checkInDate: z.string().datetime('Data de check-in inválida'),
    checkOutDate: z.string().datetime('Data de check-out inválida'),
    numberOfGuests: z.number().int().positive('Número de hóspedes deve ser positivo').max(20),
    numberOfExtraBeds: z.number().int().nonnegative().default(0),
    guestName: z.string().min(3, 'Nome do hóspede deve ter no mínimo 3 caracteres').max(100),
    guestWhatsApp: z.string().min(10, 'WhatsApp é obrigatório').max(20),
    guestEmail: emailSchema.optional(),
    guestPhone: phoneSchema.optional(),
    guestCpf: cpfSchema.optional(),
    guestNationality: z.string().max(50).optional(),
    guestDocumentNumber: z.string().max(50).optional(),
    specialRequests: z.string().max(500).optional(),
    promotionId: uuidSchema.optional(),
    promotionCode: z.string().max(50).optional(),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDate);
      const checkOut = new Date(data.checkOutDate);
      return checkOut > checkIn;
    },
    {
      message: 'Data de check-out deve ser posterior à data de check-in',
      path: ['checkOutDate'],
    }
  )
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDate);
      const now = new Date();
      return checkIn > now;
    },
    {
      message: 'Data de check-in deve ser futura',
      path: ['checkInDate'],
    }
  );

/**
 * Schema de atualização de reserva
 */
export const updateReservationSchema = z
  .object({
    checkInDate: z.string().datetime('Data de check-in inválida').optional(),
    checkOutDate: z.string().datetime('Data de check-out inválida').optional(),
    numberOfGuests: z.number().int().positive().max(20).optional(),
    numberOfExtraBeds: z.number().int().nonnegative().optional(),
    specialRequests: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      if (data.checkInDate && data.checkOutDate) {
        const checkIn = new Date(data.checkInDate);
        const checkOut = new Date(data.checkOutDate);
        return checkOut > checkIn;
      }
      return true;
    },
    {
      message: 'Data de check-out deve ser posterior à data de check-in',
      path: ['checkOutDate'],
    }
  );

/**
 * Schema de cancelamento de reserva
 */
export const cancelReservationSchema = z.object({
  reason: z.string().min(10, 'Motivo do cancelamento deve ter no mínimo 10 caracteres').max(500),
  requestRefund: z.boolean().default(false),
});

/**
 * Schema de filtros de reserva
 */
export const reservationFiltersSchema = z.object({
  userId: uuidSchema.optional(),
  accommodationId: uuidSchema.optional(),
  status: z.union([
    z.nativeEnum(ReservationStatus),
    z.array(z.nativeEnum(ReservationStatus)),
  ]).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  checkInDateFrom: z.string().datetime().optional(),
  checkInDateTo: z.string().datetime().optional(),
  checkOutDateFrom: z.string().datetime().optional(),
  checkOutDateTo: z.string().datetime().optional(),
  guestName: z.string().optional(),
  reservationCode: z.string().optional(),
});
