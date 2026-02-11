import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class AwardService {
  static async getAll() {
    return await prisma.award.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  static async getAllAdmin() {
    return await prisma.award.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async getById(id: string) {
    const award = await prisma.award.findUnique({
      where: { id }
    });

    if (!award) {
      throw new NotFoundError('Prêmio não encontrado');
    }

    return award;
  }

  static async create(data: any) {
    const maxOrder = await prisma.award.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    return await prisma.award.create({
      data: {
        ...data,
        order: maxOrder ? maxOrder.order + 1 : 1
      }
    });
  }

  static async update(id: string, data: any) {
    const award = await this.getById(id);

    return await prisma.award.update({
      where: { id: award.id },
      data
    });
  }

  static async delete(id: string) {
    const award = await this.getById(id);

    await prisma.award.delete({
      where: { id: award.id }
    });
  }

  static async reorder(awardIds: string[]) {
    const updates = awardIds.map((id, index) =>
      prisma.award.update({
        where: { id },
        data: { order: index + 1 }
      })
    );

    await prisma.$transaction(updates);
  }
}
