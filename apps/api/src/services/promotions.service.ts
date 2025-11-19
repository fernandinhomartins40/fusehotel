/**
 * Promotions Service
 *
 * Serviço de gerenciamento de promoções
 */

import { prisma } from '../config/database';
import { NotFoundError, InvalidPromotionError } from '../utils/errors';
import { generateSlug, generateUniqueSlug } from '../utils/crypto';
import logger from '../utils/logger';
import { PromotionType, DiscountType } from '@prisma/client';
import { isWithinInterval, isPast } from 'date-fns';

/**
 * Interface de dados para criação de promoção
 */
export interface CreatePromotionData {
  title: string;
  shortDescription: string;
  longDescription: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercent?: number;
  discountType: DiscountType;
  type: PromotionType;
  isActive?: boolean;
  isFeatured?: boolean;
  features?: string[];
  rules?: any;
  termsAndConditions?: string;
  maxRedemptions?: number;
  promotionCode?: string;
}

/**
 * Interface de dados para atualização de promoção
 */
export interface UpdatePromotionData extends Partial<CreatePromotionData> {}

/**
 * Interface de filtros de busca
 */
export interface PromotionFilters {
  type?: PromotionType;
  isActive?: boolean;
  isFeatured?: boolean;
  discountType?: DiscountType;
}

/**
 * Service de promoções
 */
export class PromotionsService {
  /**
   * Lista todas as promoções
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: PromotionFilters
  ): Promise<{ promotions: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters?.discountType) {
      where.discountType = filters.discountType;
    }

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where,
        skip,
        take: limit,
        include: {
          features: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { startDate: 'desc' }],
      }),
      prisma.promotion.count({ where }),
    ]);

    return { promotions, total };
  }

  /**
   * Busca uma promoção por ID
   */
  async findById(id: string): Promise<any> {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        features: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundError('Promotion', id);
    }

    return promotion;
  }

  /**
   * Busca uma promoção por slug
   */
  async findBySlug(slug: string): Promise<any> {
    const promotion = await prisma.promotion.findUnique({
      where: { slug },
      include: {
        features: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundError('Promotion');
    }

    return promotion;
  }

  /**
   * Cria uma nova promoção
   */
  async create(data: CreatePromotionData): Promise<any> {
    // Gera slug único
    const existingSlugs = await prisma.promotion.findMany({
      select: { slug: true },
    });
    const slug = generateUniqueSlug(
      data.title,
      existingSlugs.map((p) => p.slug)
    );

    // Cria a promoção
    const promotion = await prisma.promotion.create({
      data: {
        title: data.title,
        slug,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        image: data.image,
        startDate: data.startDate,
        endDate: data.endDate,
        originalPrice: data.originalPrice,
        discountedPrice: data.discountedPrice,
        discountPercent: data.discountPercent,
        discountType: data.discountType,
        type: data.type,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        rules: data.rules,
        termsAndConditions: data.termsAndConditions,
        maxRedemptions: data.maxRedemptions,
        promotionCode: data.promotionCode,
        features: data.features
          ? {
              create: data.features.map((feature, index) => ({
                feature,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        features: true,
      },
    });

    logger.info('Promotion created', { promotionId: promotion.id });

    return promotion;
  }

  /**
   * Atualiza uma promoção
   */
  async update(id: string, data: UpdatePromotionData): Promise<any> {
    const existing = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Promotion', id);
    }

    const updateData: any = {};

    if (data.title) {
      updateData.title = data.title;
      if (data.title !== existing.title) {
        const existingSlugs = await prisma.promotion.findMany({
          where: { id: { not: id } },
          select: { slug: true },
        });
        updateData.slug = generateUniqueSlug(
          data.title,
          existingSlugs.map((p) => p.slug)
        );
      }
    }

    const simpleFields = [
      'shortDescription',
      'longDescription',
      'image',
      'startDate',
      'endDate',
      'originalPrice',
      'discountedPrice',
      'discountPercent',
      'discountType',
      'type',
      'isActive',
      'isFeatured',
      'rules',
      'termsAndConditions',
      'maxRedemptions',
      'promotionCode',
    ];

    simpleFields.forEach((field) => {
      if (data[field as keyof UpdatePromotionData] !== undefined) {
        updateData[field] = data[field as keyof UpdatePromotionData];
      }
    });

    if (data.features) {
      await prisma.promotionFeature.deleteMany({
        where: { promotionId: id },
      });
      updateData.features = {
        create: data.features.map((feature, index) => ({
          feature,
          order: index,
        })),
      };
    }

    const promotion = await prisma.promotion.update({
      where: { id },
      data: updateData,
      include: {
        features: true,
      },
    });

    logger.info('Promotion updated', { promotionId: id });

    return promotion;
  }

  /**
   * Deleta uma promoção
   */
  async delete(id: string): Promise<void> {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundError('Promotion', id);
    }

    await prisma.promotion.delete({
      where: { id },
    });

    logger.info('Promotion deleted', { promotionId: id });
  }

  /**
   * Valida código promocional
   */
  async validateCode(code: string): Promise<any> {
    const promotion = await prisma.promotion.findUnique({
      where: { promotionCode: code },
    });

    if (!promotion) {
      throw new InvalidPromotionError('Promotion code not found');
    }

    if (!promotion.isActive) {
      throw new InvalidPromotionError('Promotion is not active');
    }

    const now = new Date();
    const isValidPeriod = isWithinInterval(now, {
      start: promotion.startDate,
      end: promotion.endDate,
    });

    if (!isValidPeriod) {
      if (isPast(promotion.endDate)) {
        throw new InvalidPromotionError('Promotion has expired');
      } else {
        throw new InvalidPromotionError('Promotion has not started yet');
      }
    }

    if (
      promotion.maxRedemptions &&
      promotion.currentRedemptions >= promotion.maxRedemptions
    ) {
      throw new InvalidPromotionError('Promotion has reached maximum redemptions');
    }

    return {
      isValid: true,
      promotion,
      discountAmount: Number(promotion.discountPercent || 0),
      discountType: promotion.discountType,
    };
  }

  /**
   * Incrementa contador de resgates
   */
  async incrementRedemptions(id: string): Promise<void> {
    await prisma.promotion.update({
      where: { id },
      data: {
        currentRedemptions: {
          increment: 1,
        },
      },
    });
  }
}

export default new PromotionsService();
