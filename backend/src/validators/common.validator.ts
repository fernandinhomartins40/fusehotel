import { z } from 'zod';

/**
 * Common Validation Schemas
 */

// UUID schema
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Email schema
export const emailSchema = z.string().email('Invalid email format');

// Phone schema (Brazilian format)
export const phoneSchema = z
  .string()
  .regex(/^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/, 'Invalid phone number format')
  .optional();

// CPF schema (Brazilian format)
export const cpfSchema = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Invalid CPF format')
  .optional();

// Date schema
export const dateSchema = z.coerce.date();

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Sort order schema
export const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');

// URL schema
export const urlSchema = z.string().url('Invalid URL format');

// Positive number schema
export const positiveNumberSchema = z.number().positive('Must be a positive number');

// Non-negative number schema
export const nonNegativeNumberSchema = z
  .number()
  .nonnegative('Must be a non-negative number');

// Password schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');
