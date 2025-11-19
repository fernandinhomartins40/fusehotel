/**
 * Promotion Validators
 *
 * Validadores para promoções
 */

import { z } from 'zod';
import { PromotionType, DiscountType } from '../types';

/**
 * Schema de criação de promoção
 */
export const createPromotionSchema = z
  .object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(100),
    shortDescription: z.string().min(10, 'Descrição curta deve ter no mínimo 10 caracteres').max(200),
    longDescription: z.string().min(50, 'Descrição longa deve ter no mínimo 50 caracteres'),
    image: z.string().url('URL da imagem inválida').optional(),
    startDate: z.string().datetime('Data de início inválida'),
    endDate: z.string().datetime('Data de fim inválida'),
    originalPrice: z.number().positive().optional(),
    discountedPrice: z.number().positive().optional(),
    discountPercent: z.number().min(0).max(100).optional(),
    discountType: z.nativeEnum(DiscountType),
    type: z.nativeEnum(PromotionType),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    features: z.array(z.string()).optional(),
    rules: z
      .object({
        minNights: z.number().int().positive().optional(),
        maxNights: z.number().int().positive().optional(),
        minGuests: z.number().int().positive().optional(),
        maxGuests: z.number().int().positive().optional(),
        applicableDays: z.array(z.number().int().min(0).max(6)).optional(),
        blackoutDates: z.array(z.string().datetime()).optional(),
        accommodationTypes: z.array(z.string()).optional(),
        accommodationIds: z.array(z.string().uuid()).optional(),
      })
      .optional(),
    termsAndConditions: z.string().optional(),
    maxRedemptions: z.number().int().positive().optional(),
    promotionCode: z.string().max(50).optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'Data de fim deve ser posterior à data de início',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      if (data.discountType === DiscountType.PERCENTAGE && data.discountPercent === undefined) {
        return false;
      }
      return true;
    },
    {
      message: 'Porcentagem de desconto é obrigatória quando o tipo é PERCENTAGE',
      path: ['discountPercent'],
    }
  )
  .refine(
    (data) => {
      if (data.discountType === DiscountType.FIXED_AMOUNT) {
        return data.originalPrice !== undefined && data.discountedPrice !== undefined;
      }
      return true;
    },
    {
      message: 'Preços original e com desconto são obrigatórios quando o tipo é FIXED_AMOUNT',
      path: ['discountedPrice'],
    }
  );

/**
 * Schema de atualização de promoção
 */
export const updatePromotionSchema = createPromotionSchema.partial();

/**
 * Schema de filtros de promoção
 */
export const promotionFiltersSchema = z.object({
  type: z.nativeEnum(PromotionType).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  startDateFrom: z.string().datetime().optional(),
  startDateTo: z.string().datetime().optional(),
  endDateFrom: z.string().datetime().optional(),
  endDateTo: z.string().datetime().optional(),
  minDiscount: z.number().min(0).max(100).optional(),
  maxDiscount: z.number().min(0).max(100).optional(),
});

/**
 * Schema de validação de código promocional
 */
export const validatePromotionCodeSchema = z.object({
  code: z.string().min(1, 'Código promocional é obrigatório'),
  accommodationId: z.string().uuid().optional(),
  checkInDate: z.string().datetime().optional(),
  checkOutDate: z.string().datetime().optional(),
});
