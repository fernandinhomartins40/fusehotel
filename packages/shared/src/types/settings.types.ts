/**
 * Settings Types
 *
 * Tipos relacionados a configurações do sistema
 */

import { BaseEntity } from './common.types';

/**
 * Categorias de configuração
 */
export enum SettingsCategory {
  SITE_INFO = 'SITE_INFO',
  BRANDING = 'BRANDING',
  CONTENT = 'CONTENT',
  SEO = 'SEO',
  EMAIL = 'EMAIL',
  PAYMENT = 'PAYMENT',
  BOOKING = 'BOOKING',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  GENERAL = 'GENERAL',
}

/**
 * Valor de configuração (pode ser qualquer tipo JSON)
 */
export type SettingValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | Record<string, unknown>
  | null;

/**
 * Interface de configuração
 */
export interface Setting extends BaseEntity {
  key: string;
  value: SettingValue;
  category: SettingsCategory;
  description: string | null;
  isPublic: boolean;
}

/**
 * Configurações do site
 */
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  timezone: string;
  language: string;
  currency: string;
}

/**
 * Configurações de branding
 */
export interface BrandingSettings {
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

/**
 * Configurações de SEO
 */
export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage: string;
  twitterCard: string;
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
}

/**
 * Configurações de email
 */
export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
}

/**
 * Configurações de pagamento
 */
export interface PaymentSettings {
  enableCreditCard: boolean;
  enableDebitCard: boolean;
  enablePix: boolean;
  enableBankTransfer: boolean;
  enableCash: boolean;
  stripePublicKey: string | null;
  stripeSecretKey: string | null;
  pixKey: string | null;
  bankAccount: BankAccountSettings | null;
}

/**
 * Configurações de conta bancária
 */
export interface BankAccountSettings {
  bankName: string;
  accountNumber: string;
  agency: string;
  accountHolder: string;
  cpfCnpj: string;
}

/**
 * Configurações de reserva
 */
export interface BookingSettings {
  minAdvanceBookingHours: number;
  maxAdvanceBookingDays: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationDeadlineHours: number;
  refundPercentage: number;
  requireApproval: boolean;
  allowGuestCheckout: boolean;
}

/**
 * Configurações de notificações
 */
export interface NotificationSettings {
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  enablePushNotifications: boolean;
  notifyOnNewReservation: boolean;
  notifyOnReservationCancellation: boolean;
  notifyOnPaymentReceived: boolean;
}

/**
 * Configurações de redes sociais
 */
export interface SocialMediaSettings {
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  whatsappNumber: string | null;
}

/**
 * Todas as configurações do sistema
 */
export interface SystemSettings {
  site: SiteSettings;
  branding: BrandingSettings;
  seo: SeoSettings;
  email: EmailSettings;
  payment: PaymentSettings;
  booking: BookingSettings;
  notifications: NotificationSettings;
  socialMedia: SocialMediaSettings;
}

/**
 * Dados para atualização de configurações
 */
export interface UpdateSettingsDto {
  category: SettingsCategory;
  settings: Record<string, SettingValue>;
}
