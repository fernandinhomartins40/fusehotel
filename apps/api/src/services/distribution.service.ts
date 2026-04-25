import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';

const prismaPms = prisma as any;

function normalizeDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

export class DistributionService {
  static async listRatePlans() {
    return prismaPms.ratePlan.findMany({
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
            pricePerNight: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });
  }

  static async createRatePlan(data: any) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: data.accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundError('Acomodação não encontrada');
    }

    return prismaPms.ratePlan.create({
      data: {
        accommodationId: data.accommodationId,
        name: data.name.trim(),
        basePrice: data.basePrice,
        markupType: data.markupType ?? 'FIXED',
        markupValue: data.markupValue ?? 0,
        minStay: data.minStay ?? 1,
        maxStay: data.maxStay,
        allotment: data.allotment,
        closedToArrival: data.closedToArrival ?? false,
        closedToDeparture: data.closedToDeparture ?? false,
        isActive: data.isActive ?? true,
        salesChannel: data.salesChannel?.trim() || null,
        startsAt: data.startsAt ? normalizeDate(data.startsAt) : null,
        endsAt: data.endsAt ? normalizeDate(data.endsAt) : null,
      },
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
            pricePerNight: true,
          },
        },
      },
    });
  }

  static async updateRatePlan(id: string, data: any) {
    const existing = await prismaPms.ratePlan.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundError('Tarifa não encontrada');
    }

    return prismaPms.ratePlan.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        basePrice: data.basePrice,
        markupType: data.markupType,
        markupValue: data.markupValue,
        minStay: data.minStay,
        maxStay: data.maxStay,
        allotment: data.allotment,
        closedToArrival: data.closedToArrival,
        closedToDeparture: data.closedToDeparture,
        isActive: data.isActive,
        salesChannel: data.salesChannel?.trim(),
        startsAt: data.startsAt ? normalizeDate(data.startsAt) : data.startsAt,
        endsAt: data.endsAt ? normalizeDate(data.endsAt) : data.endsAt,
      },
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
            pricePerNight: true,
          },
        },
      },
    });
  }

  static async listInventoryBlocks() {
    return prismaPms.inventoryBlock.findMany({
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
          },
        },
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: [{ startsAt: 'asc' }, { createdAt: 'desc' }],
    });
  }

  static async createInventoryBlock(data: any) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: data.accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundError('Acomodação não encontrada');
    }

    if (new Date(data.endsAt) <= new Date(data.startsAt)) {
      throw new BadRequestError('O período do bloqueio é inválido');
    }

    if (data.roomUnitId) {
      const roomUnit = await prisma.roomUnit.findUnique({
        where: { id: data.roomUnitId },
      });

      if (!roomUnit) {
        throw new NotFoundError('Quarto não encontrado');
      }
    }

    return prismaPms.inventoryBlock.create({
      data: {
        accommodationId: data.accommodationId,
        roomUnitId: data.roomUnitId,
        title: data.title.trim(),
        reason: data.reason?.trim(),
        startsAt: normalizeDate(data.startsAt),
        endsAt: normalizeDate(data.endsAt),
        stopSell: data.stopSell ?? true,
        allotment: data.allotment,
        salesChannel: data.salesChannel?.trim(),
      },
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
          },
        },
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });
  }

  static async updateInventoryBlock(id: string, data: any) {
    const block = await prismaPms.inventoryBlock.findUnique({ where: { id } });

    if (!block) {
      throw new NotFoundError('Bloqueio não encontrado');
    }

    return prismaPms.inventoryBlock.update({
      where: { id },
      data: {
        title: data.title?.trim(),
        reason: data.reason?.trim(),
        startsAt: data.startsAt ? normalizeDate(data.startsAt) : undefined,
        endsAt: data.endsAt ? normalizeDate(data.endsAt) : undefined,
        stopSell: data.stopSell,
        allotment: data.allotment,
        salesChannel: data.salesChannel?.trim(),
      },
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
          },
        },
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });
  }

  static async listChannels() {
    return prismaPms.channelConnection.findMany({
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });
  }

  static async createChannel(data: any) {
    return prismaPms.channelConnection.create({
      data: {
        name: data.name.trim(),
        type: data.type,
        isActive: data.isActive ?? false,
        syncEnabled: data.syncEnabled ?? false,
        externalCode: data.externalCode?.trim(),
        notes: data.notes?.trim(),
      },
    });
  }

  static async updateChannel(id: string, data: any) {
    const channel = await prismaPms.channelConnection.findUnique({ where: { id } });

    if (!channel) {
      throw new NotFoundError('Canal não encontrado');
    }

    return prismaPms.channelConnection.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        type: data.type,
        isActive: data.isActive,
        syncEnabled: data.syncEnabled,
        externalCode: data.externalCode?.trim(),
        notes: data.notes?.trim(),
        lastSyncedAt: data.markSynced ? new Date() : undefined,
      },
    });
  }
}
