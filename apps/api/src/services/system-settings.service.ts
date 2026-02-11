import { prisma } from '../config/database';
import { SettingsCategory } from '@prisma/client';

export class SystemSettingsService {
  /**
   * Get setting by key
   */
  static async getByKey(key: string) {
    return prisma.settings.findUnique({
      where: { key },
    });
  }

  /**
   * Get all settings by category
   */
  static async getByCategory(category: SettingsCategory) {
    return prisma.settings.findMany({
      where: { category },
    });
  }

  /**
   * Get all public settings (for frontend)
   */
  static async getPublicSettings() {
    return prisma.settings.findMany({
      where: { isPublic: true },
    });
  }

  /**
   * Upsert (create or update) a setting
   */
  static async upsert(data: {
    key: string;
    value: any;
    category: SettingsCategory;
    description?: string;
    isPublic?: boolean;
  }) {
    return prisma.settings.upsert({
      where: { key: data.key },
      create: {
        key: data.key,
        value: data.value,
        category: data.category,
        description: data.description,
        isPublic: data.isPublic ?? false,
      },
      update: {
        value: data.value,
        description: data.description,
        isPublic: data.isPublic,
      },
    });
  }

  /**
   * Delete a setting
   */
  static async delete(key: string) {
    return prisma.settings.delete({
      where: { key },
    });
  }

  /**
   * Get visual identity settings
   */
  static async getVisualIdentity() {
    const settings = await this.getByCategory('BRANDING');
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
  }

  /**
   * Update visual identity
   */
  static async updateVisualIdentity(data: {
    logo?: string;
    footerLogo?: string;
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  }) {
    const updates = Object.entries(data).map(([key, value]) =>
      this.upsert({
        key: `branding_${key}`,
        value,
        category: 'BRANDING',
        isPublic: true,
      })
    );

    return Promise.all(updates);
  }

  /**
   * Get SEO settings
   */
  static async getSEO() {
    const settings = await this.getByCategory('SEO');
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
  }

  /**
   * Update SEO settings
   */
  static async updateSEO(data: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
  }) {
    const updates = Object.entries(data).map(([key, value]) =>
      this.upsert({
        key: `seo_${key}`,
        value,
        category: 'SEO',
        isPublic: true,
      })
    );

    return Promise.all(updates);
  }

  /**
   * Get content settings (policies, terms, etc.)
   */
  static async getContent(key: string) {
    const setting = await this.getByKey(`content_${key}`);
    return setting?.value || null;
  }

  /**
   * Update content settings
   */
  static async updateContent(key: string, content: string) {
    return this.upsert({
      key: `content_${key}`,
      value: content,
      category: 'CONTENT',
      isPublic: true,
    });
  }
}
