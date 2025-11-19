import { z } from 'zod';
import { PromotionType } from '@prisma/client';
import { paginationSchema, sortOrderSchema, urlSchema } from './common.validator';

/**
 * Promotion Validation Schemas
 */

// Create promotion schema
export const createPromotionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  shortDescription: z.string().min(10).max(200),
  longDescription: z.string().min(50),
  image: urlSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  originalPrice: z.number().positive(),
  discountedPrice: z.number().positive(),
  type: z.nativeEnum(PromotionType),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  termsAndConditions: z.string().optional(),
  maxRedemptions: z.number().int().positive().optional(),
  features: z.array(z.string()).optional(),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: 'End date must be after start date' }
).refine(
  (data) => data.discountedPrice < data.originalPrice,
  { message: 'Discounted price must be less than original price' }
);

// Update promotion schema
export const updatePromotionSchema = createPromotionSchema.partial();

// Promotion list query schema
export const promotionListQuerySchema = paginationSchema.extend({
  type: z.nativeEnum(PromotionType).optional(),
  isActive: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['startDate', 'endDate', 'discountPercent', 'createdAt']).optional(),
  sortOrder: sortOrderSchema,
});
