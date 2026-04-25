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
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async updateStatus(id: string, status: HousekeepingTaskStatus) {
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
        },
      });
    });

    return updatedTask;
  }
}
