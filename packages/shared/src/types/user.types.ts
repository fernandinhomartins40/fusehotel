/**
 * User Types
 *
 * Tipos relacionados a usuários
 */

import { BaseEntity } from './common.types';

/**
 * Roles de usuário
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CUSTOMER = 'CUSTOMER',
}

/**
 * Status do usuário
 */
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

/**
 * Interface completa do usuário
 */
export interface User extends BaseEntity {
  email: string;
  name: string;
  phone: string | null;
  cpf: string | null;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  profileImage: string | null;
  preferences: UserPreferences;
  lastLoginAt: string | null;
}

/**
 * Dados públicos do usuário (sem informações sensíveis)
 */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  role: UserRole;
}

/**
 * Preferências do usuário
 */
export interface UserPreferences {
  language: string;
  timezone: string;
  currency: string;
  notifications: NotificationPreferences;
}

/**
 * Preferências de notificações
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
}

/**
 * Dados para criação de usuário
 */
export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
  cpf?: string;
  role?: UserRole;
}

/**
 * Dados para atualização de usuário
 */
export interface UpdateUserDto {
  name?: string;
  phone?: string;
  profileImage?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * Dados para atualização de senha
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Dados de perfil do usuário
 */
export interface UserProfile extends User {
  reservationsCount: number;
  totalSpent: number;
  lastReservationAt: string | null;
}
