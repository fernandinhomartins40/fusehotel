import { randomUUID } from 'crypto';
import { prisma } from '../config/database';
import { env } from '../config/environment';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { EmailService } from './email.service';
import { ReservationService } from './reservations.service';
import { scheduleService } from './schedule.service';

const prismaPms = prisma as any;

function buildFrontUrl(path: string) {
  return `${env.FRONTEND_URL.replace(/\/$/, '')}${path}`;
}

export class CRMService {
  static async listQuotes() {
    return prismaPms.reservationQuote.findMany({
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  static async createQuote(data: any) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: data.accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundError('Acomodação não encontrada');
    }

    const isAvailable = await scheduleService.checkAvailability(
      data.accommodationId,
      data.checkInDate,
      data.checkOutDate
    );

    if (!isAvailable) {
      throw new BadRequestError('Não há disponibilidade para o período informado');
    }

    const checkInDate = new Date(data.checkInDate);
    const checkOutDate = new Date(data.checkOutDate);
    const numberOfNights = Math.max(
      1,
      Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const amount = Number(accommodation.pricePerNight) * numberOfNights;

    const quote = await prismaPms.reservationQuote.create({
      data: {
        quoteCode: `ORC-${Date.now().toString().slice(-8)}`,
        accommodationId: data.accommodationId,
        guestName: data.guestName.trim(),
        guestEmail: data.guestEmail?.trim().toLowerCase(),
        guestPhone: data.guestPhone?.trim(),
        source: data.source ?? 'WHATSAPP',
        checkInDate,
        checkOutDate,
        numberOfGuests: data.numberOfGuests,
        numberOfExtraBeds: data.numberOfExtraBeds ?? 0,
        amount,
        paymentLinkUrl: data.paymentLinkUrl?.trim() || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        notes: data.notes?.trim(),
        status: data.status ?? 'OPEN',
      },
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (quote.guestEmail && EmailService.isConfigured()) {
      await EmailService.sendQuoteEmail({
        to: quote.guestEmail,
        guestName: quote.guestName,
        quoteCode: quote.quoteCode,
        amount: Number(quote.amount),
        paymentLinkUrl: quote.paymentLinkUrl ?? undefined,
      });
    }

    return quote;
  }

  static async updateQuote(id: string, data: any) {
    const quote = await prismaPms.reservationQuote.findUnique({ where: { id } });

    if (!quote) {
      throw new NotFoundError('Orçamento não encontrado');
    }

    return prismaPms.reservationQuote.update({
      where: { id },
      data: {
        guestName: data.guestName?.trim(),
        guestEmail: data.guestEmail?.trim().toLowerCase(),
        guestPhone: data.guestPhone?.trim(),
        status: data.status,
        paymentLinkUrl: data.paymentLinkUrl?.trim(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : data.expiresAt,
        notes: data.notes?.trim(),
      },
      include: {
        accommodation: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async convertQuote(id: string) {
    const quote = await prismaPms.reservationQuote.findUnique({
      where: { id },
    });

    if (!quote) {
      throw new NotFoundError('Orçamento não encontrado');
    }

    if (quote.status === 'CONVERTED' && quote.convertedReservationId) {
      return prisma.reservation.findUnique({
        where: { id: quote.convertedReservationId },
        include: { accommodation: true },
      });
    }

    const reservation = await ReservationService.create({
      accommodationId: quote.accommodationId,
      checkInDate: quote.checkInDate.toISOString(),
      checkOutDate: quote.checkOutDate.toISOString(),
      numberOfGuests: quote.numberOfGuests,
      numberOfExtraBeds: quote.numberOfExtraBeds,
      guestName: quote.guestName,
      guestEmail: quote.guestEmail ?? undefined,
      guestPhone: quote.guestPhone ?? undefined,
      guestWhatsApp: quote.guestPhone ?? '00000000000',
      guestCpf: undefined,
      specialRequests: quote.notes ?? undefined,
    });

    await prismaPms.reservationQuote.update({
      where: { id },
      data: {
        status: 'CONVERTED',
        convertedReservationId: reservation.id,
      },
    });

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        source: quote.source,
      },
    });

    return prisma.reservation.findUnique({
      where: { id: reservation.id },
      include: { accommodation: true },
    });
  }

  static async listBusinessAccounts() {
    return prismaPms.businessAccount.findMany({
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });
  }

  static async createBusinessAccount(data: any) {
    return prismaPms.businessAccount.create({
      data: {
        name: data.name.trim(),
        type: data.type,
        document: data.document?.trim(),
        email: data.email?.trim().toLowerCase(),
        phone: data.phone?.trim(),
        commissionRate: data.commissionRate,
        markupType: data.markupType,
        markupValue: data.markupValue,
        paymentTermsDays: data.paymentTermsDays,
        notes: data.notes?.trim(),
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateBusinessAccount(id: string, data: any) {
    const account = await prismaPms.businessAccount.findUnique({ where: { id } });

    if (!account) {
      throw new NotFoundError('Conta B2B não encontrada');
    }

    return prismaPms.businessAccount.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        type: data.type,
        document: data.document?.trim(),
        email: data.email?.trim().toLowerCase(),
        phone: data.phone?.trim(),
        commissionRate: data.commissionRate,
        markupType: data.markupType,
        markupValue: data.markupValue,
        paymentTermsDays: data.paymentTermsDays,
        notes: data.notes?.trim(),
        isActive: data.isActive,
      },
    });
  }

  static async listFeedbacks() {
    return prismaPms.guestFeedback.findMany({
      include: {
        reservation: {
          select: {
            id: true,
            reservationCode: true,
            guestName: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  static async createFeedback(data: any) {
    const reservation = await prisma.reservation.findUnique({
      where: { id: data.reservationId },
    });

    if (!reservation) {
      throw new NotFoundError('Reserva não encontrada');
    }

    return prismaPms.guestFeedback.create({
      data: {
        reservationId: data.reservationId,
        rating: data.rating,
        source: data.source?.trim(),
        comment: data.comment?.trim(),
      },
      include: {
        reservation: {
          select: {
            id: true,
            reservationCode: true,
            guestName: true,
          },
        },
      },
    });
  }

  static async issuePreCheckIn(reservationId: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundError('Reserva não encontrada');
    }

    const token = randomUUID();
    const existing = await prismaPms.preCheckIn.findUnique({
      where: { reservationId },
    });

    const preCheckIn = existing
      ? await prismaPms.preCheckIn.update({
          where: { reservationId },
          data: {
            token,
            status: 'PENDING',
            fnrhStatus: 'PENDING',
            lastError: null,
          },
        })
      : await prismaPms.preCheckIn.create({
          data: {
            reservationId,
            token,
          },
        });

    const checkInUrl = buildFrontUrl(`/pre-check-in/${preCheckIn.token}`);

    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        paymentLinkUrl: reservation.paymentLinkUrl ?? checkInUrl,
      },
    });

    if (reservation.guestEmail && EmailService.isConfigured()) {
      await EmailService.sendPreCheckInLink({
        to: reservation.guestEmail,
        name: reservation.guestName,
        checkInUrl,
        reservationCode: reservation.reservationCode,
      });
    }

    return {
      ...preCheckIn,
      checkInUrl,
    };
  }

  static async listPreCheckIns() {
    return prismaPms.preCheckIn.findMany({
      include: {
        reservation: {
          select: {
            id: true,
            reservationCode: true,
            guestName: true,
            checkInDate: true,
            checkOutDate: true,
            source: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  static async getPreCheckInByToken(token: string) {
    const preCheckIn = await prismaPms.preCheckIn.findUnique({
      where: { token },
      include: {
        reservation: {
          include: {
            accommodation: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!preCheckIn) {
      throw new NotFoundError('Pré-check-in não encontrado');
    }

    return preCheckIn;
  }

  static async submitPreCheckIn(token: string, data: any) {
    const preCheckIn = await this.getPreCheckInByToken(token);

    return prismaPms.preCheckIn.update({
      where: { token },
      data: {
        status: 'SUBMITTED',
        fnrhStatus: 'READY',
        guestData: data.guestData ?? data,
        documentData: data.documentData ?? null,
        signatureData: data.signatureData ?? null,
        submittedAt: new Date(),
        lastError: null,
      },
      include: {
        reservation: {
          include: {
            accommodation: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  static async approvePreCheckIn(id: string) {
    const preCheckIn = await prismaPms.preCheckIn.findUnique({
      where: { id },
      include: { reservation: true },
    });

    if (!preCheckIn) {
      throw new NotFoundError('Pré-check-in não encontrado');
    }

    return prismaPms.preCheckIn.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
      include: {
        reservation: true,
      },
    });
  }

  static async sendFNRH(id: string) {
    const preCheckIn = await prismaPms.preCheckIn.findUnique({
      where: { id },
      include: { reservation: true },
    });

    if (!preCheckIn) {
      throw new NotFoundError('Pré-check-in não encontrado');
    }

    return prismaPms.preCheckIn.update({
      where: { id },
      data: {
        fnrhStatus: 'SENT',
        sentToGovernmentAt: new Date(),
        lastError: null,
      },
      include: {
        reservation: true,
      },
    });
  }

  static async sendVoucher(reservationId: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        accommodation: true,
      },
    });

    if (!reservation) {
      throw new NotFoundError('Reserva não encontrada');
    }

    const preCheckIn = await prismaPms.preCheckIn.findUnique({
      where: { reservationId },
    });

    const checkInUrl = preCheckIn ? buildFrontUrl(`/pre-check-in/${preCheckIn.token}`) : undefined;

    if (reservation.guestEmail && EmailService.isConfigured()) {
      await EmailService.sendReservationVoucher({
        to: reservation.guestEmail,
        guestName: reservation.guestName,
        reservationCode: reservation.reservationCode,
        accommodationName: reservation.accommodation.name,
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        totalAmount: Number(reservation.totalAmount),
        checkInUrl,
      });
    }

    return prisma.reservation.update({
      where: { id: reservationId },
      data: {
        voucherSentAt: new Date(),
      },
      include: {
        accommodation: true,
      },
    });
  }

  static async generatePaymentLink(reservationId: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundError('Reserva não encontrada');
    }

    const paymentToken = randomUUID();
    const paymentLinkUrl = buildFrontUrl(`/area-do-cliente?pagamento=${paymentToken}&reserva=${reservation.reservationCode}`);

    return prisma.reservation.update({
      where: { id: reservationId },
      data: {
        paymentLinkUrl,
        paymentLinkExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }
}
