import { FolioEntryType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { ConsumeProductDto, CreateFolioEntryDto } from '../types/pms';

const CREDIT_ENTRY_TYPES = new Set<FolioEntryType>([
  FolioEntryType.DISCOUNT,
  FolioEntryType.PAYMENT,
]);

function toSignedAmount(type: FolioEntryType, amount: number) {
  return CREDIT_ENTRY_TYPES.has(type) ? -Math.abs(amount) : Math.abs(amount);
}

export class FoliosService {
  static async getByStay(stayId: string) {
    const folio = await prisma.folio.findUnique({
      where: { stayId },
      include: {
        entries: {
          orderBy: [{ postedAt: 'desc' }, { createdAt: 'desc' }],
        },
        stay: {
          include: {
            reservation: {
              select: {
                reservationCode: true,
                guestName: true,
              },
            },
            roomUnit: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!folio) {
      throw new NotFoundError('Folio da hospedagem nao encontrado');
    }

    return folio;
  }

  static async addEntry(folioId: string, data: CreateFolioEntryDto) {
    return prisma.$transaction(async (tx) => {
      const folio = await tx.folio.findUnique({
        where: { id: folioId },
      });

      if (!folio) {
        throw new NotFoundError('Folio nao encontrado');
      }

      if (folio.isClosed) {
        throw new BadRequestError('Nao e possivel lancar em um folio fechado');
      }

      const signedAmount = toSignedAmount(data.type as FolioEntryType, Number(data.amount));

      await tx.folioEntry.create({
        data: {
          folioId,
          type: data.type,
          source: data.source,
          description: data.description,
          amount: signedAmount,
          quantity: data.quantity ?? 1,
          referenceId: data.referenceId,
        },
      });

      const aggregate = await tx.folioEntry.aggregate({
        where: { folioId },
        _sum: { amount: true },
      });

      const balance = Number(aggregate._sum.amount ?? 0);

      await tx.folio.update({
        where: { id: folioId },
        data: {
          balance,
        },
      });

      return this.getByIdWithRelations(folioId, tx);
    });
  }

  static async consumeProduct(folioId: string, data: ConsumeProductDto) {
    const prismaPms = prisma as any;

    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;

      const folio = await tx.folio.findUnique({ where: { id: folioId } });
      if (!folio) throw new NotFoundError('Folio nao encontrado');
      if (folio.isClosed) throw new BadRequestError('Nao e possivel lancar em um folio fechado');

      const product = await txPms.posProduct.findUnique({ where: { id: data.productId } });
      if (!product) throw new NotFoundError('Produto nao encontrado');
      if (!product.isActive) throw new BadRequestError('Produto inativo');

      const quantity = data.quantity ?? 1;
      const unitPrice = Number(product.price);
      const totalAmount = unitPrice * quantity;

      // Adjust stock if tracked
      if (product.trackStock) {
        const nextQuantity = Number(product.stockQuantity) - quantity;
        if (nextQuantity < 0) {
          throw new BadRequestError(`Estoque insuficiente para ${product.name}`);
        }

        await txPms.posProduct.update({
          where: { id: product.id },
          data: { stockQuantity: nextQuantity },
        });

        await txPms.inventoryMovement.create({
          data: {
            productId: product.id,
            type: 'CONSUMPTION',
            quantity,
            referenceId: folioId,
            notes: `Consumo direto na conta do hospede`,
          },
        });
      }

      // Create folio entry (POS type, positive = charge)
      await tx.folioEntry.create({
        data: {
          folioId,
          type: FolioEntryType.POS,
          source: 'POS',
          description: quantity > 1 ? `${product.name} x${quantity}` : product.name,
          amount: totalAmount,
          quantity,
          referenceId: product.id,
        },
      });

      // Recalculate balance
      const aggregate = await tx.folioEntry.aggregate({
        where: { folioId },
        _sum: { amount: true },
      });
      const balance = Number(aggregate._sum.amount ?? 0);

      await tx.folio.update({
        where: { id: folioId },
        data: { balance },
      });

      return this.getByIdWithRelations(folioId, tx);
    });
  }

  static async ensureSettled(folioId: string, tx: Prisma.TransactionClient) {
    const folio = await tx.folio.findUnique({
      where: { id: folioId },
    });

    if (!folio) {
      throw new NotFoundError('Folio nao encontrado');
    }

    if (Math.round(Number(folio.balance) * 100) > 0) {
      throw new BadRequestError('Existem pendencias financeiras no folio da hospedagem');
    }

    return folio;
  }

  static async seedFromReservation(stayId: string, tx: Prisma.TransactionClient) {
    const stay = await tx.stay.findUnique({
      where: { id: stayId },
      include: {
        reservation: true,
      },
    });

    if (!stay) {
      throw new NotFoundError('Hospedagem nao encontrada');
    }

    const folio = await tx.folio.create({
      data: {
        stayId,
      },
    });

    const entries = [
      { type: FolioEntryType.DAILY_RATE, description: 'Diarias da reserva', amount: Number(stay.reservation.subtotal) },
      { type: FolioEntryType.EXTRA_BED, description: 'Camas extras', amount: Number(stay.reservation.extraBedsCost) },
      { type: FolioEntryType.SERVICE_FEE, description: 'Taxa de servico', amount: Number(stay.reservation.serviceFee) },
      { type: FolioEntryType.TAX, description: 'Impostos', amount: Number(stay.reservation.taxes) },
      { type: FolioEntryType.DISCOUNT, description: 'Desconto aplicado', amount: Number(stay.reservation.discount) },
    ].filter((entry) => entry.amount > 0);

    if (entries.length > 0) {
      await tx.folioEntry.createMany({
        data: entries.map((entry) => ({
          folioId: folio.id,
          type: entry.type,
          source: 'RESERVATION',
          description: entry.description,
          amount: toSignedAmount(entry.type, entry.amount),
          quantity: 1,
        })),
      });
    }

    const aggregate = await tx.folioEntry.aggregate({
      where: { folioId: folio.id },
      _sum: { amount: true },
    });

    await tx.folio.update({
      where: { id: folio.id },
      data: {
        balance: Number(aggregate._sum.amount ?? 0),
      },
    });

    return folio;
  }

  private static async getByIdWithRelations(folioId: string, tx: Prisma.TransactionClient) {
    const folio = await tx.folio.findUnique({
      where: { id: folioId },
      include: {
        entries: {
          orderBy: [{ postedAt: 'desc' }, { createdAt: 'desc' }],
        },
        stay: {
          include: {
            reservation: {
              select: {
                reservationCode: true,
                guestName: true,
              },
            },
            roomUnit: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!folio) {
      throw new NotFoundError('Folio nao encontrado');
    }

    return folio;
  }
}
