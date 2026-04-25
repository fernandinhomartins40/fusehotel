import { Prisma, ReservationStatus, RoomUnitStatus, HousekeepingStatus, StayStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { FoliosService } from './folios.service';
import { CheckInDto, CheckOutDto } from '../types/pms';

export class FrontdeskService {
  static async getDashboard(referenceDate?: string) {
    const dateKey = referenceDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
    const dayStart = new Date(`${dateKey}T00:00:00.000Z`);
    const nextDay = new Date(dayStart);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const [arrivals, inHouse, departures, roomUnits] = await Promise.all([
      prisma.reservation.findMany({
        where: {
          status: ReservationStatus.CONFIRMED,
          checkInDate: {
            gte: dayStart,
            lt: nextDay,
          },
          stay: null,
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
        orderBy: { checkInDate: 'asc' },
      }),
      prisma.stay.findMany({
        where: {
          status: StayStatus.IN_HOUSE,
        },
        include: {
          reservation: {
            select: {
              id: true,
              reservationCode: true,
              guestName: true,
              checkInDate: true,
              checkOutDate: true,
            },
          },
          roomUnit: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          folio: {
            select: {
              balance: true,
            },
          },
        },
        orderBy: { actualCheckInAt: 'asc' },
      }),
      prisma.stay.findMany({
        where: {
          status: StayStatus.IN_HOUSE,
          reservation: {
            checkOutDate: {
              gte: dayStart,
              lt: nextDay,
            },
          },
        },
        include: {
          reservation: {
            select: {
              id: true,
              reservationCode: true,
              guestName: true,
              checkOutDate: true,
            },
          },
          roomUnit: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          folio: {
            select: {
              balance: true,
            },
          },
        },
        orderBy: { reservation: { checkOutDate: 'asc' } },
      }),
      prisma.roomUnit.findMany({
        select: {
          id: true,
          status: true,
          housekeepingStatus: true,
        },
      }),
    ]);

    return {
      referenceDate: dateKey,
      arrivals,
      inHouse,
      departures,
      roomStats: {
        total: roomUnits.length,
        available: roomUnits.filter((room) => room.status === RoomUnitStatus.AVAILABLE).length,
        occupied: roomUnits.filter((room) => room.status === RoomUnitStatus.OCCUPIED).length,
        dirty: roomUnits.filter((room) => room.housekeepingStatus === HousekeepingStatus.DIRTY).length,
        cleaning: roomUnits.filter((room) => room.housekeepingStatus === HousekeepingStatus.IN_PROGRESS).length,
        outOfOrder: roomUnits.filter(
          (room) =>
            room.status === RoomUnitStatus.OUT_OF_ORDER ||
            room.status === RoomUnitStatus.OUT_OF_SERVICE ||
            room.status === RoomUnitStatus.BLOCKED
        ).length,
      },
    };
  }

  static async listStays() {
    return prisma.stay.findMany({
      include: {
        reservation: {
          include: {
            accommodation: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
        roomUnit: true,
        folio: {
          select: {
            id: true,
            balance: true,
            isClosed: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  static async checkIn(data: CheckInDto) {
    return prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: data.reservationId },
        include: {
          stay: true,
        },
      });

      if (!reservation) {
        throw new NotFoundError('Reserva nao encontrada');
      }

      if (reservation.status !== ReservationStatus.CONFIRMED) {
        throw new BadRequestError('Apenas reservas confirmadas podem fazer check-in');
      }

      if (reservation.stay && reservation.stay.status === StayStatus.IN_HOUSE) {
        throw new BadRequestError('Esta reserva ja esta em hospedagem ativa');
      }

      const roomUnit = await tx.roomUnit.findUnique({
        where: { id: data.roomUnitId },
      });

      if (!roomUnit || !roomUnit.isActive) {
        throw new NotFoundError('Quarto nao encontrado');
      }

      const roomUnitReady =
        (roomUnit.status === RoomUnitStatus.AVAILABLE ||
          roomUnit.status === RoomUnitStatus.INSPECTED) &&
        (roomUnit.housekeepingStatus === HousekeepingStatus.CLEAN ||
          roomUnit.housekeepingStatus === HousekeepingStatus.INSPECTED);

      if (!roomUnitReady) {
        throw new BadRequestError('Quarto nao esta liberado para check-in');
      }

      const activeStayOnRoom = await tx.stay.findFirst({
        where: {
          roomUnitId: roomUnit.id,
          status: StayStatus.IN_HOUSE,
        },
      });

      if (activeStayOnRoom) {
        throw new BadRequestError('Ja existe uma hospedagem ativa neste quarto');
      }

      const stay = reservation.stay
        ? await tx.stay.update({
            where: { id: reservation.stay.id },
            data: {
              roomUnitId: roomUnit.id,
              status: StayStatus.IN_HOUSE,
              notes: data.notes,
              expectedCheckInAt: reservation.checkInDate,
              expectedCheckOutAt: reservation.checkOutDate,
              actualCheckInAt: new Date(),
            },
          })
        : await tx.stay.create({
            data: {
              reservationId: reservation.id,
              roomUnitId: roomUnit.id,
              status: StayStatus.IN_HOUSE,
              adults: reservation.numberOfGuests,
              notes: data.notes,
              expectedCheckInAt: reservation.checkInDate,
              expectedCheckOutAt: reservation.checkOutDate,
              actualCheckInAt: new Date(),
              guests: {
                create: {
                  userId: reservation.userId,
                  name: reservation.guestName,
                  email: reservation.guestEmail,
                  phone: reservation.guestPhone ?? reservation.guestWhatsApp,
                  cpf: reservation.guestCpf,
                  isPrimary: true,
                },
              },
            },
          });

      const existingFolio = await tx.folio.findUnique({
        where: { stayId: stay.id },
      });

      if (!existingFolio) {
        await FoliosService.seedFromReservation(stay.id, tx);
      }

      await tx.reservation.update({
        where: { id: reservation.id },
        data: {
          status: ReservationStatus.CHECKED_IN,
          checkedInAt: new Date(),
        },
      });

      await tx.roomUnit.update({
        where: { id: roomUnit.id },
        data: {
          status: RoomUnitStatus.OCCUPIED,
          housekeepingStatus: HousekeepingStatus.CLEAN,
        },
      });

      return tx.stay.findUnique({
        where: { id: stay.id },
        include: {
          reservation: {
            include: {
              accommodation: true,
            },
          },
          roomUnit: true,
          folio: {
            include: {
              entries: {
                orderBy: { postedAt: 'desc' },
              },
            },
          },
        },
      });
    });
  }

  static async checkOut(data: CheckOutDto) {
    return prisma.$transaction(async (tx) => {
      const stay = await tx.stay.findUnique({
        where: { id: data.stayId },
        include: {
          reservation: true,
          roomUnit: true,
          folio: true,
        },
      });

      if (!stay) {
        throw new NotFoundError('Hospedagem nao encontrada');
      }

      if (stay.status !== StayStatus.IN_HOUSE) {
        throw new BadRequestError('Somente hospedagens ativas podem fazer check-out');
      }

      if (!stay.folio) {
        throw new BadRequestError('Hospedagem sem folio financeiro');
      }

      await FoliosService.ensureSettled(stay.folio.id, tx);

      await tx.stay.update({
        where: { id: stay.id },
        data: {
          status: StayStatus.CHECKED_OUT,
          actualCheckOutAt: new Date(),
          notes: data.notes ?? stay.notes ?? undefined,
        },
      });

      await tx.reservation.update({
        where: { id: stay.reservationId },
        data: {
          status: ReservationStatus.CHECKED_OUT,
          checkedOutAt: new Date(),
        },
      });

      if (stay.roomUnitId) {
        await tx.roomUnit.update({
          where: { id: stay.roomUnitId },
          data: {
            status: RoomUnitStatus.DIRTY,
            housekeepingStatus: HousekeepingStatus.DIRTY,
          },
        });

        await tx.housekeepingTask.create({
          data: {
            roomUnitId: stay.roomUnitId,
            stayId: stay.id,
            reservationId: stay.reservationId,
            status: 'PENDING',
            priority: 'HIGH',
            title: 'Limpeza pos check-out',
            notes: data.notes,
            scheduledFor: new Date(),
          },
        });
      }

      await tx.folio.update({
        where: { id: stay.folio.id },
        data: {
          isClosed: true,
          closedAt: new Date(),
        },
      });

      return tx.stay.findUnique({
        where: { id: stay.id },
        include: {
          reservation: true,
          roomUnit: true,
          folio: true,
        },
      });
    });
  }
}
