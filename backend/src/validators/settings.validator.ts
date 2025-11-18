import { z } from 'zod';
import { SettingsCategory } from '@prisma/client';
import { emailSchema } from './common.validator';

/**
 * Settings Validation Schemas
 */

// Create settings schema
export const createSettingsSchema = z.object({
  key: z.string().min(1),
  value: z.record(z.unknown()),
  category: z.nativeEnum(SettingsCategory),
  description: z.string().optional(),
});

// Update settings schema
export const updateSettingsSchema = z.object({
  value: z.record(z.unknown()),
  description: z.string().optional(),
});

// Newsletter subscription schema
export const newsletterSubscriptionSchema = z.object({
  email: emailSchema,
  name: z.string().optional(),
});

// Contact message schema
export const contactMessageSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: emailSchema,
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});
