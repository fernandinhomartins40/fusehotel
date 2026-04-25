import { HousekeepingTaskStatus, HousekeepingStatus, RoomUnitStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class HousekeepingService {
  static async listTasks() {
    return prisma.housekeepingTask.findMany({
      include: {
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
            floor: true,
            status: true,
            housekeepingStatus: true,
          },
        },
        reservation: {
          select: {
            reservationCode: true,
            guestName: true,
          },
        },
        stay: {
          select: {
            id: true,
            status: true,
          },
        },
        assignedTo: true,
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async updateStatus(id: string, status: HousekeepingTaskStatus, assignedToId?: string) {
    const task = await prisma.housekeepingTask.findUnique({
      where: { id },
      include: {
        roomUnit: true,
      },
    });

    if (!task) {
      throw new NotFoundError('Tarefa de governanca nao encontrada');
    }

    const updatedTask = await prisma.$transaction(async (tx) => {
      const nextTimestamps: Record<string, Date | null> = {};
      const roomUnitUpdate: Record<string, string> = {};

      if (status === HousekeepingTaskStatus.IN_PROGRESS) {
        nextTimestamps.startedAt = new Date();
        roomUnitUpdate.status = RoomUnitStatus.CLEANING;
        roomUnitUpdate.housekeepingStatus = HousekeepingStatus.IN_PROGRESS;
      }

      if (status === HousekeepingTaskStatus.COMPLETED) {
        nextTimestamps.completedAt = new Date();
        roomUnitUpdate.status = RoomUnitStatus.INSPECTED;
        roomUnitUpdate.housekeepingStatus = HousekeepingStatus.INSPECTED;
      }

      if (status === HousekeepingTaskStatus.INSPECTED) {
        nextTimestamps.inspectedAt = new Date();
        roomUnitUpdate.status = RoomUnitStatus.AVAILABLE;
        roomUnitUpdate.housekeepingStatus = HousekeepingStatus.CLEAN;
      }

      if (Object.keys(roomUnitUpdate).length > 0) {
        await tx.roomUnit.update({
          where: { id: task.roomUnitId },
          data: roomUnitUpdate,
        });
      }

      return tx.housekeepingTask.update({
        where: { id },
        data: {
          status,
          assignedToId,
          ...nextTimestamps,
        },
        include: {
          roomUnit: {
            select: {
              id: true,
              code: true,
              name: true,
              floor: true,
              status: true,
              housekeepingStatus: true,
            },
          },
          reservation: {
            select: {
              reservationCode: true,
              guestName: true,
            },
          },
          stay: {
            select: {
              id: true,
              status: true,
            },
          },
          assignedTo: true,
        },
      });
    });

    return updatedTask;
  }

  static async listStaff() {
    const prismaPms = prisma as any;

    return prismaPms.housekeepingStaff.findMany({
      include: {
        tasks: {
          where: {
            status: {
              in: ['PENDING', 'IN_PROGRESS'],
            },
          },
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });
  }

  static async createStaff(data: any) {
    const prismaPms = prisma as any;

    return prismaPms.housekeepingStaff.create({
      data: {
        name: data.name.trim(),
        phone: data.phone?.trim(),
        role: data.role?.trim(),
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateStaff(id: string, data: any) {
    const prismaPms = prisma as any;
    const staff = await prismaPms.housekeepingStaff.findUnique({ where: { id } });

    if (!staff) {
      throw new NotFoundError('Profissional da governança não encontrado');
    }

    return prismaPms.housekeepingStaff.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        phone: data.phone?.trim(),
        role: data.role?.trim(),
        isActive: data.isActive,
      },
    });
  }

  static async listLostFound() {
    const prismaPms = prisma as any;

    return prismaPms.lostFoundItem.findMany({
      include: {
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        stay: {
          select: {
            id: true,
            status: true,
            reservation: {
              select: {
                reservationCode: true,
                guestName: true,
              },
            },
          },
        },
      },
      orderBy: [{ status: 'asc' }, { foundAt: 'desc' }],
    });
  }

  static async createLostFound(data: any) {
    const prismaPms = prisma as any;

    return prismaPms.lostFoundItem.create({
      data: {
        roomUnitId: data.roomUnitId,
        stayId: data.stayId,
        title: data.title.trim(),
        description: data.description?.trim(),
        foundBy: data.foundBy?.trim(),
        storedLocation: data.storedLocation?.trim(),
      },
      include: {
        roomUnit: true,
        stay: {
          include: {
            reservation: {
              select: {
                reservationCode: true,
                guestName: true,
              },
            },
          },
        },
      },
    });
  }

  static async updateLostFound(id: string, data: any) {
    const prismaPms = prisma as any;
    const item = await prismaPms.lostFoundItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError('Item de achados e perdidos não encontrado');
    }

    return prismaPms.lostFoundItem.update({
      where: { id },
      data: {
        title: data.title?.trim(),
        description: data.description?.trim(),
        foundBy: data.foundBy?.trim(),
        storedLocation: data.storedLocation?.trim(),
        status: data.status,
        claimedBy: data.claimedBy?.trim(),
        claimedAt: data.status === 'RETURNED' ? new Date() : data.claimedAt,
      },
      include: {
        roomUnit: true,
        stay: {
          include: {
            reservation: {
              select: {
                reservationCode: true,
                guestName: true,
              },
            },
          },
        },
      },
    });
  }
}
