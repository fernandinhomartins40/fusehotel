import {
  FolioEntrySource,
  FolioEntryType,
  POSSettlementType,
  StayStatus,
  type Prisma,
} from '@prisma/client';
import { prisma } from '../config/database';
import {
  ConfirmRoomServiceConferenceDto,
  CreatePOSOrderDto,
  ToggleDoNotDisturbDto,
  UpsertRoomServiceConfigurationDto,
} from '../types/pms';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { POSService } from './pos.service';

function toRoomServiceLabel(source: 'MINIBAR' | 'IN_ROOM') {
  return source === 'MINIBAR' ? 'Frigobar' : 'Quarto';
}

async function recalculateFolioBalance(tx: Prisma.TransactionClient, folioId: string) {
  const aggregate = await tx.folioEntry.aggregate({
    where: { folioId },
    _sum: { amount: true },
  });

  return tx.folio.update({
    where: { id: folioId },
    data: {
      balance: Number(aggregate._sum.amount ?? 0),
    },
  });
}

export class RoomServiceService {
  static async getActiveDoNotDisturbStayForRoom(roomUnitId: string) {
    return prisma.stay.findFirst({
      where: {
        roomUnitId,
        status: StayStatus.IN_HOUSE,
        doNotDisturb: true,
      },
      include: {
        reservation: {
          select: {
            guestName: true,
            reservationCode: true,
          },
        },
      },
    });
  }

  static async listConfigurations(roomUnitId?: string) {
    return prisma.roomServiceConfiguration.findMany({
      where: roomUnitId ? { roomUnitId } : undefined,
      include: {
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
            accommodation: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [{ roomUnit: { code: 'asc' } }, { configType: 'asc' }, { product: { name: 'asc' } }],
    });
  }

  static async upsertConfiguration(data: UpsertRoomServiceConfigurationDto) {
    const [roomUnit, product] = await Promise.all([
      prisma.roomUnit.findUnique({ where: { id: data.roomUnitId } }),
      prisma.pOSProduct.findUnique({ where: { id: data.productId }, include: { category: true } }),
    ]);

    if (!roomUnit) {
      throw new NotFoundError('Quarto não encontrado');
    }

    if (!product || !product.isActive) {
      throw new NotFoundError('Produto não encontrado');
    }

    return prisma.roomServiceConfiguration.upsert({
      where: {
        roomUnitId_productId_configType: {
          roomUnitId: data.roomUnitId,
          productId: data.productId,
          configType: data.configType,
        },
      },
      create: {
        roomUnitId: data.roomUnitId,
        productId: data.productId,
        configType: data.configType,
        quantity: data.quantity,
        notes: data.notes?.trim() || undefined,
      },
      update: {
        quantity: data.quantity,
        notes: data.notes?.trim() || undefined,
      },
      include: {
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
            accommodation: { select: { id: true, name: true } },
          },
        },
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  static async deleteConfiguration(id: string) {
    const config = await prisma.roomServiceConfiguration.findUnique({
      where: { id },
    });

    if (!config) {
      throw new NotFoundError('Item do serviço de quarto não encontrado');
    }

    await prisma.roomServiceConfiguration.delete({ where: { id } });
    return { id };
  }

  static async getConferencePreview(stayId: string) {
    const stay = await prisma.stay.findUnique({
      where: { id: stayId },
      include: {
        reservation: {
          select: {
            reservationCode: true,
            guestName: true,
          },
        },
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        folio: {
          select: {
            id: true,
            balance: true,
            isClosed: true,
          },
        },
      },
    });

    if (!stay) {
      throw new NotFoundError('Hospedagem não encontrada');
    }

    if (!stay.roomUnitId) {
      throw new BadRequestError('Hospedagem sem quarto vinculado');
    }

    const [configurations, charges] = await Promise.all([
      prisma.roomServiceConfiguration.findMany({
        where: {
          roomUnitId: stay.roomUnitId,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [{ configType: 'asc' }, { product: { name: 'asc' } }],
      }),
      prisma.roomServiceCharge.findMany({
        where: {
          stayId,
          source: {
            in: ['MINIBAR', 'IN_ROOM'],
          },
        },
      }),
    ]);

    const chargedQuantityByConfig = new Map<string, number>();

    for (const charge of charges) {
      if (!charge.configurationId) continue;
      chargedQuantityByConfig.set(
        charge.configurationId,
        Number(chargedQuantityByConfig.get(charge.configurationId) ?? 0) + charge.quantity
      );
    }

    return {
      stay: {
        id: stay.id,
        roomUnitId: stay.roomUnitId,
        guestName: stay.reservation.guestName,
        reservationCode: stay.reservation.reservationCode,
        roomCode: stay.roomUnit?.code ?? null,
        roomName: stay.roomUnit?.name ?? null,
        conferenceCompletedAt: stay.roomServiceConferenceAt,
        conferenceNotes: stay.roomServiceConferenceNotes,
      },
      items: configurations.map((config) => ({
        id: config.id,
        configType: config.configType,
        configuredQuantity: config.quantity,
        notes: config.notes,
        product: config.product,
        alreadyChargedQuantity: Number(chargedQuantityByConfig.get(config.id) ?? 0),
      })),
    };
  }

  static async confirmConference(
    stayId: string,
    data: ConfirmRoomServiceConferenceDto,
    user: { id: string; email?: string | null }
  ) {
    await prisma.$transaction(async (tx) => {
      const stay = await tx.stay.findUnique({
        where: { id: stayId },
        include: {
          roomUnit: true,
          folio: true,
          reservation: {
            select: {
              guestName: true,
            },
          },
        },
      });

      if (!stay) {
        throw new NotFoundError('Hospedagem não encontrada');
      }

      if (stay.status !== StayStatus.IN_HOUSE) {
        throw new BadRequestError('A conferência só pode ser feita com a hospedagem ativa');
      }

      if (!stay.roomUnitId || !stay.folio) {
        throw new BadRequestError('Hospedagem sem quarto ou conta vinculada');
      }

      if (stay.folio.isClosed) {
        throw new BadRequestError('Não é possível lançar itens em uma conta encerrada');
      }

      const configurationIds = data.items
        .map((item) => item.configurationId)
        .filter((value): value is string => Boolean(value));

      const productIds = [...new Set(data.items.map((item) => item.productId))];

      const [configurations, products] = await Promise.all([
        configurationIds.length
          ? tx.roomServiceConfiguration.findMany({
              where: {
                id: { in: configurationIds },
                roomUnitId: stay.roomUnitId,
              },
            })
          : Promise.resolve([]),
        productIds.length
          ? tx.pOSProduct.findMany({
              where: {
                id: { in: productIds },
                isActive: true,
              },
            })
          : Promise.resolve([]),
      ]);

      const configurationById = new Map(configurations.map((item) => [item.id, item]));
      const productById = new Map(products.map((item) => [item.id, item]));

      for (const item of data.items) {
        if (item.quantity < 0) {
          throw new BadRequestError('Quantidade inválida na conferência do quarto');
        }

        const product = productById.get(item.productId);
        if (!product) {
          throw new NotFoundError('Produto da conferência não encontrado');
        }

        if (item.configurationId) {
          const config = configurationById.get(item.configurationId);
          if (!config) {
            throw new BadRequestError('Item configurado não pertence a este quarto');
          }
        }
      }

      for (const item of data.items.filter((entry) => entry.quantity > 0)) {
        const product = productById.get(item.productId)!;
        const config = item.configurationId ? configurationById.get(item.configurationId) : undefined;
        const quantity = Number(item.quantity);
        const unitPrice = Number(product.price);
        const totalAmount = quantity * unitPrice;

        if (product.trackStock) {
          const nextQuantity = Number(product.stockQuantity) - quantity;

          if (nextQuantity < 0) {
            throw new BadRequestError(`Estoque insuficiente para ${product.name}`);
          }

          await tx.pOSProduct.update({
            where: { id: product.id },
            data: {
              stockQuantity: nextQuantity,
            },
          });

          await (tx as any).inventoryMovement.create({
            data: {
              productId: product.id,
              type: 'CONSUMPTION',
              quantity,
              referenceId: stay.id,
              notes: `Conferência do quarto ${stay.roomUnit?.code ?? stay.roomUnitId} no checkout`,
            },
          });
        }

        const folioEntry = await tx.folioEntry.create({
          data: {
            folioId: stay.folio.id,
            type: FolioEntryType.ROOM_SERVICE,
            source: FolioEntrySource.SYSTEM,
            description: `${toRoomServiceLabel(item.source)} - ${product.name} x${quantity}`,
            amount: totalAmount,
            quantity,
            referenceId: product.id,
            metadata: {
              stayId,
              roomUnitId: stay.roomUnitId,
              configurationId: config?.id ?? null,
              source: item.source,
            },
          },
        });

        await tx.roomServiceCharge.create({
          data: {
            stayId,
            roomUnitId: stay.roomUnitId,
            productId: product.id,
            configurationId: config?.id ?? null,
            source: item.source,
            quantity,
            unitPrice,
            totalAmount,
            notes: item.notes?.trim() || undefined,
            folioEntryId: folioEntry.id,
            confirmedByUserId: user.id,
            confirmedByEmail: user.email ?? undefined,
          },
        });
      }

      await recalculateFolioBalance(tx, stay.folio.id);

      await tx.stay.update({
        where: { id: stayId },
        data: {
          roomServiceConferenceAt: new Date(),
          roomServiceConferenceNotes: data.notes?.trim() || undefined,
        },
      });
    });

    return this.getConferencePreview(stayId);
  }

  static async getMyStay(userId: string) {
    const stay = await prisma.stay.findFirst({
      where: {
        status: StayStatus.IN_HOUSE,
        OR: [
          { reservation: { userId } },
          { guests: { some: { userId } } },
        ],
      },
      include: {
        reservation: {
          select: {
            id: true,
            reservationCode: true,
            guestName: true,
            checkInDate: true,
            checkOutDate: true,
          },
        },
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        folio: {
          select: {
            id: true,
            balance: true,
            isClosed: true,
          },
        },
      },
      orderBy: { actualCheckInAt: 'desc' },
    });

    if (!stay) {
      return null;
    }

    const [configurations, orders] = await Promise.all([
      prisma.roomServiceConfiguration.findMany({
        where: { roomUnitId: stay.roomUnitId ?? undefined },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [{ configType: 'asc' }, { product: { name: 'asc' } }],
      }),
      prisma.pOSOrder.findMany({
        where: {
          stayId: stay.id,
          origin: 'ROOM_SERVICE',
        },
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      ...stay,
      roomServiceConfigurations: configurations,
      roomServiceOrders: orders,
    };
  }

  static async listCatalog() {
    return prisma.pOSProduct.findMany({
      where: {
        isActive: true,
        isRoomServiceEnabled: true,
      },
      include: {
        category: true,
      },
      orderBy: [{ category: { order: 'asc' } }, { name: 'asc' }],
    });
  }

  static async listMyOrders(userId: string) {
    const stay = await this.getMyStay(userId);

    if (!stay) {
      return [];
    }

    return prisma.pOSOrder.findMany({
      where: {
        stayId: stay.id,
        origin: 'ROOM_SERVICE',
      },
      include: {
        items: true,
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createGuestOrder(
    userId: string,
    payload: Pick<CreatePOSOrderDto, 'items' | 'notes'>
  ) {
    const stay = await this.getMyStay(userId);

    if (!stay || !stay.roomUnitId) {
      throw new BadRequestError('Nenhuma hospedagem ativa encontrada para solicitar serviço de quarto');
    }

    const requestedProductIds = [...new Set(payload.items.map((item) => item.productId))];
    const availableProducts = await prisma.pOSProduct.findMany({
      where: {
        id: { in: requestedProductIds },
        isActive: true,
        isRoomServiceEnabled: true,
      },
      select: { id: true },
    });

    if (availableProducts.length !== requestedProductIds.length) {
      throw new BadRequestError('Um ou mais itens não estão disponíveis para serviço de quarto');
    }

    return POSService.createOrder({
      stayId: stay.id,
      roomUnitId: stay.roomUnitId,
      origin: 'ROOM_SERVICE',
      settlementType: POSSettlementType.FOLIO,
      customerName: stay.reservation.guestName,
      notes: payload.notes?.trim() || undefined,
      items: payload.items,
    });
  }

  static async toggleDoNotDisturb(
    userId: string,
    data: ToggleDoNotDisturbDto
  ) {
    const stay = await prisma.stay.findFirst({
      where: {
        status: StayStatus.IN_HOUSE,
        OR: [
          { reservation: { userId } },
          { guests: { some: { userId } } },
        ],
      },
      include: {
        reservation: {
          select: {
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
      orderBy: { actualCheckInAt: 'desc' },
    });

    if (!stay) {
      throw new BadRequestError('Nenhuma hospedagem ativa encontrada para atualizar a sinalização do quarto');
    }

    return prisma.stay.update({
      where: { id: stay.id },
      data: {
        doNotDisturb: data.enabled,
        doNotDisturbNote: data.note?.trim() || null,
        doNotDisturbUpdatedAt: new Date(),
      },
      include: {
        reservation: {
          select: {
            id: true,
            reservationCode: true,
            guestName: true,
            checkInDate: true,
            checkOutDate: true,
          },
        },
        roomUnit: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        folio: {
          select: {
            id: true,
            balance: true,
            isClosed: true,
          },
        },
      },
    });
  }
}
