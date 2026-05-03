import {
  HousekeepingStatus,
  RoomUnitStatus,
} from '@prisma/client';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import {
  CreateMaintenanceOrderDto,
  UpdateMaintenanceOrderDto,
} from '../types/pms';
import { RoomServiceService } from './room-service.service';

const prismaPms = prisma as any;

export class MaintenanceService {
  static async list() {
    return prismaPms.maintenanceOrder.findMany({
      include: {
        roomUnit: {
          include: {
            accommodation: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async create(data: CreateMaintenanceOrderDto) {
    const roomUnit = await prisma.roomUnit.findUnique({
      where: { id: data.roomUnitId },
    });

    if (!roomUnit) {
      throw new NotFoundError('Quarto nao encontrado');
    }

    const activeDndStay = await RoomServiceService.getActiveDoNotDisturbStayForRoom(data.roomUnitId);

    if (activeDndStay) {
      throw new BadRequestError(
        `Quarto em não perturbe para ${activeDndStay.reservation.guestName}. A manutenção está bloqueada.`
      );
    }

    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;

      if (data.markRoomOutOfOrder) {
        await tx.roomUnit.update({
          where: { id: roomUnit.id },
          data: {
            status: RoomUnitStatus.OUT_OF_ORDER,
          },
        });

        // Auto-create InventoryBlock to reflect in schedule/availability
        await txPms.inventoryBlock.create({
          data: {
            accommodationId: roomUnit.accommodationId,
            roomUnitId: roomUnit.id,
            title: `Manutenção: ${data.title.trim()}`,
            reason: 'OUT_OF_ORDER',
            startsAt: new Date(),
            endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year ahead, closed on completion
            stopSell: true,
          },
        });
      }

      return txPms.maintenanceOrder.create({
        data: {
          roomUnitId: data.roomUnitId,
          title: data.title.trim(),
          description: data.description?.trim(),
          priority: data.priority ?? 'MEDIUM',
          notes: data.notes?.trim(),
          estimatedCost: data.estimatedCost,
        },
        include: {
          roomUnit: {
            include: {
              accommodation: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });
  }

  static async update(id: string, data: UpdateMaintenanceOrderDto) {
    const order = await prismaPms.maintenanceOrder.findUnique({
      where: { id },
      include: {
        roomUnit: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Ordem de manutencao nao encontrada');
    }

    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      const timestamps: Record<string, Date> = {};

      if (data.status === 'IN_PROGRESS') {
        const activeDndStay = await RoomServiceService.getActiveDoNotDisturbStayForRoom(order.roomUnitId);

        if (activeDndStay) {
          throw new BadRequestError(
            `Quarto em não perturbe para ${activeDndStay.reservation.guestName}. A manutenção está bloqueada.`
          );
        }
      }

      if (
        data.status === 'IN_PROGRESS' &&
        order.status === 'OPEN'
      ) {
        timestamps.startedAt = new Date();
      }

      if (data.status === 'COMPLETED') {
        timestamps.completedAt = new Date();
      }

      const updated = await txPms.maintenanceOrder.update({
        where: { id },
        data: {
          status: data.status,
          priority: data.priority,
          notes: data.notes?.trim(),
          actualCost: data.actualCost,
          ...timestamps,
        },
        include: {
          roomUnit: {
            include: {
              accommodation: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (data.status === 'COMPLETED') {
        const activeStay = await tx.stay.findFirst({
          where: {
            roomUnitId: order.roomUnitId,
            status: 'IN_HOUSE',
          },
        });

        await tx.roomUnit.update({
          where: { id: order.roomUnitId },
          data: {
            status: activeStay ? RoomUnitStatus.OCCUPIED : RoomUnitStatus.AVAILABLE,
            housekeepingStatus: activeStay
              ? order.roomUnit.housekeepingStatus
              : order.roomUnit.housekeepingStatus === HousekeepingStatus.DIRTY
                ? HousekeepingStatus.DIRTY
                : HousekeepingStatus.INSPECTED,
          },
        });

        // Remove InventoryBlocks created for this room's OUT_OF_ORDER maintenance
        await txPms.inventoryBlock.deleteMany({
          where: {
            roomUnitId: order.roomUnitId,
            reason: 'OUT_OF_ORDER',
          },
        });
      }

      return updated;
    });
  }
}
