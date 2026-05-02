import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';


export class InventoryService {
  static async listProducts() {
    const products = await prisma.pOSProduct.findMany({
      include: {
        inventoryMovements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });

    return {
      products,
      alerts: products.filter(
        (product: any) => product.trackStock && Number(product.stockQuantity) <= Number(product.minStockQuantity)
      ),
    };
  }

  static async createMovement(data: any, user?: { id?: string; email?: string }) {
    const product = await prisma.pOSProduct.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundError('Produto não encontrado');
    }

    const quantity = Number(data.quantity);

    if (quantity <= 0) {
      throw new BadRequestError('A quantidade deve ser maior que zero');
    }

    const incrementTypes = ['PURCHASE_IN', 'TRANSFER_IN', 'ADJUSTMENT_IN'];
    const signedQuantity = incrementTypes.includes(data.type) ? quantity : -quantity;
    const nextQuantity = Number(product.stockQuantity) + signedQuantity;

    if (nextQuantity < 0) {
      throw new BadRequestError('Estoque insuficiente para esta movimentação');
    }

    return prisma.$transaction(async (tx) => {
      const txPms = tx as any;
      const updatedProduct = await txPms.posProduct.update({
        where: { id: data.productId },
        data: {
          stockQuantity: nextQuantity,
          costPrice: data.unitCost ?? undefined,
        },
      });

      const movement = await txPms.inventoryMovement.create({
        data: {
          productId: data.productId,
          type: data.type,
          quantity,
          unitCost: data.unitCost,
          referenceId: data.referenceId,
          notes: data.notes?.trim(),
          createdByUserId: user?.id,
          createdByEmail: user?.email,
        },
      });

      return {
        movement,
        product: updatedProduct,
      };
    });
  }
}
