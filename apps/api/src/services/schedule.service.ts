import { PrismaClient, ReservationStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface ScheduleQueryParams {
  startDate: string;
  endDate: string;
  accommodationId?: string;
}

interface AccommodationSchedule {
  id: string;
  name: string;
  type: string;
  capacity: number;
  reservations: Array<{
    id: string;
    reservationCode: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfNights: number;
    numberOfGuests: number;
    guestName: string;
    guestPhone: string | null;
    guestWhatsApp: string;
    status: ReservationStatus;
    paymentStatus: string;
  }>;
  availability: Array<{
    date: string;
    isAvailable: boolean;
    reservationId?: string;
  }>;
}

export class ScheduleService {
  /**
   * Get schedule overview for all accommodations or specific accommodation
   */
  async getSchedule(params: ScheduleQueryParams): Promise<AccommodationSchedule[]> {
    const { startDate, endDate, accommodationId } = params;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get accommodations
    const accommodations = await prisma.accommodation.findMany({
      where: accommodationId ? { id: accommodationId } : { isAvailable: true },
      include: {
        reservations: {
          where: {
            AND: [
              {
                OR: [
                  {
                    // Reservation starts within date range
                    checkInDate: {
                      gte: start,
                      lte: end,
                    },
                  },
                  {
                    // Reservation ends within date range
                    checkOutDate: {
                      gte: start,
                      lte: end,
                    },
                  },
                  {
                    // Reservation spans entire date range
                    AND: [
                      { checkInDate: { lte: start } },
                      { checkOutDate: { gte: end } },
                    ],
                  },
                ],
              },
              {
                status: {
                  notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW],
                },
              },
            ],
          },
          orderBy: {
            checkInDate: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Build schedule for each accommodation
    const schedules: AccommodationSchedule[] = accommodations.map((accommodation) => {
      // Generate availability calendar
      const availability = this.generateAvailabilityCalendar(
        start,
        end,
        accommodation.reservations
      );

      return {
        id: accommodation.id,
        name: accommodation.name,
        type: accommodation.type,
        capacity: accommodation.capacity,
        reservations: accommodation.reservations.map((reservation) => ({
          id: reservation.id,
          reservationCode: reservation.reservationCode,
          checkInDate: reservation.checkInDate.toISOString(),
          checkOutDate: reservation.checkOutDate.toISOString(),
          numberOfNights: reservation.numberOfNights,
          numberOfGuests: reservation.numberOfGuests,
          guestName: reservation.guestName,
          guestPhone: reservation.guestPhone,
          guestWhatsApp: reservation.guestWhatsApp,
          status: reservation.status,
          paymentStatus: reservation.paymentStatus,
        })),
        availability,
      };
    });

    return schedules;
  }

  /**
   * Generate daily availability calendar for an accommodation
   */
  private generateAvailabilityCalendar(
    startDate: Date,
    endDate: Date,
    reservations: any[]
  ): Array<{ date: string; isAvailable: boolean; reservationId?: string }> {
    const calendar: Array<{
      date: string;
      isAvailable: boolean;
      reservationId?: string;
    }> = [];

    // Create date array
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];

      // Check if this date is occupied by any reservation
      const occupyingReservation = reservations.find((reservation) => {
        const checkIn = new Date(reservation.checkInDate);
        const checkOut = new Date(reservation.checkOutDate);
        const current = new Date(dateStr);

        // Date is occupied if it's between check-in (inclusive) and check-out (exclusive)
        return current >= checkIn && current < checkOut;
      });

      calendar.push({
        date: dateStr,
        isAvailable: !occupyingReservation,
        reservationId: occupyingReservation?.id,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  }

  /**
   * Get accommodation availability for specific date range
   */
  async checkAvailability(
    accommodationId: string,
    startDate: string,
    endDate: string
  ): Promise<boolean> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const conflictingReservations = await prisma.reservation.count({
      where: {
        accommodationId,
        status: {
          notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW],
        },
        OR: [
          {
            // New reservation starts during existing reservation
            AND: [
              { checkInDate: { lte: start } },
              { checkOutDate: { gt: start } },
            ],
          },
          {
            // New reservation ends during existing reservation
            AND: [
              { checkInDate: { lt: end } },
              { checkOutDate: { gte: end } },
            ],
          },
          {
            // New reservation completely contains existing reservation
            AND: [
              { checkInDate: { gte: start } },
              { checkOutDate: { lte: end } },
            ],
          },
        ],
      },
    });

    return conflictingReservations === 0;
  }

  /**
   * Get statistics for dashboard
   */
  async getScheduleStats(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const [
      totalAccommodations,
      totalReservations,
      activeReservations,
      occupancyData,
    ] = await Promise.all([
      // Total accommodations
      prisma.accommodation.count({
        where: { isAvailable: true },
      }),

      // Total reservations in period
      prisma.reservation.count({
        where: {
          checkInDate: { gte: start, lte: end },
          status: {
            notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW],
          },
        },
      }),

      // Active reservations (currently checked in)
      prisma.reservation.count({
        where: {
          status: ReservationStatus.CHECKED_IN,
        },
      }),

      // Get all reservations for occupancy calculation
      prisma.reservation.findMany({
        where: {
          OR: [
            {
              checkInDate: { gte: start, lte: end },
            },
            {
              checkOutDate: { gte: start, lte: end },
            },
            {
              AND: [
                { checkInDate: { lte: start } },
                { checkOutDate: { gte: end } },
              ],
            },
          ],
          status: {
            notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW],
          },
        },
        select: {
          checkInDate: true,
          checkOutDate: true,
        },
      }),
    ]);

    // Calculate occupancy rate
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPossibleRoomNights = totalAccommodations * totalDays;

    let totalOccupiedNights = 0;
    occupancyData.forEach((reservation) => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      const effectiveStart = checkIn > start ? checkIn : start;
      const effectiveEnd = checkOut < end ? checkOut : end;

      const nights = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24));
      totalOccupiedNights += Math.max(0, nights);
    });

    const occupancyRate = totalPossibleRoomNights > 0
      ? (totalOccupiedNights / totalPossibleRoomNights) * 100
      : 0;

    return {
      totalAccommodations,
      totalReservations,
      activeReservations,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      availableAccommodations: totalAccommodations - activeReservations,
    };
  }
}

export const scheduleService = new ScheduleService();
