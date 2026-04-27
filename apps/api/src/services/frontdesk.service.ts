import { Prisma, ReservationStatus, RoomUnitStatus, HousekeepingStatus, StayStatus } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { FoliosService } from './folios.service';
import { CheckInDto, CheckOutDto, WalkInCheckInDto } from '../types/pms';
import { scheduleService } from './schedule.service';

export class FrontdeskService {
  private static async ensureRoomReady(tx: Prisma.TransactionClient, roomUnitId: string) {
    const roomUnit = await tx.roomUnit.findUnique({
      where: { id: roomUnitId },
    });

    if (!roomUnit || !roomUnit.isActive) {
      throw new NotFoundError('Quarto nao encontrado');
    }

    const roomUnitReady =
      (roomUnit.status === RoomUnitStatus.AVAILABLE || roomUnit.status === RoomUnitStatus.INSPECTED) &&
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

    return roomUnit;
  }

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

      const roomUnit = await this.ensureRoomReady(tx, data.roomUnitId);

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

  static async walkIn(data: WalkInCheckInDto) {
    const checkInDate = new Date(data.checkInDate);
    const checkOutDate = new Date(data.checkOutDate);
    const numberOfNights = differenceInDays(checkOutDate, checkInDate);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      throw new BadRequestError('Datas do walk-in invalidas');
    }

    if (numberOfNights <= 0) {
      throw new BadRequestError('Data de check-out deve ser posterior ao check-in');
    }

    return prisma.$transaction(async (tx) => {
      const roomUnit = await this.ensureRoomReady(tx, data.roomUnitId);

      const accommodation = await tx.accommodation.findUnique({
        where: { id: roomUnit.accommodationId },
      });

      if (!accommodation || !accommodation.isAvailable) {
        throw new BadRequestError('Acomodacao nao disponivel para walk-in');
      }

      const isAvailableForStay = await scheduleService.checkAvailability(
        accommodation.id,
        checkInDate.toISOString(),
        checkOutDate.toISOString()
      );

      if (!isAvailableForStay) {
        throw new BadRequestError('Nao ha disponibilidade comercial para este periodo');
      }

      const customer = data.customerId
        ? await tx.user.findUnique({
            where: { id: data.customerId },
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              whatsapp: true,
              cpf: true,
            },
          })
        : null;

      if (data.customerId && !customer) {
        throw new NotFoundError('Cliente nao encontrado');
      }

      const guestName = data.guestName?.trim() || customer?.name;
      const guestEmail = data.guestEmail?.trim().toLowerCase() || customer?.email || undefined;
      const guestPhone = data.guestPhone?.trim() || customer?.phone || undefined;
      const guestWhatsApp = data.guestWhatsApp?.replace(/\D/g, '') || customer?.whatsapp || guestPhone || '';
      const guestCpf = data.guestCpf?.trim() || customer?.cpf || undefined;

      if (!guestName) {
        throw new BadRequestError('Nome do hospede obrigatorio para walk-in');
      }

      if (!guestWhatsApp) {
        throw new BadRequestError('WhatsApp ou telefone obrigatorio para walk-in');
      }

      const subtotal = Number(accommodation.pricePerNight) * numberOfNights;
      const serviceFee = subtotal * 0.05;
      const taxes = subtotal * 0.02;
      const totalAmount = Math.max(subtotal + serviceFee + taxes, 0);

      const reservation = await tx.reservation.create({
        data: {
          reservationCode: `FH-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`,
          accommodationId: accommodation.id,
          userId: customer?.id,
          checkInDate,
          checkOutDate,
          numberOfNights,
          numberOfGuests: data.adults,
          numberOfExtraBeds: 0,
          guestName,
          guestEmail,
          guestPhone,
          guestWhatsApp,
          guestCpf,
          pricePerNight: accommodation.pricePerNight,
          subtotal,
          extraBedsCost: 0,
          serviceFee,
          taxes,
          discount: 0,
          totalAmount,
          source: 'WALK_IN',
          status: ReservationStatus.CHECKED_IN,
          checkedInAt: new Date(),
          specialRequests: data.notes?.trim() || undefined,
        },
      });

      const stay = await tx.stay.create({
        data: {
          reservationId: reservation.id,
          roomUnitId: roomUnit.id,
          status: StayStatus.IN_HOUSE,
          adults: data.adults,
          children: data.children ?? 0,
          notes: data.notes?.trim(),
          expectedCheckInAt: checkInDate,
          expectedCheckOutAt: checkOutDate,
          actualCheckInAt: new Date(),
          guests: {
            create: {
              userId: customer?.id,
              name: guestName,
              email: guestEmail,
              phone: guestPhone ?? guestWhatsApp,
              cpf: guestCpf,
              isPrimary: true,
            },
          },
        },
      });

      await FoliosService.seedFromReservation(stay.id, tx);

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
