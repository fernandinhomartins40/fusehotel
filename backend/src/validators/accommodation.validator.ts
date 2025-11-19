import { z } from 'zod';
import { AccommodationType } from '@prisma/client';
import { paginationSchema, sortOrderSchema, urlSchema } from './common.validator';

/**
 * Accommodation Validation Schemas
 */

// Create accommodation schema
export const createAccommodationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.nativeEnum(AccommodationType),
  capacity: z.number().int().min(1).max(20),
  pricePerNight: z.number().positive('Price must be greater than 0'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  shortDescription: z.string().max(200).optional(),
  floor: z.string().optional(),
  view: z.string().optional(),
  area: z.number().positive().optional(),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  extraBeds: z.number().int().nonnegative().optional(),
  maxExtraBeds: z.number().int().nonnegative().optional(),
  extraBedPrice: z.number().nonnegative().optional(),
  cancellationPolicy: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  amenityIds: z.array(z.string().uuid()).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// Update accommodation schema
export const updateAccommodationSchema = createAccommodationSchema.partial();

// Accommodation list query schema
export const accommodationListQuerySchema = paginationSchema.extend({
  type: z.nativeEnum(AccommodationType).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minCapacity: z.coerce.number().int().min(1).optional(),
  isAvailable: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['price', 'capacity', 'name', 'createdAt']).optional(),
  sortOrder: sortOrderSchema,
});

// Availability query schema
export const availabilityQuerySchema = z.object({
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
}).refine(
  (data) => data.checkOutDate > data.checkInDate,
  { message: 'Check-out date must be after check-in date' }
);

// Add images schema
export const addImagesSchema = z.object({
  images: z.array(
    z.object({
      url: urlSchema,
      alt: z.string().optional(),
      order: z.number().int().nonnegative(),
    })
  ).min(1, 'At least one image is required').max(10, 'Maximum 10 images allowed'),
});

// Reorder images schema
export const reorderImagesSchema = z.object({
  imageOrders: z.array(
    z.object({
      imageId: z.string().uuid(),
      order: z.number().int().nonnegative(),
    })
  ),
});

// Create amenity schema
export const createAmenitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  icon: z.string().optional(),
  category: z.enum(['BEDROOM', 'BATHROOM', 'ENTERTAINMENT', 'KITCHEN', 'OUTDOOR', 'GENERAL']),
  description: z.string().optional(),
});

// Update amenity schema
export const updateAmenitySchema = createAmenitySchema.partial();
