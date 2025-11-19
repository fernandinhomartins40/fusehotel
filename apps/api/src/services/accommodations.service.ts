/**
 * Accommodations Service
 *
 * Serviço de gerenciamento de acomodações
 */

import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { generateSlug, generateUniqueSlug } from '../utils/crypto';
import logger from '../utils/logger';
import { Accommodation, AccommodationType } from '@prisma/client';

/**
 * Interface de dados para criação de acomodação
 */
export interface CreateAccommodationData {
  name: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription?: string;
  images: Array<{ url: string; alt: string; order: number; isPrimary: boolean }>;
  amenityIds: string[];
  floor?: number;
  view?: string;
  area?: number;
  checkInTime?: string;
  checkOutTime?: string;
  extraBeds?: number;
  maxExtraBeds?: number;
  extraBedPrice?: number;
  cancellationPolicy?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
}

/**
 * Interface de dados para atualização de acomodação
 */
export interface UpdateAccommodationData extends Partial<CreateAccommodationData> {}

/**
 * Interface de filtros de busca
 */
export interface AccommodationFilters {
  type?: AccommodationType;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  amenityIds?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
  checkInDate?: Date;
  checkOutDate?: Date;
}

/**
 * Service de acomodações
 */
export class AccommodationsService {
  /**
   * Lista todas as acomodações (com paginação e filtros)
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: AccommodationFilters
  ): Promise<{ accommodations: any[]; total: number }> {
    const skip = (page - 1) * limit;

    // Monta o where baseado nos filtros
    const where: any = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.pricePerNight = {};
      if (filters.minPrice !== undefined) {
        where.pricePerNight.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.pricePerNight.lte = filters.maxPrice;
      }
    }

    if (filters?.minCapacity !== undefined) {
      where.capacity = { gte: filters.minCapacity };
    }

    if (filters?.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable;
    }

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    // Filtro de amenidades
    if (filters?.amenityIds && filters.amenityIds.length > 0) {
      where.amenities = {
        some: {
          amenityId: {
            in: filters.amenityIds,
          },
        },
      };
    }

    // Filtro de disponibilidade por datas
    if (filters?.checkInDate && filters?.checkOutDate) {
      where.NOT = {
        reservations: {
          some: {
            OR: [
              {
                AND: [
                  { checkInDate: { lte: filters.checkInDate } },
                  { checkOutDate: { gt: filters.checkInDate } },
                ],
              },
              {
                AND: [
                  { checkInDate: { lt: filters.checkOutDate } },
                  { checkOutDate: { gte: filters.checkOutDate } },
                ],
              },
              {
                AND: [
                  { checkInDate: { gte: filters.checkInDate } },
                  { checkOutDate: { lte: filters.checkOutDate } },
                ],
              },
            ],
            status: {
              in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
            },
          },
        },
      };
    }

    // Busca as acomodações
    const [accommodations, total] = await Promise.all([
      prisma.accommodation.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          amenities: {
            include: {
              amenity: true,
            },
          },
          _count: {
            select: {
              reservations: true,
              reviews: true,
            },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.accommodation.count({ where }),
    ]);

    // Formata a resposta
    const formattedAccommodations = accommodations.map((acc) => ({
      ...acc,
      amenities: acc.amenities.map((a) => a.amenity),
      reservationsCount: acc._count.reservations,
      reviewsCount: acc._count.reviews,
    }));

    return { accommodations: formattedAccommodations, total };
  }

  /**
   * Busca uma acomodação por ID
   */
  async findById(id: string): Promise<any> {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!accommodation) {
      throw new NotFoundError('Accommodation', id);
    }

    // Calcula média de avaliações
    const avgRating = await prisma.review.aggregate({
      where: {
        accommodationId: id,
        isPublished: true,
      },
      _avg: {
        rating: true,
        cleanliness: true,
        comfort: true,
        location: true,
        service: true,
        valueForMoney: true,
      },
      _count: true,
    });

    return {
      ...accommodation,
      amenities: accommodation.amenities.map((a) => a.amenity),
      averageRating: avgRating._avg.rating || 0,
      reviewsCount: avgRating._count,
      ratings: {
        overall: avgRating._avg.rating || 0,
        cleanliness: avgRating._avg.cleanliness || 0,
        comfort: avgRating._avg.comfort || 0,
        location: avgRating._avg.location || 0,
        service: avgRating._avg.service || 0,
        valueForMoney: avgRating._avg.valueForMoney || 0,
      },
    };
  }

  /**
   * Busca uma acomodação por slug
   */
  async findBySlug(slug: string): Promise<any> {
    const accommodation = await prisma.accommodation.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!accommodation) {
      throw new NotFoundError('Accommodation');
    }

    // Calcula média de avaliações
    const avgRating = await prisma.review.aggregate({
      where: {
        accommodationId: accommodation.id,
        isPublished: true,
      },
      _avg: {
        rating: true,
        cleanliness: true,
        comfort: true,
        location: true,
        service: true,
        valueForMoney: true,
      },
      _count: true,
    });

    return {
      ...accommodation,
      amenities: accommodation.amenities.map((a) => a.amenity),
      averageRating: avgRating._avg.rating || 0,
      reviewsCount: avgRating._count,
      ratings: {
        overall: avgRating._avg.rating || 0,
        cleanliness: avgRating._avg.cleanliness || 0,
        comfort: avgRating._avg.comfort || 0,
        location: avgRating._avg.location || 0,
        service: avgRating._avg.service || 0,
        valueForMoney: avgRating._avg.valueForMoney || 0,
      },
    };
  }

  /**
   * Cria uma nova acomodação
   */
  async create(data: CreateAccommodationData): Promise<any> {
    // Gera slug único
    const existingSlugs = await prisma.accommodation.findMany({
      select: { slug: true },
    });
    const slug = generateUniqueSlug(
      data.name,
      existingSlugs.map((a) => a.slug)
    );

    // Cria a acomodação
    const accommodation = await prisma.accommodation.create({
      data: {
        name: data.name,
        slug,
        type: data.type,
        capacity: data.capacity,
        pricePerNight: data.pricePerNight,
        description: data.description,
        shortDescription: data.shortDescription,
        checkInTime: data.checkInTime || '14:00',
        checkOutTime: data.checkOutTime || '12:00',
        extraBeds: data.extraBeds || 0,
        maxExtraBeds: data.maxExtraBeds || 0,
        extraBedPrice: data.extraBedPrice || 0,
        floor: data.floor,
        view: data.view,
        area: data.area,
        cancellationPolicy: data.cancellationPolicy,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords || [],
        isAvailable: data.isAvailable ?? true,
        isFeatured: data.isFeatured ?? false,
        images: {
          create: data.images,
        },
        amenities: {
          create: data.amenityIds.map((amenityId) => ({
            amenityId,
          })),
        },
      },
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });

    logger.info('Accommodation created', { accommodationId: accommodation.id });

    return {
      ...accommodation,
      amenities: accommodation.amenities.map((a) => a.amenity),
    };
  }

  /**
   * Atualiza uma acomodação
   */
  async update(id: string, data: UpdateAccommodationData): Promise<any> {
    // Verifica se a acomodação existe
    const existing = await prisma.accommodation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Accommodation', id);
    }

    // Prepara dados de atualização
    const updateData: any = {};

    if (data.name) {
      updateData.name = data.name;
      // Atualiza slug se o nome mudou
      if (data.name !== existing.name) {
        const existingSlugs = await prisma.accommodation.findMany({
          where: { id: { not: id } },
          select: { slug: true },
        });
        updateData.slug = generateUniqueSlug(
          data.name,
          existingSlugs.map((a) => a.slug)
        );
      }
    }

    // Adiciona outros campos simples
    const simpleFields = [
      'type',
      'capacity',
      'pricePerNight',
      'description',
      'shortDescription',
      'checkInTime',
      'checkOutTime',
      'extraBeds',
      'maxExtraBeds',
      'extraBedPrice',
      'floor',
      'view',
      'area',
      'cancellationPolicy',
      'metaTitle',
      'metaDescription',
      'keywords',
      'isAvailable',
      'isFeatured',
    ];

    simpleFields.forEach((field) => {
      if (data[field as keyof UpdateAccommodationData] !== undefined) {
        updateData[field] = data[field as keyof UpdateAccommodationData];
      }
    });

    // Atualiza imagens se fornecidas
    if (data.images) {
      // Remove imagens antigas
      await prisma.accommodationImage.deleteMany({
        where: { accommodationId: id },
      });
      // Adiciona novas imagens
      updateData.images = {
        create: data.images,
      };
    }

    // Atualiza amenidades se fornecidas
    if (data.amenityIds) {
      // Remove amenidades antigas
      await prisma.accommodationAmenity.deleteMany({
        where: { accommodationId: id },
      });
      // Adiciona novas amenidades
      updateData.amenities = {
        create: data.amenityIds.map((amenityId) => ({
          amenityId,
        })),
      };
    }

    // Atualiza a acomodação
    const accommodation = await prisma.accommodation.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });

    logger.info('Accommodation updated', { accommodationId: id });

    return {
      ...accommodation,
      amenities: accommodation.amenities.map((a) => a.amenity),
    };
  }

  /**
   * Deleta uma acomodação
   */
  async delete(id: string): Promise<void> {
    // Verifica se a acomodação existe
    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
            },
          },
        },
      },
    });

    if (!accommodation) {
      throw new NotFoundError('Accommodation', id);
    }

    // Não permite deletar se houver reservas ativas
    if (accommodation.reservations.length > 0) {
      throw new ConflictError(
        'Cannot delete accommodation with active reservations'
      );
    }

    // Deleta a acomodação
    await prisma.accommodation.delete({
      where: { id },
    });

    logger.info('Accommodation deleted', { accommodationId: id });
  }

  /**
   * Verifica disponibilidade de uma acomodação
   */
  async checkAvailability(
    id: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<boolean> {
    const conflictingReservations = await prisma.reservation.count({
      where: {
        accommodationId: id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          {
            AND: [
              { checkInDate: { lte: checkInDate } },
              { checkOutDate: { gt: checkInDate } },
            ],
          },
          {
            AND: [
              { checkInDate: { lt: checkOutDate } },
              { checkOutDate: { gte: checkOutDate } },
            ],
          },
          {
            AND: [
              { checkInDate: { gte: checkInDate } },
              { checkOutDate: { lte: checkOutDate } },
            ],
          },
        ],
      },
    });

    return conflictingReservations === 0;
  }

  /**
   * Obtém estatísticas de acomodações
   */
  async getStats(): Promise<any> {
    const [total, available, featured, byType] = await Promise.all([
      prisma.accommodation.count(),
      prisma.accommodation.count({ where: { isAvailable: true } }),
      prisma.accommodation.count({ where: { isFeatured: true } }),
      prisma.accommodation.groupBy({
        by: ['type'],
        _count: true,
      }),
    ]);

    return {
      total,
      available,
      featured,
      byType: byType.reduce((acc, curr) => {
        acc[curr.type] = curr._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export default new AccommodationsService();
