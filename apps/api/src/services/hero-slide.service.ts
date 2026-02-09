import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class HeroSlideService {
  static async getAll() {
    return await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  static async getAllAdmin() {
    return await prisma.heroSlide.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async getById(id: string) {
    const slide = await prisma.heroSlide.findUnique({
      where: { id }
    });

    if (!slide) {
      throw new NotFoundError('Slide não encontrado');
    }

    return slide;
  }

  static async create(data: any) {
    const maxOrder = await prisma.heroSlide.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    return await prisma.heroSlide.create({
      data: {
        ...data,
        order: maxOrder ? maxOrder.order + 1 : 1
      }
    });
  }

  static async update(id: string, data: any) {
    const slide = await this.getById(id);

    return await prisma.heroSlide.update({
      where: { id: slide.id },
      data
    });
  }

  static async delete(id: string) {
    const slide = await this.getById(id);

    await prisma.heroSlide.delete({
      where: { id: slide.id }
    });
  }

  static async reorder(slideIds: string[]) {
    const updates = slideIds.map((id, index) =>
      prisma.heroSlide.update({
        where: { id },
        data: { order: index + 1 }
      })
    );

    await prisma.$transaction(updates);
  }
}
