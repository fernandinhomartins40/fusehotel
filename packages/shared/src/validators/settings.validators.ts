/**
 * Settings Validators
 *
 * Validadores para configurações do hotel
 */

import { z } from 'zod';

/**
 * Schema de configurações do hotel
 */
export const hotelSettingsSchema = z.object({
  hotelWhatsApp: z.string().min(10, 'WhatsApp do hotel é obrigatório').max(20),
  hotelName: z.string().min(3, 'Nome do hotel é obrigatório').max(100).optional(),
  hotelEmail: z.string().email('Email inválido').optional(),
  hotelPhone: z.string().min(10).max(20).optional(),
  hotelAddress: z.string().max(500).optional(),
});

/**
 * Schema de atualização de configurações
 */
export const updateHotelSettingsSchema = hotelSettingsSchema.partial();
