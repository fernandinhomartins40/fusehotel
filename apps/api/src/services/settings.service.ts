/**
 * Settings Service
 *
 * Serviço de gerenciamento de configurações
 */

import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';
import { SettingCategory } from '@prisma/client';

/**
 * Interface de dados para criação de configuração
 */
export interface CreateSettingData {
  category: SettingCategory;
  key: string;
  value: string;
  type?: string;
  label: string;
  description?: string;
  isPublic?: boolean;
  order?: number;
}

/**
 * Interface de dados para atualização de configuração
 */
export interface UpdateSettingData {
  value?: string;
  label?: string;
  description?: string;
  isPublic?: boolean;
  order?: number;
}

/**
 * Service de configurações
 */
export class SettingsService {
  /**
   * Lista todas as configurações
   */
  async findAll(): Promise<any[]> {
    const settings = await prisma.settings.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    return settings;
  }

  /**
   * Lista configurações por categoria
   */
  async findByCategory(category: SettingCategory): Promise<any[]> {
    const settings = await prisma.settings.findMany({
      where: { category },
      orderBy: { order: 'asc' },
    });

    return settings;
  }

  /**
   * Lista configurações públicas
   */
  async findPublic(): Promise<any[]> {
    const settings = await prisma.settings.findMany({
      where: { isPublic: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    return settings;
  }

  /**
   * Busca uma configuração específica
   */
  async findOne(category: SettingCategory, key: string): Promise<any> {
    const setting = await prisma.settings.findUnique({
      where: {
        category_key: {
          category,
          key,
        },
      },
    });

    if (!setting) {
      throw new NotFoundError('Setting');
    }

    return setting;
  }

  /**
   * Obtém valor de uma configuração
   */
  async getValue(category: SettingCategory, key: string): Promise<string> {
    const setting = await this.findOne(category, key);
    return setting.value;
  }

  /**
   * Cria uma nova configuração
   */
  async create(data: CreateSettingData): Promise<any> {
    const setting = await prisma.settings.create({
      data: {
        category: data.category,
        key: data.key,
        value: data.value,
        type: data.type || 'string',
        label: data.label,
        description: data.description,
        isPublic: data.isPublic ?? false,
        order: data.order ?? 0,
      },
    });

    logger.info('Setting created', {
      category: setting.category,
      key: setting.key,
    });

    return setting;
  }

  /**
   * Atualiza uma configuração
   */
  async update(
    category: SettingCategory,
    key: string,
    data: UpdateSettingData
  ): Promise<any> {
    const existing = await this.findOne(category, key);

    const setting = await prisma.settings.update({
      where: {
        category_key: {
          category,
          key,
        },
      },
      data,
    });

    logger.info('Setting updated', {
      category: setting.category,
      key: setting.key,
    });

    return setting;
  }

  /**
   * Atualiza valor de uma configuração
   */
  async setValue(
    category: SettingCategory,
    key: string,
    value: string
  ): Promise<any> {
    return this.update(category, key, { value });
  }

  /**
   * Deleta uma configuração
   */
  async delete(category: SettingCategory, key: string): Promise<void> {
    await this.findOne(category, key);

    await prisma.settings.delete({
      where: {
        category_key: {
          category,
          key,
        },
      },
    });

    logger.info('Setting deleted', { category, key });
  }

  /**
   * Atualiza múltiplas configurações de uma vez
   */
  async updateMultiple(
    updates: Array<{ category: SettingCategory; key: string; value: string }>
  ): Promise<any[]> {
    const results = await Promise.all(
      updates.map((update) =>
        this.update(update.category, update.key, { value: update.value })
      )
    );

    logger.info('Multiple settings updated', { count: updates.length });

    return results;
  }

  /**
   * Obtém configurações como objeto key-value
   */
  async getAsObject(category?: SettingCategory): Promise<Record<string, string>> {
    const settings = category
      ? await this.findByCategory(category)
      : await this.findAll();

    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }
}

export default new SettingsService();
