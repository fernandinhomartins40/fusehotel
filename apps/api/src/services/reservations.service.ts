import { Prisma, ReservationStatus } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { CreateReservationDto, ReservationFilters } from '@fusehotel/shared';
import { prisma } from '../config/database';
import { hashPassword } from '../utils/crypto';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { EmailService } from './email.service';
import { PasswordResetService } from './password-reset.service';
import { scheduleService } from './schedule.service';

interface RequestUser {
  id: string;
  role: string;
}

const RESERVATION_STATUS_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING: ['CONFIRMED'],
  CONFIRMED: ['CHECKED_IN', 'NO_SHOW'],
  CHECKED_IN: ['CHECKED_OUT'],
  CHECKED_OUT: ['COMPLETED'],
  CANCELLED: [],
  COMPLETED: [],
  NO_SHOW: [],
};

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
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        accommodation: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
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
        payments: true,
      },
    });

    if (!reservation) {
      throw new NotFoundError('Reserva nao encontrada');
    }

    return reservation;
  }

  static async getByIdForUser(id: string, requester: RequestUser) {
    const reservation = await this.getById(id);
    this.ensureReservationAccess(reservation.userId, requester);
    return reservation;
  }

  static async getByCode(code: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { reservationCode: code },
      include: {
        accommodation: true,
        payments: true,
      },
    });

    if (!reservation) {
      throw new NotFoundError('Reserva nao encontrada');
    }

    return reservation;
  }

  static async create(data: CreateReservationDto, userId?: string) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: data.accommodationId },
    });

    if (!accommodation || !accommodation.isAvailable) {
      throw new BadRequestError('Acomodacao nao disponivel');
    }

    const checkInDate = new Date(data.checkInDate);
    const checkOutDate = new Date(data.checkOutDate);
    const numberOfNights = differenceInDays(checkOutDate, checkInDate);

    if (numberOfNights <= 0) {
      throw new BadRequestError('Data de check-out deve ser posterior ao check-in');
    }

    const isAvailableForStay = await scheduleService.checkAvailability(
      data.accommodationId,
      data.checkInDate,
      data.checkOutDate
    );

    if (!isAvailableForStay) {
      throw new BadRequestError('Ja existe uma reserva para esta acomodacao no periodo selecionado');
    }

    const promotion = await this.resolvePromotionForReservation(data, {
      checkInDate,
      checkOutDate,
    });

    const subtotal = Number(accommodation.pricePerNight) * numberOfNights;
    const extraBedsCost =
      (data.numberOfExtraBeds || 0) * Number(accommodation.extraBedPrice) * numberOfNights;
    const serviceFee = subtotal * 0.05;
    const taxes = subtotal * 0.02;
    const discount = promotion ? this.calculatePromotionDiscount(promotion, subtotal) : 0;
    const totalAmount = Math.max(subtotal + extraBedsCost + serviceFee + taxes - discount, 0);

    let finalUserId = userId;
    const guestWhatsApp = data.guestWhatsApp.replace(/\D/g, '');
    const guestEmail = data.guestEmail?.trim().toLowerCase();

    if (!userId) {
      let user = await prisma.user.findUnique({
        where: { whatsapp: guestWhatsApp },
      });

      if (!user) {
        const hashedPassword = await hashPassword(this.buildProvisionalPassword(data.guestName));

        user = await prisma.user.create({
          data: {
            name: data.guestName,
            whatsapp: guestWhatsApp,
            email: guestEmail || `${guestWhatsApp}@provisional.fusehotel.com`,
            password: hashedPassword,
            phone: data.guestPhone,
            cpf: data.guestCpf,
            role: 'CUSTOMER',
            isProvisional: true,
            emailVerified: false,
          },
        });

        if (guestEmail && EmailService.isConfigured()) {
          try {
            const token = await PasswordResetService.issueToken(user.id);
            await EmailService.sendPortalAccessEmail({
              to: guestEmail,
              name: data.guestName,
              token,
            });
          } catch (error) {
            logger.warn(`Falha ao enviar acesso inicial para ${guestEmail}: ${String(error)}`);
          }
        }
      }

      finalUserId = user.id;
    }

    return prisma.reservation.create({
      data: {
        reservationCode: `FH-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`,
        accommodationId: data.accommodationId,
        userId: finalUserId,
        checkInDate,
        checkOutDate,
        numberOfNights,
        numberOfGuests: data.numberOfGuests,
        numberOfExtraBeds: data.numberOfExtraBeds || 0,
        guestName: data.guestName,
        guestWhatsApp,
        guestEmail,
        guestPhone: data.guestPhone,
        guestCpf: data.guestCpf,
        pricePerNight: accommodation.pricePerNight,
        subtotal,
        extraBedsCost,
        serviceFee,
        taxes,
        discount,
        totalAmount,
        specialRequests: this.buildReservationSpecialRequests(data.specialRequests, promotion),
      },
      include: {
        accommodation: true,
      },
    });
  }

  static async cancel(id: string, reason: string, requester: RequestUser) {
    const reservation = await this.getById(id);
    this.ensureReservationAccess(reservation.userId, requester);

    if (reservation.status === 'CANCELLED') {
      throw new BadRequestError('Reserva ja cancelada');
    }

    if (reservation.status !== 'PENDING' && reservation.status !== 'CONFIRMED') {
      throw new BadRequestError('Somente reservas pendentes ou confirmadas podem ser rejeitadas');
    }

    return prisma.reservation.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });
  }

  static async updateStatus(id: string, status: string) {
    const reservation = await this.getById(id);
    const nextStatus = status as ReservationStatus;

    this.assertValidStatusTransition(reservation.status as ReservationStatus, nextStatus);

    const updateData: Record<string, unknown> = { status: nextStatus };

    if (nextStatus === 'CHECKED_IN' && !reservation.checkedInAt) {
      updateData.checkedInAt = new Date();
    }
    if (nextStatus === 'CHECKED_OUT' && !reservation.checkedOutAt) {
      updateData.checkedOutAt = new Date();
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
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
    });
  }

  static async update(id: string, data: Partial<CreateReservationDto>) {
    const reservation = await this.getById(id);

    if (reservation.status === 'CANCELLED' || reservation.status === 'CHECKED_OUT') {
      throw new BadRequestError('Nao e possivel editar uma reserva cancelada ou finalizada');
    }

    const updateData: Record<string, unknown> = {};

    if (data.checkInDate) updateData.checkInDate = new Date(data.checkInDate);
    if (data.checkOutDate) updateData.checkOutDate = new Date(data.checkOutDate);
    if (data.numberOfGuests) updateData.numberOfGuests = data.numberOfGuests;
    if (data.numberOfExtraBeds !== undefined) updateData.numberOfExtraBeds = data.numberOfExtraBeds;
    if (data.specialRequests !== undefined) updateData.specialRequests = data.specialRequests;

    if (data.checkInDate || data.checkOutDate) {
      const checkIn = data.checkInDate ? new Date(data.checkInDate) : reservation.checkInDate;
      const checkOut = data.checkOutDate ? new Date(data.checkOutDate) : reservation.checkOutDate;
      const numberOfNights = differenceInDays(checkOut, checkIn);

      if (numberOfNights <= 0) {
        throw new BadRequestError('Data de check-out deve ser posterior ao check-in');
      }

      const accommodation = await prisma.accommodation.findUnique({
        where: { id: reservation.accommodationId },
      });

      if (accommodation) {
        if (!accommodation.isAvailable) {
          throw new BadRequestError('Acomodacao nao disponivel para alteracao de agenda');
        }

        const isAvailableForUpdate = await scheduleService.checkAvailability(
          reservation.accommodationId,
          checkIn,
          checkOut,
          reservation.id
        );

        if (!isAvailableForUpdate) {
          throw new BadRequestError('Ja existe uma reserva para esta acomodacao no periodo selecionado');
        }

        const subtotal = Number(accommodation.pricePerNight) * numberOfNights;
        const extraBedsCost =
          (Number(updateData.numberOfExtraBeds) || reservation.numberOfExtraBeds) *
          Number(accommodation.extraBedPrice) *
          numberOfNights;
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
        accommodation: true,
      },
    });
  }

  private static ensureReservationAccess(reservationUserId: string | null, requester: RequestUser) {
    if (requester.role === 'ADMIN' || requester.role === 'MANAGER') {
      return;
    }

    if (!reservationUserId || reservationUserId !== requester.id) {
      throw new ForbiddenError('Voce nao tem permissao para acessar esta reserva');
    }
  }

  private static async resolvePromotionForReservation(
    data: CreateReservationDto,
    stay: { checkInDate: Date; checkOutDate: Date }
  ) {
    if (!data.promotionId && !data.promotionCode) {
      return null;
    }

    const promotion = await prisma.promotion.findFirst({
      where: {
        OR: [
          data.promotionId ? { id: data.promotionId } : null,
          data.promotionCode ? { promotionCode: data.promotionCode } : null,
        ].filter(Boolean) as Prisma.PromotionWhereInput[],
      },
    });

    if (!promotion) {
      throw new BadRequestError('Promocao ou pacote promocional nao encontrado');
    }

    if (!promotion.isActive) {
      throw new BadRequestError('Esta promocao nao esta ativa para reservas');
    }

    const promotionStart = promotion.startDate.toISOString().slice(0, 10);
    const promotionEnd = promotion.endDate.toISOString().slice(0, 10);
    const stayCheckIn = stay.checkInDate.toISOString().slice(0, 10);
    const stayCheckOut = stay.checkOutDate.toISOString().slice(0, 10);

    if (stayCheckIn < promotionStart || stayCheckOut > promotionEnd) {
      throw new BadRequestError('As datas selecionadas estao fora da vigencia da promocao');
    }

    if (
      promotion.maxRedemptions !== null &&
      promotion.currentRedemptions >= promotion.maxRedemptions
    ) {
      throw new BadRequestError('Esta promocao atingiu o limite de utilizacoes');
    }

    return promotion;
  }

  private static calculatePromotionDiscount(
    promotion: {
      discountPercent: Prisma.Decimal | null;
      originalPrice: Prisma.Decimal | null;
      discountedPrice: Prisma.Decimal | null;
    },
    subtotal: number
  ) {
    const explicitPercent = promotion.discountPercent ? Number(promotion.discountPercent) / 100 : 0;

    if (explicitPercent > 0) {
      return subtotal * explicitPercent;
    }

    if (promotion.originalPrice && promotion.discountedPrice) {
      const original = Number(promotion.originalPrice);
      const discounted = Number(promotion.discountedPrice);

      if (original > discounted && original > 0) {
        return subtotal * ((original - discounted) / original);
      }
    }

    return 0;
  }

  private static buildReservationSpecialRequests(
    originalSpecialRequests: string | undefined,
    promotion: {
      title: string;
      promotionCode: string | null;
      type: string;
    } | null
  ) {
    const notes: string[] = [];

    if (promotion) {
      notes.push(
        `Origem do checkout: ${promotion.type === 'PACKAGE' ? 'Pacote' : 'Promocao'} "${promotion.title}"${promotion.promotionCode ? ` (codigo: ${promotion.promotionCode})` : ''}.`
      );
    }

    if (originalSpecialRequests?.trim()) {
      notes.push(originalSpecialRequests.trim());
    }

    return notes.length ? notes.join('\n\n') : undefined;
  }

  private static buildProvisionalPassword(name: string) {
    const normalized = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();

    return normalized.slice(0, 3) || 'fus';
  }

  private static assertValidStatusTransition(
    currentStatus: ReservationStatus,
    nextStatus: ReservationStatus
  ) {
    if (currentStatus === nextStatus) {
      return;
    }

    const allowedTransitions = RESERVATION_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes(nextStatus)) {
      throw new BadRequestError(
        `Nao e possivel alterar a reserva de ${currentStatus} para ${nextStatus}`
      );
    }
  }
}
