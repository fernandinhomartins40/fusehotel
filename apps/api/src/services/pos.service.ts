import {
  FolioEntrySource,
  FolioEntryType,
  StayStatus,
} from '@prisma/client';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import {
  CreatePOSOrderDto,
  CreatePOSProductDto,
  UpdatePOSOrderStatusDto,
} from '../types/pms';

const prismaPms = prisma as any;

function buildOrderNumber() {
  return `POS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export class POSService {
  static async listProducts() {
    return prismaPms.posProduct.findMany({
      orderBy: [{ isActive: 'desc' }, { category: 'asc' }, { name: 'asc' }],
    });
  }

  static async createProduct(data: CreatePOSProductDto) {
    return prismaPms.posProduct.create({
      data: {
        name: data.name.trim(),
        category: data.category ?? 'OTHER',
        price: data.price,
        description: data.description?.trim(),
      },
    });
  }

  static async listOrders() {
    return prismaPms.posOrder.findMany({
      include: {
        stay: {
          include: {
            reservation: {
              select: {
                reservationCode: true,
                guestName: true,
              },
            },
          },
        },
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createOrder(data: CreatePOSOrderDto) {
    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      let stayId = data.stayId;
      let roomUnitId = data.roomUnitId;

      if (stayId) {
        const stay = await tx.stay.findUnique({
          where: { id: stayId },
          include: {
            roomUnit: true,
          },
        });

        if (!stay || stay.status !== StayStatus.IN_HOUSE) {
          throw new BadRequestError('Hospedagem nao disponivel para lancamento');
        }

        roomUnitId = roomUnitId ?? stay.roomUnitId ?? undefined;
      }

      if (!stayId && roomUnitId && data.origin === 'ROOM_SERVICE') {
        const activeStay = await tx.stay.findFirst({
          where: {
            roomUnitId,
            status: StayStatus.IN_HOUSE,
          },
        });

        if (!activeStay) {
          throw new BadRequestError('Room service exige uma hospedagem ativa no quarto');
        }

        stayId = activeStay.id;
      }

      const products = await txPms.posProduct.findMany({
        where: {
          id: {
            in: data.items.map((item) => item.productId),
          },
          isActive: true,
        },
      });

      if (products.length !== data.items.length) {
        throw new NotFoundError('Um ou mais produtos do pedido nao foram encontrados');
      }

      const itemsPayload = data.items.map((item) => {
        const product = products.find((candidate: any) => candidate.id === item.productId)!;
        const quantity = Number(item.quantity);
        const unitPrice = Number(product.price);
        const totalPrice = quantity * unitPrice;

        return {
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice,
          totalPrice,
          notes: item.notes?.trim(),
        };
      });

      const totalAmount = itemsPayload.reduce((sum, item) => sum + item.totalPrice, 0);

      return txPms.posOrder.create({
        data: {
          orderNumber: buildOrderNumber(),
          stayId,
          roomUnitId,
          origin: data.origin,
          notes: data.notes?.trim(),
          totalAmount,
          items: {
            create: itemsPayload,
          },
        },
        include: {
          stay: {
            include: {
              reservation: {
                select: {
                  reservationCode: true,
                  guestName: true,
                },
              },
            },
          },
          roomUnit: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          items: true,
        },
      });
    });
  }

  static async updateOrderStatus(id: string, data: UpdatePOSOrderStatusDto) {
    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      const order = await txPms.posOrder.findUnique({
        where: { id },
        include: {
          stay: {
            include: {
              folio: true,
            },
          },
          items: true,
        },
      });

      if (!order) {
        throw new NotFoundError('Pedido nao encontrado');
      }

      if (order.status === 'CANCELLED' || order.status === 'CLOSED') {
        throw new BadRequestError('Pedido ja encerrado');
      }

      const updated = await txPms.posOrder.update({
        where: { id },
        data: {
          status: data.status,
        },
        include: {
          stay: {
            include: {
              reservation: {
                select: {
                  reservationCode: true,
                  guestName: true,
                },
              },
            },
          },
          roomUnit: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          items: true,
        },
      });

      const shouldPostToFolio =
        (data.status === 'DELIVERED' || data.status === 'CLOSED') &&
        order.stayId;

      if (shouldPostToFolio) {
        const existingEntry = order.stay?.folio
          ? await tx.folioEntry.findFirst({
              where: {
                folioId: order.stay.folio.id,
                referenceId: order.id,
              },
            })
          : null;

        if (!existingEntry && order.stay?.folio) {
          const entryType =
            order.origin === 'ROOM_SERVICE'
              ? FolioEntryType.ROOM_SERVICE
              : FolioEntryType.POS;

          await tx.folioEntry.create({
            data: {
              folioId: order.stay.folio.id,
              type: entryType,
              source: FolioEntrySource.POS,
              description: `Pedido ${order.orderNumber} (${order.origin})`,
              amount: Number(order.totalAmount),
              quantity: 1,
              referenceId: order.id,
            },
          });

          const aggregate = await tx.folioEntry.aggregate({
            where: { folioId: order.stay.folio.id },
            _sum: { amount: true },
          });

          await tx.folio.update({
            where: { id: order.stay.folio.id },
            data: {
              balance: Number(aggregate._sum.amount ?? 0),
            },
          });
        }
      }

      return updated;
    });
  }
}
