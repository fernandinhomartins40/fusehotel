import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class PartnerService {
  static async getAll() {
    return await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  static async getAllAdmin() {
    return await prisma.partner.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async getById(id: string) {
    const partner = await prisma.partner.findUnique({
      where: { id }
    });

    if (!partner) {
      throw new NotFoundError('Parceiro não encontrado');
    }

    return partner;
  }

  static async create(data: any) {
    const maxOrder = await prisma.partner.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    return await prisma.partner.create({
      data: {
        ...data,
        order: maxOrder ? maxOrder.order + 1 : 1
      }
    });
  }

  static async update(id: string, data: any) {
    const partner = await this.getById(id);

    return await prisma.partner.update({
      where: { id: partner.id },
      data
    });
  }

  static async delete(id: string) {
    const partner = await this.getById(id);

    await prisma.partner.delete({
      where: { id: partner.id }
    });
  }

  static async reorder(partnerIds: string[]) {
    const updates = partnerIds.map((id, index) =>
      prisma.partner.update({
        where: { id },
        data: { order: index + 1 }
      })
    );

    await prisma.$transaction(updates);
  }
}
