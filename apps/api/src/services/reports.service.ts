import { HousekeepingTaskStatus, ReservationStatus, StayStatus } from '@prisma/client';
import { startOfMonth } from 'date-fns';
import { prisma } from '../config/database';

const prismaPms = prisma as any;

export class ReportsService {
  static async getOperationsSummary(referenceDate?: string) {
    const today = referenceDate ? new Date(`${referenceDate.slice(0, 10)}T00:00:00.000Z`) : new Date();
    const dayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const nextDay = new Date(dayStart);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const monthStart = startOfMonth(dayStart);

    const [
      roomUnits,
      arrivalsToday,
      departuresToday,
      inHouse,
      pendingHousekeeping,
      openMaintenance,
      reservationsMonth,
      outstandingFolios,
      posRevenue,
    ] = await Promise.all([
      prisma.roomUnit.findMany({
        select: {
          status: true,
        },
      }),
      prisma.reservation.count({
        where: {
          status: ReservationStatus.CONFIRMED,
          checkInDate: {
            gte: dayStart,
            lt: nextDay,
          },
        },
      }),
      prisma.stay.count({
        where: {
          status: StayStatus.IN_HOUSE,
          reservation: {
            checkOutDate: {
              gte: dayStart,
              lt: nextDay,
            },
          },
        },
      }),
      prisma.stay.count({
        where: {
          status: StayStatus.IN_HOUSE,
        },
      }),
      prisma.housekeepingTask.count({
        where: {
          status: {
            in: [HousekeepingTaskStatus.PENDING, HousekeepingTaskStatus.IN_PROGRESS],
          },
        },
      }),
      prismaPms.maintenanceOrder.count({
        where: {
          status: {
            in: ['OPEN', 'IN_PROGRESS'],
          },
        },
      }),
      prisma.reservation.aggregate({
        where: {
          createdAt: {
            gte: monthStart,
          },
          status: {
            in: [
              ReservationStatus.CONFIRMED,
              ReservationStatus.CHECKED_IN,
              ReservationStatus.CHECKED_OUT,
              ReservationStatus.COMPLETED,
            ],
          },
        },
        _sum: {
          totalAmount: true,
        },
        _count: {
          id: true,
        },
      }),
      prisma.folio.aggregate({
        where: {
          balance: {
            gt: 0,
          },
        },
        _sum: {
          balance: true,
        },
      }),
      prismaPms.posOrder.aggregate({
        where: {
          createdAt: {
            gte: monthStart,
          },
          status: {
            in: ['DELIVERED', 'CLOSED'],
          },
        },
        _sum: {
          totalAmount: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    const totalRooms = roomUnits.length;
    const occupiedRooms = roomUnits.filter((roomUnit: { status: string }) => roomUnit.status === 'OCCUPIED').length;
    const occupancyRate = totalRooms > 0 ? Number(((occupiedRooms / totalRooms) * 100).toFixed(2)) : 0;

    return {
      referenceDate: dayStart.toISOString().slice(0, 10),
      rooms: {
        total: totalRooms,
        occupied: occupiedRooms,
        occupancyRate,
      },
      frontdesk: {
        arrivalsToday,
        departuresToday,
        inHouse,
      },
      operations: {
        pendingHousekeeping,
        openMaintenance,
      },
      finance: {
        reservationRevenueMonth: Number(reservationsMonth._sum.totalAmount ?? 0),
        reservationCountMonth: reservationsMonth._count.id,
        outstandingFolios: Number(outstandingFolios._sum.balance ?? 0),
        posRevenueMonth: Number(posRevenue._sum.totalAmount ?? 0),
        posOrdersMonth: posRevenue._count.id,
      },
    };
  }
}
