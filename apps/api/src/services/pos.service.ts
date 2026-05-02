import {
  CashMovementType,
  CashSessionStatus,
  FolioEntrySource,
  FolioEntryType,
  PaymentMethod,
  PaymentStatus,
  POSOrderStatus,
  POSSettlementType,
  StayStatus,
} from '@prisma/client';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import {
  CancelPOSOrderDto,
  CloseCashSessionDto,
  CreateCashMovementDto,
  CreatePOSOrderDto,
  CreatePOSProductDto,
  OpenCashSessionDto,
  RefundPOSPaymentDto,
  RegisterPOSPaymentDto,
  UpdatePOSOrderDto,
  UpdatePOSOrderStatusDto,
} from '../types/pms';


const posOrderInclude = {
  stay: {
    include: {
      reservation: {
        select: {
          reservationCode: true,
          guestName: true,
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
  },
  roomUnit: {
    select: {
      id: true,
      code: true,
      name: true,
    },
  },
  items: true,
  payments: {
    orderBy: { createdAt: 'desc' as const },
  },
};

function buildOrderNumber() {
  return `POS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function buildCashSessionCode() {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CX-${ymd}-${suffix}`;
}

function toDecimal(value?: number | null) {
  return Number(value ?? 0);
}

async function resolveOrderPayload(tx: any, data: CreatePOSOrderDto | UpdatePOSOrderDto) {
  let stayId = data.stayId;
  let roomUnitId = data.roomUnitId;

  if (stayId) {
    const stay = await tx.stay.findUnique({
      where: { id: stayId },
      include: { roomUnit: true, folio: true, reservation: true },
    });

    if (!stay || stay.status !== StayStatus.IN_HOUSE) {
      throw new BadRequestError('Hospedagem não disponível para lançamento');
    }

    roomUnitId = roomUnitId ?? stay.roomUnitId ?? undefined;
  }

  if (!stayId && roomUnitId && data.origin === 'ROOM_SERVICE') {
    const activeStay = await tx.stay.findFirst({
      where: {
        roomUnitId,
        status: StayStatus.IN_HOUSE,
      },
      include: {
        reservation: true,
      },
    });

    if (!activeStay) {
      throw new BadRequestError('Room service exige uma hospedagem ativa no quarto');
    }

    stayId = activeStay.id;
  }

  const settlementType =
    data.settlementType ??
    (data.origin === 'ROOM_SERVICE' || stayId ? POSSettlementType.FOLIO : POSSettlementType.DIRECT);

  if (settlementType === POSSettlementType.FOLIO && !stayId) {
    throw new BadRequestError('Pedidos lançados em fólio exigem uma hospedagem ativa');
  }

  let resolvedCustomerName = data.customerName?.trim();

  if (settlementType === POSSettlementType.FOLIO && stayId) {
    const stay = await tx.stay.findUnique({
      where: { id: stayId },
      include: { reservation: true },
    });

    resolvedCustomerName = resolvedCustomerName || stay?.reservation?.guestName?.trim() || undefined;
  }

  if (settlementType === POSSettlementType.DIRECT && !resolvedCustomerName) {
    throw new BadRequestError('Informe o cliente do pedido');
  }

  const products = await tx.posProduct.findMany({
    where: {
      id: {
        in: data.items.map((item) => item.productId),
      },
      isActive: true,
    },
  });

  if (products.length !== data.items.length) {
    throw new NotFoundError('Um ou mais produtos do pedido não foram encontrados');
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

  const subtotalAmount = itemsPayload.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceFeeAmount = toDecimal(data.serviceFeeAmount);
  const discountAmount = toDecimal(data.discountAmount);
  const totalAmount = Math.max(subtotalAmount + serviceFeeAmount - discountAmount, 0);

  return {
    stayId,
    roomUnitId,
    settlementType,
    resolvedCustomerName,
    itemsPayload,
    subtotalAmount,
    serviceFeeAmount,
    discountAmount,
    totalAmount,
  };
}

function calculateExpectedCash(movements: Array<{ type: CashMovementType; amount: any; method?: PaymentMethod | null }>) {
  return movements.reduce((sum, movement) => {
    const amount = Number(movement.amount ?? 0);

    if (
      movement.type === CashMovementType.OPENING_FLOAT ||
      movement.type === CashMovementType.SUPPLY ||
      movement.type === CashMovementType.WITHDRAWAL ||
      movement.type === CashMovementType.CLOSING_ADJUSTMENT
    ) {
      return sum + amount;
    }

    if (
      (movement.type === CashMovementType.SALE || movement.type === CashMovementType.REFUND) &&
      movement.method === PaymentMethod.CASH
    ) {
      return sum + amount;
    }

    return sum;
  }, 0);
}

async function recalculateFolioBalance(tx: any, folioId: string) {
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

async function recalculateOrderPaidAmount(tx: any, orderId: string) {
  const payments = await tx.posPayment.findMany({
    where: {
      orderId,
      status: {
        in: [PaymentStatus.COMPLETED, PaymentStatus.PARTIALLY_REFUNDED, PaymentStatus.REFUNDED],
      },
    },
    select: {
      amount: true,
      refundedAmount: true,
      status: true,
    },
  });

  const paidAmount = payments.reduce((sum: number, payment: any) => {
    if (payment.status === PaymentStatus.REFUNDED) {
      return sum;
    }

    return sum + Number(payment.amount) - Number(payment.refundedAmount ?? 0);
  }, 0);

  await tx.posOrder.update({
    where: { id: orderId },
    data: { paidAmount },
  });
}

async function adjustOrderStock(tx: any, order: any, mode: 'CONSUME' | 'RESTORE') {
  const sign = mode === 'CONSUME' ? -1 : 1;

  for (const item of order.items) {
    const product = await tx.posProduct.findUnique({
      where: { id: item.productId },
    });

    if (!product?.trackStock) {
      continue;
    }

    const quantity = Number(item.quantity);
    const nextQuantity = Number(product.stockQuantity) + sign * quantity;

    if (nextQuantity < 0) {
      throw new BadRequestError(`Estoque insuficiente para ${product.name}`);
    }

    await tx.posProduct.update({
      where: { id: product.id },
      data: {
        stockQuantity: nextQuantity,
      },
    });

    await tx.inventoryMovement.create({
      data: {
        productId: product.id,
        type: mode === 'CONSUME' ? 'CONSUMPTION' : 'ADJUSTMENT_IN',
        quantity,
        referenceId: order.id,
        notes: mode === 'CONSUME' ? `Consumo do pedido ${order.orderNumber}` : `Reversão do pedido ${order.orderNumber}`,
      },
    });
  }
}

async function postOrderToFolio(tx: any, order: any) {
  if (!order.stay?.folio) {
    throw new BadRequestError('Pedido sem fólio disponível para lançamento');
  }

  const existingEntry = await tx.folioEntry.findFirst({
    where: {
      folioId: order.stay.folio.id,
      referenceId: order.id,
    },
  });

  if (!existingEntry) {
    await tx.folioEntry.create({
      data: {
        folioId: order.stay.folio.id,
        type: order.origin === 'ROOM_SERVICE' ? FolioEntryType.ROOM_SERVICE : FolioEntryType.POS,
        source: FolioEntrySource.POS,
        description: `Pedido ${order.orderNumber} (${order.origin})`,
        amount: Number(order.totalAmount),
        quantity: 1,
        referenceId: order.id,
      },
    });

    await recalculateFolioBalance(tx, order.stay.folio.id);
  }

  await tx.posOrder.update({
    where: { id: order.id },
    data: {
      postedToFolioAt: order.postedToFolioAt ?? new Date(),
    },
  });
}

export class POSService {
  static async listProducts() {
    return prisma.pOSProduct.findMany({
      include: { category: true },
      orderBy: [{ isActive: 'desc' }, { category: { order: 'asc' } }, { name: 'asc' }],
    });
  }

  static async createProduct(data: CreatePOSProductDto) {
    return prisma.pOSProduct.create({
      data: {
        name: data.name.trim(),
        sku: (data as any).sku?.trim(),
        categoryId: data.categoryId,
        image: data.image?.trim() || null,
        price: data.price,
        costPrice: (data as any).costPrice ?? 0,
        stockQuantity: (data as any).stockQuantity ?? 0,
        minStockQuantity: (data as any).minStockQuantity ?? 0,
        saleUnit: (data as any).saleUnit?.trim() || 'UN',
        trackStock: (data as any).trackStock ?? false,
        description: data.description?.trim(),
      },
      include: { category: true },
    });
  }

  static async updateProduct(id: string, data: CreatePOSProductDto) {
    const product = await prisma.pOSProduct.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Produto não encontrado');

    return prisma.pOSProduct.update({
      where: { id },
      data: {
        name: data.name.trim(),
        sku: (data as any).sku?.trim() ?? product.sku,
        categoryId: data.categoryId ?? product.categoryId,
        image: data.image !== undefined ? (data.image?.trim() || null) : product.image,
        price: data.price ?? product.price,
        costPrice: (data as any).costPrice ?? product.costPrice,
        stockQuantity: (data as any).stockQuantity ?? product.stockQuantity,
        minStockQuantity: (data as any).minStockQuantity ?? product.minStockQuantity,
        saleUnit: (data as any).saleUnit?.trim() || product.saleUnit,
        trackStock: (data as any).trackStock ?? product.trackStock,
        isActive: (data as any).isActive ?? product.isActive,
        description: data.description?.trim() ?? product.description,
      },
      include: { category: true },
    });
  }

  static async deleteProduct(id: string) {
    const product = await prisma.pOSProduct.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Produto não encontrado');

    const orderItems = await prisma.pOSOrderItem.findFirst({ where: { productId: id } });
    if (orderItems) {
      return prisma.pOSProduct.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return prisma.pOSProduct.delete({ where: { id } });
  }

  // --- Product Categories ---

  static async listCategories() {
    return prisma.productCategory.findMany({
      orderBy: [{ order: 'asc' }, { label: 'asc' }],
    });
  }

  static async createCategory(data: { slug: string; label: string; color?: string; order?: number }) {
    const existing = await prisma.productCategory.findUnique({ where: { slug: data.slug } });
    if (existing) throw new NotFoundError('Já existe uma categoria com este slug');

    return prisma.productCategory.create({
      data: {
        slug: data.slug.trim().toLowerCase(),
        label: data.label.trim(),
        color: data.color?.trim() || null,
        order: data.order ?? 0,
      },
    });
  }

  static async updateCategory(id: string, data: { slug?: string; label?: string; color?: string; order?: number; isActive?: boolean }) {
    const category = await prisma.productCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Categoria não encontrada');

    return prisma.productCategory.update({
      where: { id },
      data: {
        slug: data.slug?.trim().toLowerCase() ?? category.slug,
        label: data.label?.trim() ?? category.label,
        color: data.color !== undefined ? (data.color?.trim() || null) : category.color,
        order: data.order ?? category.order,
        isActive: data.isActive ?? category.isActive,
      },
    });
  }

  static async deleteCategory(id: string) {
    const category = await prisma.productCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Categoria não encontrada');

    const productsCount = await prisma.pOSProduct.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return prisma.productCategory.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return prisma.productCategory.delete({ where: { id } });
  }

  static async listOrders() {
    return prisma.pOSOrder.findMany({
      include: posOrderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getActiveCashSession() {
    return prisma.cashSession.findFirst({
      where: {
        status: CashSessionStatus.OPEN,
      },
      include: {
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
      orderBy: { openedAt: 'desc' },
    });
  }

  static async listCashSessions() {
    return prisma.cashSession.findMany({
      include: {
        movements: {
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { openedAt: 'desc' },
      take: 20,
    });
  }

  static async openCashSession(data: OpenCashSessionDto, user?: { id?: string; email?: string }) {
    const existing = await prisma.cashSession.findFirst({
      where: { status: CashSessionStatus.OPEN },
    });

    if (existing) {
      throw new BadRequestError('Já existe um caixa aberto');
    }

    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      const session = await txPms.cashSession.create({
        data: {
          code: buildCashSessionCode(),
          openingFloat: toDecimal(data.openingFloat),
          notes: data.notes?.trim(),
          openedByUserId: user?.id,
          openedByEmail: user?.email,
        },
      });

      if (toDecimal(data.openingFloat) > 0) {
        await txPms.cashMovement.create({
          data: {
            cashSessionId: session.id,
            type: CashMovementType.OPENING_FLOAT,
            amount: toDecimal(data.openingFloat),
            description: 'Fundo de caixa inicial',
            method: PaymentMethod.CASH,
            performedByUserId: user?.id,
            performedByEmail: user?.email,
          },
        });
      }

      return txPms.cashSession.findUnique({
        where: { id: session.id },
        include: {
          movements: true,
          payments: true,
        },
      });
    });
  }

  static async closeCashSession(data: CloseCashSessionDto, user?: { id?: string; email?: string }) {
    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      const session = await txPms.cashSession.findFirst({
        where: { status: CashSessionStatus.OPEN },
        include: { movements: true },
      });

      if (!session) {
        throw new NotFoundError('Nenhum caixa aberto');
      }

      const expectedCashAmount = calculateExpectedCash(session.movements);
      const countedCashAmount = Number(data.countedCashAmount);
      const differenceAmount = countedCashAmount - expectedCashAmount;

      if (differenceAmount !== 0) {
        await txPms.cashMovement.create({
          data: {
            cashSessionId: session.id,
            type: CashMovementType.CLOSING_ADJUSTMENT,
            amount: differenceAmount,
            description: 'Ajuste de fechamento de caixa',
            method: PaymentMethod.CASH,
            performedByUserId: user?.id,
            performedByEmail: user?.email,
          },
        });
      }

      return txPms.cashSession.update({
        where: { id: session.id },
        data: {
          status: CashSessionStatus.CLOSED,
          expectedCashAmount,
          countedCashAmount,
          differenceAmount,
          notes: data.notes?.trim() ?? session.notes,
          closedByUserId: user?.id,
          closedByEmail: user?.email,
          closedAt: new Date(),
        },
        include: {
          movements: {
            orderBy: { createdAt: 'desc' },
          },
          payments: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });
  }

  static async createCashMovement(data: CreateCashMovementDto, user?: { id?: string; email?: string }) {
    const session = await prisma.cashSession.findFirst({
      where: { status: CashSessionStatus.OPEN },
    });

    if (!session) {
      throw new BadRequestError('Abra um caixa antes de registrar movimentações');
    }

    const signedAmount =
      data.type === 'WITHDRAWAL'
        ? -Math.abs(Number(data.amount))
        : Number(data.amount);

    return prisma.cashMovement.create({
      data: {
        cashSessionId: session.id,
        type: data.type,
        amount: signedAmount,
        description: data.description.trim(),
        method: data.method ?? PaymentMethod.CASH,
        performedByUserId: user?.id,
        performedByEmail: user?.email,
      },
    });
  }

  static async createOrder(data: CreatePOSOrderDto) {
    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      const {
        stayId,
        roomUnitId,
        settlementType,
        resolvedCustomerName,
        itemsPayload,
        subtotalAmount,
        serviceFeeAmount,
        discountAmount,
        totalAmount,
      } = await resolveOrderPayload(txPms, data);

      return txPms.posOrder.create({
        data: {
          orderNumber: buildOrderNumber(),
          stayId,
          roomUnitId,
          origin: data.origin,
          settlementType,
          customerName: resolvedCustomerName,
          tableNumber: data.tableNumber?.trim(),
          notes: data.notes?.trim(),
          subtotalAmount,
          serviceFeeAmount,
          discountAmount,
          totalAmount,
          items: {
            create: itemsPayload,
          },
        },
        include: posOrderInclude,
      });
    });
  }

  static async updateOrder(id: string, data: UpdatePOSOrderDto) {
    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      const order = await txPms.posOrder.findUnique({
        where: { id },
        include: {
          items: true,
          payments: true,
          stay: {
            include: {
              folio: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundError('Pedido n?o encontrado');
      }

      if (order.status === POSOrderStatus.CANCELLED || order.status === POSOrderStatus.CLOSED) {
        throw new BadRequestError('Somente pedidos em aberto podem ser editados');
      }

      if (order.status === POSOrderStatus.DELIVERED) {
        throw new BadRequestError('Pedidos j? entregues n?o podem ser reabertos para edi??o');
      }

      if (Number(order.paidAmount) > 0 || order.payments.length > 0) {
        throw new BadRequestError('Pedidos com pagamento registrado n?o podem ser editados');
      }

      if (order.postedToFolioAt) {
        throw new BadRequestError('Pedidos j? lan?ados em f?lio n?o podem ser editados');
      }

      const {
        stayId,
        roomUnitId,
        settlementType,
        resolvedCustomerName,
        itemsPayload,
        subtotalAmount,
        serviceFeeAmount,
        discountAmount,
        totalAmount,
      } = await resolveOrderPayload(txPms, data);

      return txPms.posOrder.update({
        where: { id },
        data: {
          stayId,
          roomUnitId,
          origin: data.origin,
          settlementType,
          customerName: resolvedCustomerName,
          tableNumber: data.tableNumber?.trim(),
          notes: data.notes?.trim(),
          subtotalAmount,
          serviceFeeAmount,
          discountAmount,
          totalAmount,
          items: {
            deleteMany: {},
            create: itemsPayload,
          },
        },
        include: posOrderInclude,
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
          payments: true,
        },
      });

      if (!order) {
        throw new NotFoundError('Pedido não encontrado');
      }

      if (order.status === POSOrderStatus.CANCELLED) {
        throw new BadRequestError('Pedido cancelado não pode ser alterado');
      }

      if (data.status === POSOrderStatus.CANCELLED) {
        throw new BadRequestError('Use o cancelamento do pedido para encerrar esta operação');
      }

      if (data.status === POSOrderStatus.CLOSED) {
        if (order.settlementType === POSSettlementType.DIRECT && Number(order.paidAmount) < Number(order.totalAmount)) {
          throw new BadRequestError('Pedido ainda possui saldo pendente');
        }

        if (order.settlementType === POSSettlementType.FOLIO) {
          await postOrderToFolio(tx, order);
        }
      }

      const finalStatuses = [POSOrderStatus.DELIVERED, POSOrderStatus.CLOSED] as POSOrderStatus[];

      if (
        finalStatuses.includes(data.status) &&
        !finalStatuses.includes(order.status as POSOrderStatus)
      ) {
        await adjustOrderStock(txPms, order, 'CONSUME');
      }

      if (data.status === POSOrderStatus.DELIVERED && order.settlementType === POSSettlementType.FOLIO) {
        await postOrderToFolio(tx, order);
      }

      return txPms.posOrder.update({
        where: { id },
        data: {
          status: data.status,
          closedAt: data.status === POSOrderStatus.CLOSED ? new Date() : order.closedAt,
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
              folio: {
                select: {
                  id: true,
                  balance: true,
                  isClosed: true,
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
          payments: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });
  }

  static async registerPayment(data: RegisterPOSPaymentDto, user?: { id?: string; email?: string }) {
    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      const order = await txPms.posOrder.findUnique({
        where: { id: data.orderId },
        include: {
          payments: true,
        },
      });

      if (!order) {
        throw new NotFoundError('Pedido não encontrado');
      }

      if (order.status === POSOrderStatus.CANCELLED) {
        throw new BadRequestError('Não é possível receber um pedido cancelado');
      }

      if (order.settlementType !== POSSettlementType.DIRECT) {
        throw new BadRequestError('Pedidos lançados em fólio não recebem pagamento direto no PDV');
      }

      const remainingAmount = Number(order.totalAmount) - Number(order.paidAmount);
      const amount = Number(data.amount);

      if (amount > remainingAmount + 0.001) {
        throw new BadRequestError('Valor informado é maior que o saldo do pedido');
      }

      let cashSessionId = data.cashSessionId;
      if (!cashSessionId) {
        const activeCashSession = await txPms.cashSession.findFirst({
          where: { status: CashSessionStatus.OPEN },
        });
        cashSessionId = activeCashSession?.id;
      }

      if (!cashSessionId) {
        throw new BadRequestError('Abra um caixa antes de registrar pagamentos');
      }

      const payment = await txPms.posPayment.create({
        data: {
          orderId: order.id,
          cashSessionId,
          amount,
          refundedAmount: 0,
          method: data.method,
          status: PaymentStatus.COMPLETED,
          transactionId: data.transactionId?.trim(),
          reference: data.reference?.trim(),
          gateway: data.gateway?.trim(),
          notes: data.notes?.trim(),
          paidAt: new Date(),
          createdByUserId: user?.id,
          createdByEmail: user?.email,
        },
      });

      await txPms.cashMovement.create({
        data: {
          cashSessionId,
          orderId: order.id,
          paymentId: payment.id,
          type: CashMovementType.SALE,
          method: data.method,
          amount,
          description: `Recebimento do pedido ${order.orderNumber}`,
          performedByUserId: user?.id,
          performedByEmail: user?.email,
        },
      });

      await recalculateOrderPaidAmount(txPms, order.id);

      return txPms.posOrder.findUnique({
        where: { id: order.id },
        include: {
          stay: {
            include: {
              reservation: {
                select: {
                  reservationCode: true,
                  guestName: true,
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
          },
          roomUnit: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          items: true,
          payments: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });
  }

  static async refundPayment(data: RefundPOSPaymentDto, user?: { id?: string; email?: string }) {
    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      const payment = await txPms.posPayment.findUnique({
        where: { id: data.paymentId },
        include: {
          order: true,
        },
      });

      if (!payment) {
        throw new NotFoundError('Pagamento não encontrado');
      }

      if (payment.status === PaymentStatus.REFUNDED) {
        throw new BadRequestError('Pagamento já estornado');
      }

      const refundAmount = Number(data.amount ?? payment.amount);
      if (refundAmount > Number(payment.amount)) {
        throw new BadRequestError('Valor de estorno maior que o valor pago');
      }

      const cumulativeRefund = Number(payment.refundedAmount ?? 0) + refundAmount;
      if (cumulativeRefund > Number(payment.amount)) {
        throw new BadRequestError('O estorno acumulado ultrapassa o valor pago');
      }

      const nextStatus =
        cumulativeRefund < Number(payment.amount) ? PaymentStatus.PARTIALLY_REFUNDED : PaymentStatus.REFUNDED;

      await txPms.posPayment.update({
        where: { id: payment.id },
        data: {
          status: nextStatus,
          refundedAmount: cumulativeRefund,
          refundedAt: new Date(),
          notes: data.notes?.trim() ?? payment.notes,
        },
      });

      if (payment.cashSessionId) {
        await txPms.cashMovement.create({
          data: {
            cashSessionId: payment.cashSessionId,
            orderId: payment.orderId,
            paymentId: payment.id,
            type: CashMovementType.REFUND,
            method: payment.method,
            amount: -Math.abs(refundAmount),
            description: `Estorno do pedido ${payment.order.orderNumber}`,
            performedByUserId: user?.id,
            performedByEmail: user?.email,
          },
        });
      }

      await recalculateOrderPaidAmount(txPms, payment.orderId);

      return txPms.posOrder.findUnique({
        where: { id: payment.orderId },
        include: {
          stay: {
            include: {
              reservation: {
                select: {
                  reservationCode: true,
                  guestName: true,
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
          },
          roomUnit: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          items: true,
          payments: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });
  }

  static async cancelOrder(id: string, data: CancelPOSOrderDto, user?: { id?: string; email?: string }) {
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
          payments: true,
        },
      });

      if (!order) {
        throw new NotFoundError('Pedido não encontrado');
      }

      if (order.status === POSOrderStatus.CANCELLED) {
        throw new BadRequestError('Pedido já cancelado');
      }

      const activePayments = order.payments.filter(
        (payment: any) => payment.status === PaymentStatus.COMPLETED || payment.status === PaymentStatus.PARTIALLY_REFUNDED
      );

      if (activePayments.length > 0 && !data.refundPayments) {
        throw new BadRequestError('Este pedido possui pagamentos e exige estorno antes do cancelamento');
      }

      if (data.refundPayments) {
        for (const payment of activePayments) {
          const refundAmount = Number(payment.amount);

          await txPms.posPayment.update({
            where: { id: payment.id },
            data: {
              status: PaymentStatus.REFUNDED,
              refundedAmount: payment.amount,
              refundedAt: new Date(),
            },
          });

          if (payment.cashSessionId) {
            await txPms.cashMovement.create({
              data: {
                cashSessionId: payment.cashSessionId,
                orderId: order.id,
                paymentId: payment.id,
                type: CashMovementType.REFUND,
                method: payment.method,
                amount: -Math.abs(refundAmount),
                description: `Estorno de cancelamento do pedido ${order.orderNumber}`,
                performedByUserId: user?.id,
                performedByEmail: user?.email,
              },
            });
          }
        }

        await recalculateOrderPaidAmount(txPms, order.id);
      }

      if (order.postedToFolioAt && order.stay?.folio) {
        const reversalRef = `refund:${order.id}`;
        const existingReversal = await tx.folioEntry.findFirst({
          where: {
            folioId: order.stay.folio.id,
            referenceId: reversalRef,
          },
        });

        if (!existingReversal) {
          await tx.folioEntry.create({
            data: {
              folioId: order.stay.folio.id,
              type: FolioEntryType.REFUND,
              source: FolioEntrySource.POS,
              description: `Estorno do pedido ${order.orderNumber}`,
              amount: -Math.abs(Number(order.totalAmount)),
              quantity: 1,
              referenceId: reversalRef,
            },
          });

          await recalculateFolioBalance(tx, order.stay.folio.id);
        }
      }

      if (([POSOrderStatus.DELIVERED, POSOrderStatus.CLOSED] as POSOrderStatus[]).includes(order.status as POSOrderStatus)) {
        await adjustOrderStock(txPms, order, 'RESTORE');
      }

      return txPms.posOrder.update({
        where: { id: order.id },
        data: {
          status: POSOrderStatus.CANCELLED,
          cancellationReason: data.reason.trim(),
          cancelledAt: new Date(),
          closedAt: order.closedAt ?? new Date(),
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
              folio: {
                select: {
                  id: true,
                  balance: true,
                  isClosed: true,
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
          payments: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });
  }
}
