import { z } from 'zod';

export const accommodationTypeEnum = z.enum(['ROOM', 'SUITE', 'CHALET', 'VILLA', 'APARTMENT']);

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

export const accommodationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  type: accommodationTypeEnum,
  capacity: z.number().int().min(1, 'Capacidade minima e 1').max(20, 'Capacidade maxima e 20'),
  pricePerNight: z.number().positive('Preco deve ser positivo'),
  description: z.string().min(10, 'Descricao deve ter pelo menos 10 caracteres'),
  shortDescription: z.string().max(200).optional(),
  images: z.array(
    z.object({
      url: imageUrlSchema,
      alt: z.string().max(100),
      order: z.number().int().nonnegative(),
      isPrimary: z.boolean(),
    })
  ).min(1, 'Pelo menos uma imagem e obrigatoria'),
  amenityIds: z.array(z.string()).min(1, 'Selecione pelo menos uma amenidade'),
  floor: z.number().int().optional(),
  view: z.string().max(100).optional(),
  area: z.number().positive('Area deve ser positiva').optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  extraBeds: z.number().int().min(0).optional(),
  maxExtraBeds: z.number().int().min(0).optional(),
  extraBedPrice: z.number().min(0).optional(),
  cancellationPolicy: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean().optional(),
});

export type AccommodationFormData = z.infer<typeof accommodationSchema>;
