/**
 * Auth Validators
 *
 * Validadores para autenticação
 */

import { z } from 'zod';
import { emailSchema, passwordSchema, phoneSchema, cpfSchema } from './common.validators';

/**
 * Schema de login
 * Aceita email OU WhatsApp (apenas números)
 */
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email ou WhatsApp é obrigatório')
    .refine(
      (value) => {
        // Aceita email válido OU números (WhatsApp)
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isWhatsApp = /^\d+$/.test(value.replace(/\D/g, ''));
        return isEmail || (isWhatsApp && value.replace(/\D/g, '').length >= 10);
      },
      { message: 'Email ou WhatsApp inválido' }
    ),
  password: z.string().min(1, 'Senha é obrigatória'),
  rememberMe: z.boolean().optional(),
});

/**
 * Schema de registro
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
    phone: phoneSchema.optional(),
    cpf: cpfSchema.optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Você deve aceitar os termos de uso' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

/**
 * Schema de esqueci minha senha
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Schema de reset de senha
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token é obrigatório'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

/**
 * Schema de alteração de senha
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Nova senha deve ser diferente da senha atual',
    path: ['newPassword'],
  });

/**
 * Schema de refresh token
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

/**
 * Schema de verificação de email
 */
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
});
