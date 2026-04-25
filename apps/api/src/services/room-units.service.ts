import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { CreateRoomUnitDto, UpdateRoomUnitDto } from '../types/pms';

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
}
