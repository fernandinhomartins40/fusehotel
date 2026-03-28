import { Prisma, ReservationStatus } from '@prisma/client';
import { prisma } from '../config/database';

interface ScheduleQueryParams {
  startDate: string;
  endDate: string;
  accommodationId?: string;
}

interface ScheduleReservation {
  id: string;
  reservationCode: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string | null;
  guestWhatsApp: string;
  status: ReservationStatus;
  paymentStatus: string;
}

interface AccommodationSchedule {
  id: string;
  name: string;
  type: string;
  capacity: number;
  isAvailable: boolean;
  reservations: ScheduleReservation[];
  availability: Array<{
    date: string;
    isAvailable: boolean;
    reservationId?: string;
  }>;
}

const NON_BLOCKING_STATUSES: ReservationStatus[] = [
  ReservationStatus.CANCELLED,
  ReservationStatus.NO_SHOW,
];

type ReservationDateRange = {
  checkInDate: Date | string;
  checkOutDate: Date | string;
};

export class ScheduleService {
  async getSchedule(params: ScheduleQueryParams): Promise<AccommodationSchedule[]> {
    const rangeStart = this.toDateKey(params.startDate);
    const rangeEndInclusive = this.toDateKey(params.endDate);
    const rangeEndExclusive = this.addDays(rangeEndInclusive, 1);

    const accommodations = await prisma.accommodation.findMany({
      where: params.accommodationId ? { id: params.accommodationId } : {},
      include: {
        reservations: {
          where: this.buildReservationCandidateWhere(rangeStart, rangeEndExclusive),
          orderBy: { checkInDate: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return accommodations.map((accommodation) => {
      const reservations = accommodation.reservations
        .filter((reservation) =>
          this.doesReservationOverlapRange(reservation, rangeStart, rangeEndExclusive)
        )
        .map((reservation) => ({
          id: reservation.id,
          reservationCode: reservation.reservationCode,
          checkInDate: reservation.checkInDate.toISOString(),
          checkOutDate: reservation.checkOutDate.toISOString(),
          numberOfNights: reservation.numberOfNights,
          numberOfGuests: reservation.numberOfGuests,
          guestName: reservation.guestName,
          guestEmail: reservation.guestEmail,
          guestPhone: reservation.guestPhone,
          guestWhatsApp: reservation.guestWhatsApp,
          status: reservation.status,
          paymentStatus: reservation.paymentStatus,
        }));

      return {
        id: accommodation.id,
        name: accommodation.name,
        type: accommodation.type,
        capacity: accommodation.capacity,
        isAvailable: accommodation.isAvailable,
        reservations,
        availability: this.generateAvailabilityCalendar(
          rangeStart,
          rangeEndInclusive,
          reservations,
          accommodation.isAvailable
        ),
      };
    });
  }

  async checkAvailability(
    accommodationId: string,
    startDate: string | Date,
    endDate: string | Date,
    excludeReservationId?: string
  ): Promise<boolean> {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
      select: { id: true, isAvailable: true },
    });

    if (!accommodation || !accommodation.isAvailable) {
      return false;
    }

    const rangeStart = this.toDateKey(startDate);
    const rangeEndExclusive = this.toDateKey(endDate);

    if (rangeEndExclusive <= rangeStart) {
      return false;
    }

    const candidateReservations = await prisma.reservation.findMany({
      where: this.buildReservationCandidateWhere(rangeStart, rangeEndExclusive, {
        accommodationId,
        excludeReservationId,
      }),
      select: {
        id: true,
        checkInDate: true,
        checkOutDate: true,
      },
    });

    return !candidateReservations.some((reservation) =>
      this.doesReservationOverlapRange(reservation, rangeStart, rangeEndExclusive)
    );
  }

  async getScheduleStats(startDate: string, endDate: string) {
    const rangeStart = this.toDateKey(startDate);
    const rangeEndInclusive = this.toDateKey(endDate);
    const rangeEndExclusive = this.addDays(rangeEndInclusive, 1);

    const [accommodations, candidateReservations] = await Promise.all([
      prisma.accommodation.findMany({
        select: {
          id: true,
          isAvailable: true,
        },
      }),
      prisma.reservation.findMany({
        where: this.buildReservationCandidateWhere(rangeStart, rangeEndExclusive),
        select: {
          accommodationId: true,
          checkInDate: true,
          checkOutDate: true,
          status: true,
        },
      }),
    ]);

    const reservations = candidateReservations.filter((reservation) =>
      this.doesReservationOverlapRange(reservation, rangeStart, rangeEndExclusive)
    );

    const totalAccommodations = accommodations.length;
    const activeReservations = reservations.filter(
      (reservation) => reservation.status === ReservationStatus.CHECKED_IN
    ).length;
    const availableAccommodations = accommodations.filter(
      (accommodation) =>
        accommodation.isAvailable &&
        !reservations.some(
          (reservation) => reservation.accommodationId === accommodation.id
        )
    ).length;

    const totalDays = this.getDateRangeLength(rangeStart, rangeEndExclusive);
    const availableInventory = accommodations.filter((accommodation) => accommodation.isAvailable)
      .length;

    const totalOccupiedNights = reservations.reduce((occupiedNights, reservation) => {
      const effectiveStart = this.maxDateKey(
        rangeStart,
        this.toDateKey(reservation.checkInDate)
      );
      const effectiveEnd = this.minDateKey(
        rangeEndExclusive,
        this.toDateKey(reservation.checkOutDate)
      );

      return occupiedNights + this.getDateRangeLength(effectiveStart, effectiveEnd);
    }, 0);

    const totalPossibleRoomNights = availableInventory * totalDays;
    const occupancyRate =
      totalPossibleRoomNights > 0
        ? (totalOccupiedNights / totalPossibleRoomNights) * 100
        : 0;

    return {
      totalAccommodations,
      totalReservations: reservations.length,
      activeReservations,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      availableAccommodations,
    };
  }

  private buildReservationCandidateWhere(
    rangeStart: string,
    rangeEndExclusive: string,
    options: {
      accommodationId?: string;
      excludeReservationId?: string;
    } = {}
  ): Prisma.ReservationWhereInput {
    return {
      ...(options.accommodationId ? { accommodationId: options.accommodationId } : {}),
      ...(options.excludeReservationId
        ? { id: { not: options.excludeReservationId } }
        : {}),
      status: {
        notIn: NON_BLOCKING_STATUSES,
      },
      checkInDate: {
        lt: this.toDateBoundary(rangeEndExclusive),
      },
      checkOutDate: {
        gt: this.toDateBoundary(rangeStart),
      },
    };
  }

  private generateAvailabilityCalendar(
    rangeStart: string,
    rangeEndInclusive: string,
    reservations: Array<{ id: string; checkInDate: string; checkOutDate: string }>,
    accommodationIsAvailable: boolean
  ): Array<{ date: string; isAvailable: boolean; reservationId?: string }> {
    const availability: Array<{
      date: string;
      isAvailable: boolean;
      reservationId?: string;
    }> = [];

    let currentDate = rangeStart;
    const rangeEndExclusive = this.addDays(rangeEndInclusive, 1);

    while (currentDate < rangeEndExclusive) {
      const occupyingReservation = reservations.find((reservation) =>
        this.doesReservationOccupyDate(reservation, currentDate)
      );

      availability.push({
        date: currentDate,
        isAvailable: accommodationIsAvailable && !occupyingReservation,
        reservationId: occupyingReservation?.id,
      });

      currentDate = this.addDays(currentDate, 1);
    }

    return availability;
  }

  private doesReservationOccupyDate(
    reservation: ReservationDateRange,
    dateKey: string
  ) {
    const checkInDate = this.toDateKey(reservation.checkInDate);
    const checkOutDate = this.toDateKey(reservation.checkOutDate);

    return checkInDate <= dateKey && checkOutDate > dateKey;
  }

  private doesReservationOverlapRange(
    reservation: ReservationDateRange,
    rangeStart: string,
    rangeEndExclusive: string
  ) {
    const checkInDate = this.toDateKey(reservation.checkInDate);
    const checkOutDate = this.toDateKey(reservation.checkOutDate);

    return checkInDate < rangeEndExclusive && checkOutDate > rangeStart;
  }

  private toDateKey(value: string | Date) {
    if (typeof value === 'string') {
      return value.slice(0, 10);
    }

    return value.toISOString().slice(0, 10);
  }

  private toDateBoundary(dateKey: string) {
    return new Date(`${dateKey}T00:00:00.000Z`);
  }

  private addDays(dateKey: string, days: number) {
    const date = this.toDateBoundary(dateKey);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  private getDateRangeLength(startDateKey: string, endDateKey: string) {
    const start = this.toDateBoundary(startDateKey);
    const end = this.toDateBoundary(endDateKey);

    return Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );
  }

  private minDateKey(firstDateKey: string, secondDateKey: string) {
    return firstDateKey <= secondDateKey ? firstDateKey : secondDateKey;
  }

  private maxDateKey(firstDateKey: string, secondDateKey: string) {
    return firstDateKey >= secondDateKey ? firstDateKey : secondDateKey;
  }
}

export const scheduleService = new ScheduleService();
