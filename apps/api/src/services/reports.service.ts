import { HousekeepingTaskStatus, ReservationStatus, StayStatus } from '@prisma/client';
import { startOfMonth } from 'date-fns';
import { prisma } from '../config/database';


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
      quotesMonth,
      convertedQuotesMonth,
      businessAccounts,
      channelSales,
      financeEntries,
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
      prisma.maintenanceOrder.count({
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
      prisma.pOSOrder.aggregate({
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
      prisma.reservationQuote.aggregate({
        where: {
          createdAt: {
            gte: monthStart,
          },
        },
        _count: {
          id: true,
        },
      }),
      prisma.reservationQuote.count({
        where: {
          createdAt: {
            gte: monthStart,
          },
          status: 'CONVERTED',
        },
      }),
      prisma.businessAccount.count({
        where: {
          isActive: true,
        },
      }),
      prisma.reservation.groupBy({
        by: ['source'],
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
        _count: {
          id: true,
        },
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.financialEntry.findMany({
        where: {
          status: {
            in: ['OPEN', 'PARTIALLY_PAID', 'PAID'],
          },
        },
        select: {
          type: true,
          amount: true,
          paidAmount: true,
        },
      }),
    ]);

    const totalRooms = roomUnits.length;
    const occupiedRooms = roomUnits.filter((roomUnit: { status: string }) => roomUnit.status === 'OCCUPIED').length;
    const occupancyRate = totalRooms > 0 ? Number(((occupiedRooms / totalRooms) * 100).toFixed(2)) : 0;
    const daysElapsed = Math.max(1, Math.round((dayStart.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const revparBase = totalRooms * daysElapsed;
    const revpar = revparBase > 0 ? Number((Number(reservationsMonth._sum.totalAmount ?? 0) / revparBase).toFixed(2)) : 0;
    const quoteCountMonth = quotesMonth._count.id;
    const conversionRate = quoteCountMonth > 0 ? Number(((convertedQuotesMonth / quoteCountMonth) * 100).toFixed(2)) : 0;
    const receivablesOpen = financeEntries
      .filter((entry: any) => entry.type === 'RECEIVABLE')
      .reduce((sum: number, entry: any) => sum + Number(entry.amount) - Number(entry.paidAmount ?? 0), 0);
    const payablesOpen = financeEntries
      .filter((entry: any) => entry.type === 'PAYABLE')
      .reduce((sum: number, entry: any) => sum + Number(entry.amount) - Number(entry.paidAmount ?? 0), 0);

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
        receivablesOpen: Number(receivablesOpen.toFixed(2)),
        payablesOpen: Number(payablesOpen.toFixed(2)),
        revpar,
      },
      commercial: {
        quotesMonth: quoteCountMonth,
        conversionRate,
        activeBusinessAccounts: businessAccounts,
        channelSales: channelSales.map((item: any) => ({
          source: item.source,
          reservations: item._count.id,
          revenue: Number(item._sum.totalAmount ?? 0),
        })),
      },
    };
  }
}
