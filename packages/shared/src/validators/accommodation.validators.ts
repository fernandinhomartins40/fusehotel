/**
 * Accommodation Validators
 *
 * Validadores para acomodações
 */

import { z } from 'zod';
import { timeSchema, uuidSchema } from './common.validators';
import { AccommodationType } from '../types';

/**
 * Schema de criação de acomodação
 */
export const createAccommodationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  type: z.nativeEnum(AccommodationType),
  capacity: z.number().int().positive('Capacidade deve ser positiva').max(20),
  pricePerNight: z.number().positive('Preço deve ser positivo'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  shortDescription: z.string().max(200).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url('URL da imagem inválida'),
        alt: z.string().max(100),
        order: z.number().int().nonnegative(),
        isPrimary: z.boolean(),
      })
    )
    .min(1, 'Pelo menos uma imagem é obrigatória'),
  amenityIds: z.array(uuidSchema).min(1, 'Selecione pelo menos uma amenidade'),
  floor: z.number().int().optional(),
  view: z.string().max(100).optional(),
  area: z.number().positive().optional(),
  checkInTime: timeSchema.optional(),
  checkOutTime: timeSchema.optional(),
  extraBeds: z.number().int().nonnegative().default(0),
  maxExtraBeds: z.number().int().nonnegative().default(0),
  extraBedPrice: z.number().nonnegative().default(0),
  cancellationPolicy: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

/**
 * Schema de atualização de acomodação
 */
export const updateAccommodationSchema = createAccommodationSchema.partial();

/**
 * Schema de filtros de acomodação
 */
export const accommodationFiltersSchema = z.object({
  type: z.nativeEnum(AccommodationType).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minCapacity: z.number().int().positive().optional(),
  amenityIds: z.array(uuidSchema).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  checkInDate: z.string().datetime().optional(),
  checkOutDate: z.string().datetime().optional(),
});
