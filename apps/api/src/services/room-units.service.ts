import { generateSlug } from '@fusehotel/shared';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { CreateRoomUnitDto, UpdateRoomUnitDto } from '../types/pms';

const publicAccommodationInclude = {
  images: { orderBy: { order: 'asc' as const } },
  amenities: { include: { amenity: true } },
} as const;

export class RoomUnitsService {
  static async list() {
    return prisma.roomUnit.findMany({
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        _count: {
          select: {
            stays: true,
            housekeepingTasks: true,
          },
        },
      },
      orderBy: [{ accommodation: { name: 'asc' } }, { code: 'asc' }],
    });
  }

  static async listPublic(filters: { isFeatured?: boolean } = {}) {
    const roomUnits = await prisma.roomUnit.findMany({
      where: {
        isActive: true,
        accommodation: {
          isAvailable: true,
          ...(filters.isFeatured !== undefined ? { isFeatured: filters.isFeatured } : {}),
        },
      },
      include: {
        accommodation: {
          include: publicAccommodationInclude,
        },
      },
      orderBy: [{ accommodation: { isFeatured: 'desc' } }, { name: 'asc' }],
    });

    return roomUnits.map((roomUnit) => this.mapToPublicRoom(roomUnit));
  }

  static async getPublicBySlug(slug: string) {
    const roomUnits = await prisma.roomUnit.findMany({
      where: {
        isActive: true,
        accommodation: {
          isAvailable: true,
        },
      },
      include: {
        accommodation: {
          include: publicAccommodationInclude,
        },
      },
    });

    const roomUnit = roomUnits.find((item) => this.buildPublicSlug(item) === slug);

    if (!roomUnit) {
      throw new NotFoundError('Quarto nao encontrado');
    }

    return this.mapToPublicRoom(roomUnit);
  }

  static async getPublicById(id: string) {
    const roomUnit = await prisma.roomUnit.findUnique({
      where: { id },
      include: {
        accommodation: {
          include: publicAccommodationInclude,
        },
      },
    });

    if (!roomUnit || !roomUnit.isActive || !roomUnit.accommodation.isAvailable) {
      throw new NotFoundError('Quarto nao encontrado');
    }

    return this.mapToPublicRoom(roomUnit);
  }

  static async getAvailableByAccommodation(accommodationId: string) {
    return prisma.roomUnit.findMany({
      where: {
        accommodationId,
        isActive: true,
        status: {
          in: ['AVAILABLE', 'INSPECTED'],
        },
        housekeepingStatus: {
          in: ['CLEAN', 'INSPECTED'],
        },
      },
      orderBy: [{ floor: 'asc' }, { code: 'asc' }],
    });
  }

  static async create(data: CreateRoomUnitDto) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: data.accommodationId },
      select: { id: true },
    });

    if (!accommodation) {
      throw new NotFoundError('Acomodacao nao encontrada');
    }

    const existingCode = await prisma.roomUnit.findUnique({
      where: { code: data.code.trim().toUpperCase() },
    });

    if (existingCode) {
      throw new BadRequestError('Ja existe um quarto com este codigo');
    }

    return prisma.roomUnit.create({
      data: {
        accommodationId: data.accommodationId,
        name: data.name.trim(),
        code: data.code.trim().toUpperCase(),
        floor: data.floor,
        notes: data.notes?.trim(),
      },
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  static async update(id: string, data: UpdateRoomUnitDto) {
    const roomUnit = await prisma.roomUnit.findUnique({
      where: { id },
    });

    if (!roomUnit) {
      throw new NotFoundError('Quarto nao encontrado');
    }

    return prisma.roomUnit.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        floor: data.floor,
        status: data.status,
        housekeepingStatus: data.housekeepingStatus,
        isActive: data.isActive,
        notes: data.notes?.trim(),
      },
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  static buildPublicSlug(roomUnit: { name: string; code: string }) {
    return generateSlug(`${roomUnit.name}-${roomUnit.code}`);
  }

  private static mapToPublicRoom(roomUnit: any) {
    return {
      id: roomUnit.id,
      roomUnitId: roomUnit.id,
      legacyAccommodationId: roomUnit.accommodationId,
      code: roomUnit.code,
      name: roomUnit.name,
      slug: this.buildPublicSlug(roomUnit),
      type: roomUnit.accommodation.type,
      capacity: roomUnit.accommodation.capacity,
      pricePerNight: roomUnit.accommodation.pricePerNight,
      description: roomUnit.accommodation.description,
      shortDescription: roomUnit.accommodation.shortDescription,
      images: roomUnit.accommodation.images,
      amenities: roomUnit.accommodation.amenities,
      floor: roomUnit.floor ?? roomUnit.accommodation.floor,
      view: roomUnit.accommodation.view,
      area: roomUnit.accommodation.area,
      checkInTime: roomUnit.accommodation.checkInTime,
      checkOutTime: roomUnit.accommodation.checkOutTime,
      extraBeds: roomUnit.accommodation.extraBeds,
      maxExtraBeds: roomUnit.accommodation.maxExtraBeds,
      extraBedPrice: roomUnit.accommodation.extraBedPrice,
      cancellationPolicy: roomUnit.accommodation.cancellationPolicy,
      metaTitle: roomUnit.accommodation.metaTitle,
      metaDescription: roomUnit.accommodation.metaDescription,
      keywords: roomUnit.accommodation.keywords,
      isAvailable: roomUnit.isActive && roomUnit.accommodation.isAvailable,
      isFeatured: roomUnit.accommodation.isFeatured,
      status: roomUnit.status,
      housekeepingStatus: roomUnit.housekeepingStatus,
      createdAt: roomUnit.createdAt,
      updatedAt: roomUnit.updatedAt,
    };
  }
}
