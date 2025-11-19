/**
 * Common Validators
 *
 * Validadores comuns reutilizáveis
 */

import { z } from 'zod';

/**
 * Validador de email
 */
export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido')
  .toLowerCase()
  .trim();

/**
 * Validador de senha
 */
export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .max(100, 'Senha deve ter no máximo 100 caracteres')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
  );

/**
 * Validador de telefone brasileiro
 */
export const phoneSchema = z
  .string()
  .regex(
    /^(\+55\s?)?(\(?\d{2}\)?[\s-]?)?(9?\d{4}[\s-]?\d{4})$/,
    'Telefone inválido'
  )
  .transform((val) => val.replace(/\D/g, ''));

/**
 * Validador de CPF
 */
export const cpfSchema = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF inválido')
  .refine((cpf) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit === 10 || digit === 11) digit = 0;
    if (digit !== parseInt(cleanCpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit === 10 || digit === 11) digit = 0;
    if (digit !== parseInt(cleanCpf.charAt(10))) return false;

    return true;
  }, 'CPF inválido')
  .transform((val) => val.replace(/\D/g, ''));

/**
 * Validador de URL
 */
export const urlSchema = z.string().url('URL inválida');

/**
 * Validador de slug
 */
export const slugSchema = z
  .string()
  .min(1, 'Slug é obrigatório')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido (use apenas letras minúsculas, números e hífens)');

/**
 * Validador de data ISO
 */
export const dateISOSchema = z.string().datetime('Data inválida');

/**
 * Validador de UUID
 */
export const uuidSchema = z.string().uuid('ID inválido');

/**
 * Validador de paginação
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Validador de período de datas
 */
export const dateRangeSchema = z
  .object({
    startDate: dateISOSchema,
    endDate: dateISOSchema,
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Data inicial deve ser anterior ou igual à data final',
    path: ['endDate'],
  });

/**
 * Validador de horário (HH:mm)
 */
export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido (use formato HH:mm)');
