/**
 * Accommodation Validators
 *
 * Validadores para acomodacoes
 */

import { z } from 'zod';
import { timeSchema } from './common.validators';
import { AccommodationType } from '../types';

const imageUrlSchema = z.string().refine((value) => {
  if (!value) {
    return false;
  }

  if (value.startsWith('/')) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}, 'URL da imagem invalida');

/**
 * Schema de criacao de acomodacao
 */
export const createAccommodationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no minimo 3 caracteres').max(100),
  type: z.nativeEnum(AccommodationType),
  capacity: z.number().int().positive('Capacidade deve ser positiva').max(20),
  pricePerNight: z.number().positive('Preco deve ser positivo'),
  description: z.string().min(10, 'Descricao deve ter no minimo 10 caracteres'),
  shortDescription: z.string().max(200).optional(),
  images: z
    .array(
      z.object({
        url: imageUrlSchema,
        alt: z.string().max(100),
        order: z.number().int().nonnegative(),
        isPrimary: z.boolean(),
      })
    )
    .min(1, 'Pelo menos uma imagem e obrigatoria'),
  amenityIds: z.array(z.string().min(1, 'ID invalido')).default([]),
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
 * Schema de atualizacao de acomodacao
 */
export const updateAccommodationSchema = createAccommodationSchema.partial();

/**
 * Schema de filtros de acomodacao
 */
export const accommodationFiltersSchema = z.object({
  type: z.nativeEnum(AccommodationType).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minCapacity: z.number().int().positive().optional(),
  amenityIds: z.array(z.string().min(1, 'ID invalido')).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  checkInDate: z.string().datetime().optional(),
  checkOutDate: z.string().datetime().optional(),
});
