import { z } from 'zod';

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

const optionalNumber = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').trim();

    if (!normalized) {
      return undefined;
    }

    const parsed = Number(normalized);

    return Number.isNaN(parsed) ? value : parsed;
  }

  if (typeof value === 'number' && Number.isNaN(value)) {
    return undefined;
  }

  return value;
}, z.number().nonnegative().optional());

const optionalImage = z.union([imageUrlSchema, z.literal('')]).optional();

export const promotionFormSchema = z.object({
  title: z.string().min(3, 'Titulo deve ter pelo menos 3 caracteres').max(100),
  shortDescription: z.string().min(10, 'Descricao curta deve ter pelo menos 10 caracteres').max(200),
  longDescription: z.string().optional(),
  image: optionalImage,
  startDate: z.string().min(1, 'Data de inicio obrigatoria'),
  endDate: z.string().min(1, 'Data de termino obrigatoria'),
  originalPrice: optionalNumber,
  discountedPrice: optionalNumber,
  discountPercent: optionalNumber,
  type: z.enum(['PACKAGE', 'DISCOUNT', 'SEASONAL', 'SPECIAL_OFFER', 'EARLY_BIRD', 'LAST_MINUTE']),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  termsAndConditions: z.string().optional(),
  maxRedemptions: optionalNumber,
  promotionCode: z.string().optional(),
  features: z.array(z.string().min(1)).optional(),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  return !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()) && endDate >= startDate;
}, {
  message: 'Data de termino deve ser igual ou posterior a data de inicio',
  path: ['endDate'],
});

export type PromotionFormData = z.infer<typeof promotionFormSchema>;
