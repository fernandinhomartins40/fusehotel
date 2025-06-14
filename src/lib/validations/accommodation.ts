
import { z } from 'zod';

export const accommodationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  type: z.string().min(2, 'Tipo é obrigatório'),
  capacity: z.number().min(1, 'Capacidade mínima é 1').max(20, 'Capacidade máxima é 20'),
  price: z.number().min(0, 'Preço deve ser positivo'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  shortDescription: z.string().optional(),
  images: z.array(z.string()).min(1, 'Pelo menos uma imagem é obrigatória'),
  amenities: z.array(z.string()),
  location: z.object({
    floor: z.string().optional(),
    view: z.string().optional(),
    area: z.number().min(0).optional(),
  }).optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  isAvailable: z.boolean(),
  featured: z.boolean().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  extraBeds: z.number().min(0).optional(),
  maxExtraBeds: z.number().min(0).optional(),
  extraBedPrice: z.number().min(0).optional(),
});

export type AccommodationFormData = z.infer<typeof accommodationSchema>;
