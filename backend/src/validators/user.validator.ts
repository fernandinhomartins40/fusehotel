import { z } from 'zod';
import { UserRole } from '@prisma/client';
import { emailSchema, phoneSchema, cpfSchema, paginationSchema, sortOrderSchema } from './common.validator';

/**
 * User Validation Schemas
 */

// Update user profile schema
export const updateUserProfileSchema = z.object({
  name: z.string().min(3).optional(),
  phone: phoneSchema,
  cpf: cpfSchema,
  profileImage: z.string().url().optional(),
});

// Create user schema (admin only)
export const createUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
  name: z.string().min(3),
  phone: phoneSchema,
  cpf: cpfSchema,
  role: z.nativeEnum(UserRole).optional(),
});

// Update user schema (admin only)
export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  phone: phoneSchema,
  cpf: cpfSchema,
  profileImage: z.string().url().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});

// User list query schema
export const userListQuerySchema = paginationSchema.extend({
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt']).optional(),
  sortOrder: sortOrderSchema,
});
