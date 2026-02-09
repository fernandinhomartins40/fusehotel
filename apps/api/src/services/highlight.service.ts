import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class HighlightService {
  static async getAll() {
    return await prisma.highlightItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  static async getAllAdmin() {
    return await prisma.highlightItem.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async getById(id: string) {
    const highlight = await prisma.highlightItem.findUnique({
      where: { id }
    });

    if (!highlight) {
      throw new NotFoundError('Destaque não encontrado');
    }

    return highlight;
  }

  static async create(data: any) {
    const maxOrder = await prisma.highlightItem.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    return await prisma.highlightItem.create({
      data: {
        ...data,
        order: maxOrder ? maxOrder.order + 1 : 1
      }
    });
  }

  static async update(id: string, data: any) {
    const highlight = await this.getById(id);

    return await prisma.highlightItem.update({
      where: { id: highlight.id },
      data
    });
  }

  static async delete(id: string) {
    const highlight = await this.getById(id);

    await prisma.highlightItem.delete({
      where: { id: highlight.id }
    });
  }

  static async reorder(highlightIds: string[]) {
    const updates = highlightIds.map((id, index) =>
      prisma.highlightItem.update({
        where: { id },
        data: { order: index + 1 }
      })
    );

    await prisma.$transaction(updates);
  }
}
