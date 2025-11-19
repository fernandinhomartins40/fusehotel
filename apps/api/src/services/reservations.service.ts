/**
 * Reservations Service
 *
 * Serviço de gerenciamento de reservas
 */

import { prisma } from '../config/database';
import {
  NotFoundError,
  ReservationUnavailableError,
  CancellationNotAllowedError,
  ValidationError,
} from '../utils/errors';
import { generateReservationCode } from '../utils/crypto';
import logger from '../utils/logger';
import { ReservationStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { differenceInDays, isPast, isBefore } from 'date-fns';

/**
 * Interface de dados para criação de reserva
 */
export interface CreateReservationData {
  accommodationId: string;
  userId?: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  numberOfExtraBeds?: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCpf?: string;
  guestNationality?: string;
  guestDocumentNumber?: string;
  specialRequests?: string;
  promotionCode?: string;
}

/**
 * Interface de dados para atualização de reserva
 */
export interface UpdateReservationData {
  checkInDate?: Date;
  checkOutDate?: Date;
  numberOfGuests?: number;
  numberOfExtraBeds?: number;
  specialRequests?: string;
}

/**
 * Interface de filtros de busca
 */
export interface ReservationFilters {
  userId?: string;
  accommodationId?: string;
  status?: ReservationStatus | ReservationStatus[];
  paymentStatus?: PaymentStatus;
  checkInDateFrom?: Date;
  checkInDateTo?: Date;
  checkOutDateFrom?: Date;
  checkOutDateTo?: Date;
  guestName?: string;
  reservationCode?: string;
}

/**
 * Service de reservas
 */
export class ReservationsService {
  /**
   * Calcula o preço total da reserva
   */
  private async calculatePricing(
    accommodationId: string,
    checkInDate: Date,
    checkOutDate: Date,
    numberOfExtraBeds: number = 0
  ): Promise<any> {
    // Busca a acomodação
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundError('Accommodation', accommodationId);
    }

    // Calcula número de noites
    const numberOfNights = differenceInDays(checkOutDate, checkInDate);

    if (numberOfNights < 1) {
      throw new ValidationError('Invalid date range: minimum 1 night required');
    }

    // Calcula valores
    const pricePerNight = Number(accommodation.pricePerNight);
    const subtotal = pricePerNight * numberOfNights;
    const extraBedsCost = Number(accommodation.extraBedPrice) * numberOfExtraBeds * numberOfNights;
    const serviceFee = (subtotal + extraBedsCost) * 0.1; // 10% taxa de serviço
    const taxes = (subtotal + extraBedsCost) * 0.05; // 5% impostos
    const discount = 0; // TODO: aplicar promoção se houver código
    const totalAmount = subtotal + extraBedsCost + serviceFee + taxes - discount;

    return {
      pricePerNight,
      numberOfNights,
      subtotal,
      extraBedsCost,
      serviceFee,
      taxes,
      discount,
      totalAmount,
    };
  }

  /**
   * Lista todas as reservas (com paginação e filtros)
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: ReservationFilters
  ): Promise<{ reservations: any[]; total: number }> {
    const skip = (page - 1) * limit;

    // Monta o where baseado nos filtros
    const where: any = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.accommodationId) {
      where.accommodationId = filters.accommodationId;
    }

    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        where.status = { in: filters.status };
      } else {
        where.status = filters.status;
      }
    }

    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    if (filters?.checkInDateFrom || filters?.checkInDateTo) {
      where.checkInDate = {};
      if (filters.checkInDateFrom) {
        where.checkInDate.gte = filters.checkInDateFrom;
      }
      if (filters.checkInDateTo) {
        where.checkInDate.lte = filters.checkInDateTo;
      }
    }

    if (filters?.checkOutDateFrom || filters?.checkOutDateTo) {
      where.checkOutDate = {};
      if (filters.checkOutDateFrom) {
        where.checkOutDate.gte = filters.checkOutDateFrom;
      }
      if (filters.checkOutDateTo) {
        where.checkOutDate.lte = filters.checkOutDateTo;
      }
    }

    if (filters?.guestName) {
      where.guestName = { contains: filters.guestName, mode: 'insensitive' };
    }

    if (filters?.reservationCode) {
      where.reservationCode = filters.reservationCode;
    }

    // Busca as reservas
    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        include: {
          accommodation: {
            select: {
              id: true,
              name: true,
              type: true,
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.reservation.count({ where }),
    ]);

    return { reservations, total };
  }

  /**
   * Busca uma reserva por ID
   */
  async findById(id: string): Promise<any> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        accommodation: {
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundError('Reservation', id);
    }

    return reservation;
  }

  /**
   * Busca uma reserva por código
   */
  async findByCode(code: string): Promise<any> {
    const reservation = await prisma.reservation.findUnique({
      where: { reservationCode: code },
      include: {
        accommodation: {
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundError('Reservation');
    }

    return reservation;
  }

  /**
   * Busca reservas de um usuário
   */
  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ reservations: any[]; total: number }> {
    return this.findAll(page, limit, { userId });
  }

  /**
   * Cria uma nova reserva
   */
  async create(data: CreateReservationData): Promise<any> {
    // Valida datas
    if (isPast(data.checkInDate)) {
      throw new ValidationError('Check-in date cannot be in the past');
    }

    if (isBefore(data.checkOutDate, data.checkInDate)) {
      throw new ValidationError('Check-out date must be after check-in date');
    }

    // Verifica disponibilidade
    const isAvailable = await this.checkAvailability(
      data.accommodationId,
      data.checkInDate,
      data.checkOutDate
    );

    if (!isAvailable) {
      throw new ReservationUnavailableError();
    }

    // Busca a acomodação para validações
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: data.accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundError('Accommodation', data.accommodationId);
    }

    // Valida capacidade
    if (data.numberOfGuests > accommodation.capacity + (data.numberOfExtraBeds || 0)) {
      throw new ValidationError('Number of guests exceeds accommodation capacity');
    }

    // Valida camas extras
    if ((data.numberOfExtraBeds || 0) > accommodation.maxExtraBeds) {
      throw new ValidationError('Number of extra beds exceeds maximum allowed');
    }

    // Calcula preços
    const pricing = await this.calculatePricing(
      data.accommodationId,
      data.checkInDate,
      data.checkOutDate,
      data.numberOfExtraBeds || 0
    );

    // Gera código de reserva único
    let reservationCode;
    let codeExists = true;
    while (codeExists) {
      reservationCode = generateReservationCode();
      const existing = await prisma.reservation.findUnique({
        where: { reservationCode },
      });
      codeExists = !!existing;
    }

    // Cria a reserva
    const reservation = await prisma.reservation.create({
      data: {
        reservationCode: reservationCode!,
        accommodationId: data.accommodationId,
        userId: data.userId || null,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        numberOfNights: pricing.numberOfNights,
        numberOfGuests: data.numberOfGuests,
        numberOfExtraBeds: data.numberOfExtraBeds || 0,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        guestCpf: data.guestCpf,
        guestNationality: data.guestNationality,
        guestDocumentNumber: data.guestDocumentNumber,
        pricePerNight: pricing.pricePerNight,
        subtotal: pricing.subtotal,
        extraBedsCost: pricing.extraBedsCost,
        serviceFee: pricing.serviceFee,
        taxes: pricing.taxes,
        discount: pricing.discount,
        totalAmount: pricing.totalAmount,
        status: ReservationStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        specialRequests: data.specialRequests,
      },
      include: {
        accommodation: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info('Reservation created', { reservationId: reservation.id });

    return reservation;
  }

  /**
   * Atualiza uma reserva
   */
  async update(id: string, data: UpdateReservationData): Promise<any> {
    // Busca a reserva
    const existing = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Reservation', id);
    }

    // Não permite atualizar se já foi finalizada ou cancelada
    if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(existing.status)) {
      throw new ValidationError('Cannot update completed or cancelled reservation');
    }

    // Prepara dados de atualização
    const updateData: any = {};

    // Se as datas mudaram, recalcula preços
    if (data.checkInDate || data.checkOutDate) {
      const checkInDate = data.checkInDate || existing.checkInDate;
      const checkOutDate = data.checkOutDate || existing.checkOutDate;
      const numberOfExtraBeds = data.numberOfExtraBeds ?? existing.numberOfExtraBeds;

      // Valida datas
      if (isBefore(checkOutDate, checkInDate)) {
        throw new ValidationError('Check-out date must be after check-in date');
      }

      // Verifica disponibilidade (excluindo a própria reserva)
      const isAvailable = await this.checkAvailability(
        existing.accommodationId,
        checkInDate,
        checkOutDate,
        id
      );

      if (!isAvailable) {
        throw new ReservationUnavailableError();
      }

      // Recalcula preços
      const pricing = await this.calculatePricing(
        existing.accommodationId,
        checkInDate,
        checkOutDate,
        numberOfExtraBeds
      );

      updateData.checkInDate = checkInDate;
      updateData.checkOutDate = checkOutDate;
      updateData.numberOfNights = pricing.numberOfNights;
      updateData.pricePerNight = pricing.pricePerNight;
      updateData.subtotal = pricing.subtotal;
      updateData.extraBedsCost = pricing.extraBedsCost;
      updateData.serviceFee = pricing.serviceFee;
      updateData.taxes = pricing.taxes;
      updateData.totalAmount = pricing.totalAmount;
    }

    if (data.numberOfGuests !== undefined) {
      updateData.numberOfGuests = data.numberOfGuests;
    }

    if (data.numberOfExtraBeds !== undefined) {
      updateData.numberOfExtraBeds = data.numberOfExtraBeds;
    }

    if (data.specialRequests !== undefined) {
      updateData.specialRequests = data.specialRequests;
    }

    // Atualiza a reserva
    const reservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        accommodation: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info('Reservation updated', { reservationId: id });

    return reservation;
  }

  /**
   * Cancela uma reserva
   */
  async cancel(id: string, reason: string): Promise<any> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundError('Reservation', id);
    }

    // Não permite cancelar se já foi cancelada ou finalizada
    if (['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(reservation.status)) {
      throw new CancellationNotAllowedError('Reservation already finalized');
    }

    // Não permite cancelar se já fez check-in
    if (reservation.status === 'CHECKED_IN') {
      throw new CancellationNotAllowedError('Cannot cancel after check-in');
    }

    // Atualiza a reserva
    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CANCELLED,
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
      include: {
        accommodation: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info('Reservation cancelled', { reservationId: id, reason });

    return updated;
  }

  /**
   * Faz check-in de uma reserva
   */
  async checkIn(id: string): Promise<any> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundError('Reservation', id);
    }

    if (reservation.status !== 'CONFIRMED') {
      throw new ValidationError('Only confirmed reservations can be checked in');
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CHECKED_IN,
        checkedInAt: new Date(),
      },
      include: {
        accommodation: true,
      },
    });

    logger.info('Check-in completed', { reservationId: id });

    return updated;
  }

  /**
   * Faz check-out de uma reserva
   */
  async checkOut(id: string): Promise<any> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundError('Reservation', id);
    }

    if (reservation.status !== 'CHECKED_IN') {
      throw new ValidationError('Only checked-in reservations can be checked out');
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CHECKED_OUT,
        checkedOutAt: new Date(),
      },
      include: {
        accommodation: true,
      },
    });

    logger.info('Check-out completed', { reservationId: id });

    return updated;
  }

  /**
   * Verifica disponibilidade
   */
  async checkAvailability(
    accommodationId: string,
    checkInDate: Date,
    checkOutDate: Date,
    excludeReservationId?: string
  ): Promise<boolean> {
    const where: any = {
      accommodationId,
      status: {
        in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
      },
      OR: [
        {
          AND: [
            { checkInDate: { lte: checkInDate } },
            { checkOutDate: { gt: checkInDate } },
          ],
        },
        {
          AND: [
            { checkInDate: { lt: checkOutDate } },
            { checkOutDate: { gte: checkOutDate } },
          ],
        },
        {
          AND: [
            { checkInDate: { gte: checkInDate } },
            { checkOutDate: { lte: checkOutDate } },
          ],
        },
      ],
    };

    if (excludeReservationId) {
      where.id = { not: excludeReservationId };
    }

    const conflictingReservations = await prisma.reservation.count({ where });

    return conflictingReservations === 0;
  }

  /**
   * Obtém estatísticas de reservas
   */
  async getStats(): Promise<any> {
    const [total, byStatus, byPaymentStatus, totalRevenue] = await Promise.all([
      prisma.reservation.count(),
      prisma.reservation.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.reservation.groupBy({
        by: ['paymentStatus'],
        _count: true,
      }),
      prisma.reservation.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      }, {} as Record<string, number>),
      byPaymentStatus: byPaymentStatus.reduce((acc, curr) => {
        acc[curr.paymentStatus] = curr._count;
        return acc;
      }, {} as Record<string, number>),
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    };
  }
}

export default new ReservationsService();
