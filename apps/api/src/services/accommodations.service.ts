import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import {
  generateSlug,
  CreateAccommodationDto,
  UpdateAccommodationDto,
  AccommodationFilters
} from '@fusehotel/shared';
import { Prisma } from '@prisma/client';

const accommodationInclude = {
  images: { orderBy: { order: 'asc' as const } },
  amenities: {
    include: { amenity: true }
  }
};

const mapAccommodationImages = (
  images: Array<{ url: string; alt: string; order: number; isPrimary: boolean }> = []
) => images.map((image) => ({
  url: image.url,
  alt: image.alt,
  order: image.order,
  isPrimary: image.isPrimary
}));

export class AccommodationService {
  static async list(filters: AccommodationFilters) {
    const where: Prisma.AccommodationWhereInput = {};

    if (filters.type) where.type = filters.type;
    if (filters.isAvailable !== undefined) where.isAvailable = filters.isAvailable;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.minPrice || filters.maxPrice) {
      where.pricePerNight = {};
      if (filters.minPrice) where.pricePerNight.gte = filters.minPrice;
      if (filters.maxPrice) where.pricePerNight.lte = filters.maxPrice;
    }
    if (filters.minCapacity) where.capacity = { gte: filters.minCapacity };

    return prisma.accommodation.findMany({
      where,
      include: accommodationInclude,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: string) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      include: accommodationInclude
    });

    if (!accommodation) {
      throw new NotFoundError('Acomodacao nao encontrada');
    }

    return accommodation;
  }

  static async getBySlug(slug: string) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { slug },
      include: accommodationInclude
    });

    if (!accommodation) {
      throw new NotFoundError('Acomodacao nao encontrada');
    }

    return accommodation;
  }

  static async create(data: CreateAccommodationDto) {
    const slug = generateSlug(data.name);

    const accommodation = await prisma.accommodation.create({
      data: {
        name: data.name,
        slug,
        type: data.type,
        capacity: data.capacity,
        pricePerNight: data.pricePerNight,
        description: data.description,
        shortDescription: data.shortDescription || null,
        floor: data.floor,
        view: data.view || null,
        area: data.area,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        extraBeds: data.extraBeds || 0,
        maxExtraBeds: data.maxExtraBeds || 0,
        extraBedPrice: data.extraBedPrice || 0,
        cancellationPolicy: data.cancellationPolicy || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        keywords: data.keywords || [],
        isAvailable: data.isAvailable !== false,
        isFeatured: data.isFeatured || false,
        images: {
          create: mapAccommodationImages(data.images)
        },
        amenities: {
          create: (data.amenityIds || []).map((amenityId: string) => ({
            amenityId
          }))
        }
      },
      include: accommodationInclude
    });

    return accommodation;
  }

  static async update(id: string, data: UpdateAccommodationDto) {
    const existingAccommodation = await this.getById(id);

    const updateData: Prisma.AccommodationUpdateInput = {
      ...(data.name !== undefined
        ? {
            name: data.name,
            slug: generateSlug(data.name)
          }
        : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.capacity !== undefined ? { capacity: data.capacity } : {}),
      ...(data.pricePerNight !== undefined ? { pricePerNight: data.pricePerNight } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.shortDescription !== undefined
        ? { shortDescription: data.shortDescription || null }
        : {}),
      ...(data.floor !== undefined ? { floor: data.floor } : {}),
      ...(data.view !== undefined ? { view: data.view || null } : {}),
      ...(data.area !== undefined ? { area: data.area } : {}),
      ...(data.checkInTime !== undefined ? { checkInTime: data.checkInTime } : {}),
      ...(data.checkOutTime !== undefined ? { checkOutTime: data.checkOutTime } : {}),
      ...(data.extraBeds !== undefined ? { extraBeds: data.extraBeds } : {}),
      ...(data.maxExtraBeds !== undefined ? { maxExtraBeds: data.maxExtraBeds } : {}),
      ...(data.extraBedPrice !== undefined ? { extraBedPrice: data.extraBedPrice } : {}),
      ...(data.cancellationPolicy !== undefined
        ? { cancellationPolicy: data.cancellationPolicy || null }
        : {}),
      ...(data.metaTitle !== undefined ? { metaTitle: data.metaTitle || null } : {}),
      ...(data.metaDescription !== undefined
        ? { metaDescription: data.metaDescription || null }
        : {}),
      ...(data.keywords !== undefined ? { keywords: data.keywords } : {}),
      ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      ...(data.images !== undefined
        ? {
            images: {
              deleteMany: {},
              create: mapAccommodationImages(data.images)
            }
          }
        : {}),
      ...(data.amenityIds !== undefined
        ? {
            amenities: {
              deleteMany: {},
              create: data.amenityIds.map((amenityId: string) => ({
                amenityId
              }))
            }
          }
        : {})
    };

    if (Object.keys(updateData).length === 0) {
      return existingAccommodation;
    }

    return prisma.accommodation.update({
      where: { id },
      data: updateData,
      include: accommodationInclude
    });
  }

  static async delete(id: string) {
    await this.getById(id);
    await prisma.accommodation.delete({ where: { id } });
  }
}
