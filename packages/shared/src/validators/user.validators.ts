/**
 * User Validators
 *
 * Validadores para usuários
 */

import { z } from 'zod';
import { emailSchema, passwordSchema, phoneSchema, cpfSchema } from './common.validators';
import { UserRole } from '../types';

/**
 * Schema de criação de usuário
 */
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  phone: phoneSchema.optional(),
  cpf: cpfSchema.optional(),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
});

/**
 * Schema de atualização de usuário
 */
export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100).optional(),
  phone: phoneSchema.optional(),
  profileImage: z.string().url().optional(),
  preferences: z
    .object({
      language: z.string().optional(),
      timezone: z.string().optional(),
      currency: z.string().optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          sms: z.boolean().optional(),
          push: z.boolean().optional(),
          marketing: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Schema de filtros de usuário
 */
export const userFiltersSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  search: z.string().optional(),
});
