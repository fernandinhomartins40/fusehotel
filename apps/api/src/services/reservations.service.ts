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
import { hashPassword } from '../utils/crypto';

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

    // Criar ou buscar usuário provisório se não houver userId
    let finalUserId = userId;

    if (!userId && data.guestWhatsApp) {
      const whatsapp = data.guestWhatsApp.replace(/\D/g, ''); // Limpar formatação

      // Buscar usuário pelo WhatsApp
      let user = await prisma.user.findUnique({
        where: { whatsapp }
      });

      // Se não existe, criar usuário provisório
      if (!user) {
        const firstThreeLetters = data.guestName
          .substring(0, 3)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''); // Remover acentos

        const password = await hashPassword(firstThreeLetters);

        user = await prisma.user.create({
          data: {
            name: data.guestName,
            whatsapp: whatsapp,
            email: data.guestEmail || `${whatsapp}@provisional.fusehotel.com`,
            password: password,
            phone: data.guestPhone,
            cpf: data.guestCpf,
            role: 'CUSTOMER',
            isProvisional: true,
            emailVerified: false
          }
        });
      }

      finalUserId = user.id;
    }

    const reservation = await prisma.reservation.create({
      data: {
        reservationCode: `FH-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`,
        accommodationId: data.accommodationId,
        userId: finalUserId,
        checkInDate: new Date(data.checkInDate),
        checkOutDate: new Date(data.checkOutDate),
        numberOfNights,
        numberOfGuests: data.numberOfGuests,
        numberOfExtraBeds: data.numberOfExtraBeds || 0,
        guestName: data.guestName,
        guestWhatsApp: data.guestWhatsApp,
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

  static async updateStatus(id: string, status: string) {
    const reservation = await this.getById(id);

    const updateData: any = { status };

    // Atualizar timestamps baseado no status
    if (status === 'CHECKED_IN' && !reservation.checkedInAt) {
      updateData.checkedInAt = new Date();
    }
    if (status === 'CHECKED_OUT' && !reservation.checkedOutAt) {
      updateData.checkedOutAt = new Date();
    }
    if (status === 'CANCELLED' && !reservation.cancelledAt) {
      updateData.cancelledAt = new Date();
    }

    return prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
            type: true,
            images: { where: { isPrimary: true }, take: 1 }
          }
        }
      }
    });
  }

  static async update(id: string, data: Partial<CreateReservationDto>) {
    const reservation = await this.getById(id);

    if (reservation.status === 'CANCELLED' || reservation.status === 'CHECKED_OUT') {
      throw new BadRequestError('Não é possível editar uma reserva cancelada ou finalizada');
    }

    const updateData: any = {};

    if (data.checkInDate) updateData.checkInDate = new Date(data.checkInDate);
    if (data.checkOutDate) updateData.checkOutDate = new Date(data.checkOutDate);
    if (data.numberOfGuests) updateData.numberOfGuests = data.numberOfGuests;
    if (data.numberOfExtraBeds !== undefined) updateData.numberOfExtraBeds = data.numberOfExtraBeds;
    if (data.specialRequests !== undefined) updateData.specialRequests = data.specialRequests;

    // Recalcular valores se datas mudaram
    if (data.checkInDate || data.checkOutDate) {
      const checkIn = data.checkInDate ? new Date(data.checkInDate) : reservation.checkInDate;
      const checkOut = data.checkOutDate ? new Date(data.checkOutDate) : reservation.checkOutDate;
      const numberOfNights = differenceInDays(checkOut, checkIn);

      if (numberOfNights <= 0) {
        throw new BadRequestError('Data de check-out deve ser posterior ao check-in');
      }

      const accommodation = await prisma.accommodation.findUnique({
        where: { id: reservation.accommodationId }
      });

      if (accommodation) {
        const subtotal = Number(accommodation.pricePerNight) * numberOfNights;
        const extraBedsCost = (updateData.numberOfExtraBeds || reservation.numberOfExtraBeds) * Number(accommodation.extraBedPrice) * numberOfNights;
        const serviceFee = subtotal * 0.05;
        const taxes = subtotal * 0.02;
        const totalAmount = subtotal + extraBedsCost + serviceFee + taxes;

        updateData.numberOfNights = numberOfNights;
        updateData.subtotal = subtotal;
        updateData.extraBedsCost = extraBedsCost;
        updateData.serviceFee = serviceFee;
        updateData.taxes = taxes;
        updateData.totalAmount = totalAmount;
      }
    }

    return prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        accommodation: true
      }
    });
  }
}
