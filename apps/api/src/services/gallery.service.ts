import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class GalleryService {
  static async getAll() {
    return await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  static async getAllAdmin() {
    return await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' }
    });
  }

  static async getById(id: string) {
    const image = await prisma.galleryImage.findUnique({
      where: { id }
    });

    if (!image) {
      throw new NotFoundError('Imagem não encontrada');
    }

    return image;
  }

  static async create(data: any) {
    const maxOrder = await prisma.galleryImage.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    return await prisma.galleryImage.create({
      data: {
        ...data,
        order: maxOrder ? maxOrder.order + 1 : 1
      }
    });
  }

  static async update(id: string, data: any) {
    const image = await this.getById(id);

    return await prisma.galleryImage.update({
      where: { id: image.id },
      data
    });
  }

  static async delete(id: string) {
    const image = await this.getById(id);

    await prisma.galleryImage.delete({
      where: { id: image.id }
    });
  }

  static async reorder(imageIds: string[]) {
    const updates = imageIds.map((id, index) =>
      prisma.galleryImage.update({
        where: { id },
        data: { order: index + 1 }
      })
    );

    await prisma.$transaction(updates);
  }
}
