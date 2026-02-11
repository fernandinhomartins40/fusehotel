import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { ServiceCategory } from '@prisma/client';

export class ServiceItemService {
  static async getAll() {
    return await prisma.serviceItem.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });
  }

  static async getAllAdmin() {
    return await prisma.serviceItem.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });
  }

  static async getByCategory(category: ServiceCategory) {
    return await prisma.serviceItem.findMany({
      where: {
        category,
        isActive: true
      },
      orderBy: { order: 'asc' }
    });
  }

  static async getByCategoryAdmin(category: ServiceCategory) {
    return await prisma.serviceItem.findMany({
      where: { category },
      orderBy: { order: 'asc' }
    });
  }

  static async getById(id: string) {
    const serviceItem = await prisma.serviceItem.findUnique({
      where: { id }
    });

    if (!serviceItem) {
      throw new NotFoundError('Item de serviço não encontrado');
    }

    return serviceItem;
  }

  static async create(data: any) {
    const maxOrder = await prisma.serviceItem.findFirst({
      where: { category: data.category },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    return await prisma.serviceItem.create({
      data: {
        ...data,
        order: maxOrder ? maxOrder.order + 1 : 1
      }
    });
  }

  static async update(id: string, data: any) {
    const serviceItem = await this.getById(id);

    return await prisma.serviceItem.update({
      where: { id: serviceItem.id },
      data
    });
  }

  static async delete(id: string) {
    const serviceItem = await this.getById(id);

    await prisma.serviceItem.delete({
      where: { id: serviceItem.id }
    });
  }

  static async reorder(serviceItemIds: string[]) {
    const updates = serviceItemIds.map((id, index) =>
      prisma.serviceItem.update({
        where: { id },
        data: { order: index + 1 }
      })
    );

    await prisma.$transaction(updates);
  }
}
