import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateFAQItemDTO {
  categoryId: string;
  question: string;
  answer: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateFAQItemDTO {
  categoryId?: string;
  question?: string;
  answer?: string;
  order?: number;
  isActive?: boolean;
}

class FAQItemService {
  async create(data: CreateFAQItemDTO) {
    const maxOrder = await prisma.fAQItem.findFirst({
      where: { categoryId: data.categoryId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    return prisma.fAQItem.create({
      data: {
        ...data,
        order: data.order ?? (maxOrder?.order ?? 0) + 1,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll() {
    return prisma.fAQItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        category: true,
      },
    });
  }

  async findAllAdmin() {
    return prisma.fAQItem.findMany({
      orderBy: { order: 'asc' },
      include: {
        category: true,
      },
    });
  }

  async findByCategoryId(categoryId: string) {
    return prisma.fAQItem.findMany({
      where: {
        categoryId,
        isActive: true
      },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.fAQItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, data: UpdateFAQItemDTO) {
    return prisma.fAQItem.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.fAQItem.delete({
      where: { id },
    });
  }

  async reorder(items: { id: string; order: number }[]) {
    const operations = items.map((item) =>
      prisma.fAQItem.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );

    return prisma.$transaction(operations);
  }
}

export default new FAQItemService();
