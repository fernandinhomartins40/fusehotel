import { z } from 'zod';
import { emailSchema } from './common.validators';

export const newsletterSubscriptionSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100).optional(),
});
