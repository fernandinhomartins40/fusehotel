import { z } from 'zod';

export const accommodationTypeEnum = z.enum(['ROOM', 'SUITE', 'CHALET', 'VILLA', 'APARTMENT']);

export const accommodationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  type: accommodationTypeEnum,
  capacity: z.number().int().min(1, 'Capacidade mínima é 1').max(20, 'Capacidade máxima é 20'),
  pricePerNight: z.number().min(0, 'Preço deve ser positivo'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  shortDescription: z.string().max(200).optional(),
  images: z.array(
    z.object({
      url: z.string().url('URL da imagem inválida'),
      alt: z.string().max(100),
      order: z.number().int().nonnegative(),
      isPrimary: z.boolean(),
    })
  ).min(1, 'Pelo menos uma imagem é obrigatória'),
  amenityIds: z.array(z.string()).min(1, 'Selecione pelo menos uma amenidade'),
  floor: z.number().int().optional(),
  view: z.string().max(100).optional(),
  area: z.number().min(0).optional(),
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
