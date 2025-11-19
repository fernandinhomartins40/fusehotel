import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { generateSlug } from '@fusehotel/shared';

export class AccommodationService {
  static async list(filters: any) {
    const where: any = {};
    
    if (filters.type) where.type = filters.type;
    if (filters.isAvailable !== undefined) where.isAvailable = filters.isAvailable === 'true';
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured === 'true';
    if (filters.minPrice) where.pricePerNight = { ...where.pricePerNight, gte: parseFloat(filters.minPrice) };
    if (filters.maxPrice) where.pricePerNight = { ...where.pricePerNight, lte: parseFloat(filters.maxPrice) };
    if (filters.minCapacity) where.capacity = { gte: parseInt(filters.minCapacity) };

    return prisma.accommodation.findMany({
      where,
      include: {
        images: { orderBy: { order: 'asc' } },
        amenities: {
          include: { amenity: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: string) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        amenities: {
          include: { amenity: true }
        }
      }
    });

    if (!accommodation) {
      throw new NotFoundError('Acomodação não encontrada');
    }

    return accommodation;
  }

  static async getBySlug(slug: string) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        amenities: {
          include: { amenity: true }
        }
      }
    });

    if (!accommodation) {
      throw new NotFoundError('Acomodação não encontrada');
    }

    return accommodation;
  }

  static async create(data: any) {
    const slug = generateSlug(data.name);

    const accommodation = await prisma.accommodation.create({
      data: {
        name: data.name,
        slug,
        type: data.type,
        capacity: data.capacity,
        pricePerNight: data.pricePerNight,
        description: data.description,
        shortDescription: data.shortDescription,
        floor: data.floor,
        view: data.view,
        area: data.area,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        extraBeds: data.extraBeds || 0,
        maxExtraBeds: data.maxExtraBeds || 0,
        extraBedPrice: data.extraBedPrice || 0,
        cancellationPolicy: data.cancellationPolicy,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords || [],
        isAvailable: data.isAvailable !== false,
        isFeatured: data.isFeatured || false,
        images: {
          create: data.images || []
        },
        amenities: {
          create: (data.amenityIds || []).map((amenityId: string) => ({
            amenityId
          }))
        }
      },
      include: {
        images: true,
        amenities: { include: { amenity: true } }
      }
    });

    return accommodation;
  }

  static async update(id: string, data: any) {
    await this.getById(id);

    return prisma.accommodation.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        capacity: data.capacity,
        pricePerNight: data.pricePerNight,
        description: data.description,
        shortDescription: data.shortDescription,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
      },
      include: {
        images: true,
        amenities: { include: { amenity: true } }
      }
    });
  }

  static async delete(id: string) {
    await this.getById(id);
    await prisma.accommodation.delete({ where: { id } });
  }
}
