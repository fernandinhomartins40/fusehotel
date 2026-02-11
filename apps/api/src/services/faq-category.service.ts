import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateFAQCategoryDTO {
  name: string;
  order: number;
  isActive?: boolean;
}

export interface UpdateFAQCategoryDTO {
  name?: string;
  order?: number;
  isActive?: boolean;
}

class FAQCategoryService {
  async create(data: CreateFAQCategoryDTO) {
    const maxOrder = await prisma.fAQCategory.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    return prisma.fAQCategory.create({
      data: {
        ...data,
        order: data.order ?? (maxOrder?.order ?? 0) + 1,
      },
    });
  }

  async findAll() {
    return prisma.fAQCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAllAdmin() {
    return prisma.fAQCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.fAQCategory.findUnique({
      where: { id },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(id: string, data: UpdateFAQCategoryDTO) {
    return prisma.fAQCategory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.fAQCategory.delete({
      where: { id },
    });
  }

  async reorder(items: { id: string; order: number }[]) {
    const operations = items.map((item) =>
      prisma.fAQCategory.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );

    return prisma.$transaction(operations);
  }
}

export default new FAQCategoryService();
