import { z } from 'zod';
import { emailSchema, phoneSchema } from './common.validators';

export const contactMessageSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().trim().min(3, 'Assunto deve ter no mínimo 3 caracteres').max(150),
  message: z.string().trim().min(10, 'Mensagem deve ter no mínimo 10 caracteres').max(2000),
});
