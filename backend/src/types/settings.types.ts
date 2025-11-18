import { SettingsCategory } from '@prisma/client';

/**
 * Settings Types
 */

export interface SettingsValue {
  id: string;
  key: string;
  value: Record<string, unknown>;
  category: SettingsCategory;
  description: string | null;
  updatedAt: Date;
}

export interface CreateSettingsInput {
  key: string;
  value: Record<string, unknown>;
  category: SettingsCategory;
  description?: string;
}

export interface UpdateSettingsInput {
  value: Record<string, unknown>;
  description?: string;
}

// Specific Settings Types

export interface SiteInfoSettings {
  companyName: string;
  slogan: string;
  address: string;
  phone: string;
  email: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface BrandingSettings {
  logoUrl: string;
  footerLogoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  headingFont?: string;
  bodyFont?: string;
}

export interface ContentSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutContent: string;
  aboutImage: string;
  highlightsTitle: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface EmailSettings {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface PaymentSettings {
  stripeEnabled: boolean;
  stripePublicKey?: string;
  stripeSecretKey?: string;
  pixEnabled: boolean;
  pixKey?: string;
}

export interface NewsletterSubscriptionInput {
  email: string;
  name?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
