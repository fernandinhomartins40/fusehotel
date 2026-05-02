import { Prisma } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { prisma } from '../config/database';
import { BadRequestError } from '../utils/errors';

export interface PricingInput {
  accommodationId?: string;
  roomUnitId?: string;
  checkInDate: Date | string;
  checkOutDate: Date | string;
  numberOfExtraBeds?: number;
  promotionId?: string;
  promotionCode?: string;
}

export interface PricingBreakdown {
  pricePerNight: number;
  extraBedPrice: number;
  numberOfNights: number;
  subtotal: number;
  extraBedsCost: number;
  serviceFeeRate: number;
  serviceFee: number;
  taxRate: number;
  taxes: number;
  discount: number;
  promotionId?: string;
  totalAmount: number;
}

const SERVICE_FEE_RATE = 0.05;
const TAX_RATE = 0.02;

export class PricingService {
  static async calculate(
    input: PricingInput,
    tx?: Prisma.TransactionClient
  ): Promise<PricingBreakdown> {
    const db = tx ?? prisma;

    const checkInDate =
      typeof input.checkInDate === 'string' ? new Date(input.checkInDate) : input.checkInDate;
    const checkOutDate =
      typeof input.checkOutDate === 'string' ? new Date(input.checkOutDate) : input.checkOutDate;
    const numberOfNights = differenceInDays(checkOutDate, checkInDate);

    if (numberOfNights <= 0) {
      throw new BadRequestError('Data de check-out deve ser posterior ao check-in');
    }

    const accommodationId = await this.resolveAccommodationId(input, db);

    const accommodation = await db.accommodation.findUnique({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw new BadRequestError('Acomodacao nao encontrada');
    }

    const pricePerNight = await this.resolveNightlyRate(
      accommodationId,
      checkInDate,
      checkOutDate,
      db
    );

    const extraBedPrice = Number(accommodation.extraBedPrice);
    const numberOfExtraBeds = input.numberOfExtraBeds || 0;

    const subtotal = pricePerNight * numberOfNights;
    const extraBedsCost = numberOfExtraBeds * extraBedPrice * numberOfNights;
    const serviceFee = subtotal * SERVICE_FEE_RATE;
    const taxes = subtotal * TAX_RATE;

    const { discount, promotionId } = await this.resolveDiscount(input, subtotal, db);

    const totalAmount = Math.max(subtotal + extraBedsCost + serviceFee + taxes - discount, 0);

    return {
      pricePerNight,
      extraBedPrice,
      numberOfNights,
      subtotal,
      extraBedsCost,
      serviceFeeRate: SERVICE_FEE_RATE,
      serviceFee,
      taxRate: TAX_RATE,
      taxes,
      discount,
      promotionId,
      totalAmount,
    };
  }

  private static async resolveAccommodationId(
    input: PricingInput,
    db: Prisma.TransactionClient | typeof prisma
  ) {
    if (input.roomUnitId) {
      const roomUnit = await db.roomUnit.findUnique({
        where: { id: input.roomUnitId },
        select: { accommodationId: true },
      });

      if (!roomUnit) {
        throw new BadRequestError('Quarto nao encontrado');
      }

      return roomUnit.accommodationId;
    }

    if (!input.accommodationId) {
      throw new BadRequestError('accommodationId ou roomUnitId e obrigatorio');
    }

    return input.accommodationId;
  }

  private static async resolveNightlyRate(
    accommodationId: string,
    checkInDate: Date,
    checkOutDate: Date,
    db: Prisma.TransactionClient | typeof prisma
  ): Promise<number> {
    const dbPms = db as any;

    const ratePlan = await dbPms.ratePlan.findFirst({
      where: {
        accommodationId,
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: checkOutDate } }],
        AND: [
          { OR: [{ endsAt: null }, { endsAt: { gte: checkInDate } }] },
        ],
      },
      orderBy: { createdAt: 'desc' as const },
    });

    if (ratePlan) {
      return Number(ratePlan.basePrice);
    }

    const accommodation = await db.accommodation.findUnique({
      where: { id: accommodationId },
      select: { pricePerNight: true },
    });

    return Number(accommodation!.pricePerNight);
  }

  private static async resolveDiscount(
    input: PricingInput,
    subtotal: number,
    db: Prisma.TransactionClient | typeof prisma
  ): Promise<{ discount: number; promotionId?: string }> {
    if (!input.promotionId && !input.promotionCode) {
      return { discount: 0 };
    }

    const promotion = await db.promotion.findFirst({
      where: {
        OR: [
          input.promotionId ? { id: input.promotionId } : null,
          input.promotionCode ? { promotionCode: input.promotionCode } : null,
        ].filter(Boolean) as Prisma.PromotionWhereInput[],
      },
    });

    if (!promotion) {
      return { discount: 0 };
    }

    if (!promotion.isActive) {
      return { discount: 0 };
    }

    const checkIn =
      typeof input.checkInDate === 'string' ? new Date(input.checkInDate) : input.checkInDate;
    const checkOut =
      typeof input.checkOutDate === 'string' ? new Date(input.checkOutDate) : input.checkOutDate;

    const promotionStart = promotion.startDate.toISOString().slice(0, 10);
    const promotionEnd = promotion.endDate.toISOString().slice(0, 10);
    const stayCheckIn = checkIn.toISOString().slice(0, 10);
    const stayCheckOut = checkOut.toISOString().slice(0, 10);

    if (stayCheckIn < promotionStart || stayCheckOut > promotionEnd) {
      return { discount: 0 };
    }

    if (
      promotion.maxRedemptions !== null &&
      promotion.currentRedemptions >= promotion.maxRedemptions
    ) {
      return { discount: 0 };
    }

    const explicitPercent = promotion.discountPercent
      ? Number(promotion.discountPercent) / 100
      : 0;

    if (explicitPercent > 0) {
      return { discount: subtotal * explicitPercent, promotionId: promotion.id };
    }

    if (promotion.originalPrice && promotion.discountedPrice) {
      const original = Number(promotion.originalPrice);
      const discounted = Number(promotion.discountedPrice);

      if (original > discounted && original > 0) {
        return {
          discount: subtotal * ((original - discounted) / original),
          promotionId: promotion.id,
        };
      }
    }

    return { discount: 0, promotionId: promotion.id };
  }
}
