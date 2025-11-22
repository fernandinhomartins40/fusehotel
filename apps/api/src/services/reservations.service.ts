import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';
import { differenceInDays } from 'date-fns';
import {
  CreateReservationDto,
  ReservationFilters,
  CancelReservationDto
} from '@fusehotel/shared';
import { Prisma } from '@prisma/client';

export class ReservationService {
  static async list(filters: ReservationFilters) {
    const where: Prisma.ReservationWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.accommodationId) where.accommodationId = filters.accommodationId;
    if (filters.status) {
      where.status = Array.isArray(filters.status) ? { in: filters.status } : filters.status;
    }
    if (filters.reservationCode) where.reservationCode = { contains: filters.reservationCode };

    return prisma.reservation.findMany({
      where,
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
            type: true,
            images: { where: { isPrimary: true }, take: 1 }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        accommodation: {
          include: {
            images: { where: { isPrimary: true }, take: 1 }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        payments: true
      }
    });

    if (!reservation) {
      throw new NotFoundError('Reserva não encontrada');
    }

    return reservation;
  }

  static async getByCode(code: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { reservationCode: code },
      include: {
        accommodation: true,
        payments: true
      }
    });

    if (!reservation) {
      throw new NotFoundError('Reserva não encontrada');
    }

    return reservation;
  }

  static async create(data: CreateReservationDto, userId?: string) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: data.accommodationId }
    });

    if (!accommodation || !accommodation.isAvailable) {
      throw new BadRequestError('Acomodação não disponível');
    }

    const numberOfNights = differenceInDays(
      new Date(data.checkOutDate),
      new Date(data.checkInDate)
    );

    if (numberOfNights <= 0) {
      throw new BadRequestError('Data de check-out deve ser posterior ao check-in');
    }

    const subtotal = Number(accommodation.pricePerNight) * numberOfNights;
    const extraBedsCost = (data.numberOfExtraBeds || 0) * Number(accommodation.extraBedPrice) * numberOfNights;
    const serviceFee = subtotal * 0.05;
    const taxes = subtotal * 0.02;
    const totalAmount = subtotal + extraBedsCost + serviceFee + taxes;

    const reservation = await prisma.reservation.create({
      data: {
        reservationCode: `FH-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`,
        accommodationId: data.accommodationId,
        userId: userId || null,
        checkInDate: new Date(data.checkInDate),
        checkOutDate: new Date(data.checkOutDate),
        numberOfNights,
        numberOfGuests: data.numberOfGuests,
        numberOfExtraBeds: data.numberOfExtraBeds || 0,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        guestCpf: data.guestCpf,
        pricePerNight: accommodation.pricePerNight,
        subtotal,
        extraBedsCost,
        serviceFee,
        taxes,
        discount: 0,
        totalAmount,
        specialRequests: data.specialRequests,
      },
      include: {
        accommodation: true
      }
    });

    return reservation;
  }

  static async cancel(id: string, reason: string) {
    const reservation = await this.getById(id);

    if (reservation.status === 'CANCELLED') {
      throw new BadRequestError('Reserva já cancelada');
    }

    return prisma.reservation.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason
      }
    });
  }
}
