import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { generateSlug } from '@fusehotel/shared';

export class PromotionService {
  static async list(filters: any) {
    const where: any = { isActive: true };
    
    if (filters.type) where.type = filters.type;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured === 'true';

    return prisma.promotion.findMany({
      where,
      include: {
        features: { orderBy: { order: 'asc' } }
      },
      orderBy: { startDate: 'desc' }
    });
  }

  static async getById(id: string) {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        features: { orderBy: { order: 'asc' } }
      }
    });

    if (!promotion) {
      throw new NotFoundError('Promoção não encontrada');
    }

    return promotion;
  }

  static async getBySlug(slug: string) {
    const promotion = await prisma.promotion.findUnique({
      where: { slug },
      include: {
        features: { orderBy: { order: 'asc' } }
      }
    });

    if (!promotion) {
      throw new NotFoundError('Promoção não encontrada');
    }

    return promotion;
  }

  static async create(data: any) {
    const slug = generateSlug(data.title);

    return prisma.promotion.create({
      data: {
        title: data.title,
        slug,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        image: data.image,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        originalPrice: data.originalPrice,
        discountedPrice: data.discountedPrice,
        discountPercent: data.discountPercent,
        type: data.type,
        isActive: data.isActive !== false,
        isFeatured: data.isFeatured || false,
        termsAndConditions: data.termsAndConditions,
        maxRedemptions: data.maxRedemptions,
        promotionCode: data.promotionCode,
        features: {
          create: (data.features || []).map((feature: string, index: number) => ({
            feature,
            order: index
          }))
        }
      },
      include: {
        features: true
      }
    });
  }
}
