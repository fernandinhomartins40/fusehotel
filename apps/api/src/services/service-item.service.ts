import { Prisma, ServiceCategory } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

const defaultCategoryByServicePage: Record<ServiceCategory, string> = {
  ACCOMMODATION: 'SERVICE',
  GASTRONOMY: 'FOOD',
  RECREATION: 'SERVICE',
  BUSINESS: 'SERVICE',
  SPECIAL: 'CONVENIENCE',
};

function mapProductToServiceItem(product: any) {
  return {
    id: product.id,
    category: product.servicesPageCategory,
    title: product.name,
    subtitle: product.servicesPageSubtitle,
    description: product.description ?? '',
    image: product.image ?? '',
    icon: null,
    features: product.servicesPageFeatures ?? [],
    order: product.servicesPageOrder ?? 0,
    price: product.price != null ? Number(product.price) : null,
    isChargeable: Number(product.price ?? 0) > 0,
    isActive: product.isActive,
  };
}

async function resolveOperationalCategoryId(category: ServiceCategory) {
  const preferredSlug = defaultCategoryByServicePage[category];
  const preferred = await prisma.productCategory.findFirst({
    where: {
      slug: preferredSlug,
      isActive: true,
    },
  });

  if (preferred) {
    return preferred.id;
  }

  const fallback = await prisma.productCategory.findFirst({
    where: { isActive: true },
    orderBy: [{ order: 'asc' }, { label: 'asc' }],
  });

  if (!fallback) {
    throw new NotFoundError('Cadastre ao menos uma categoria operacional para publicar serviços');
  }

  return fallback.id;
}

async function getNextOrder(category: ServiceCategory) {
  const current = await prisma.pOSProduct.findFirst({
    where: {
      showOnServicesPage: true,
      servicesPageCategory: category,
    },
    orderBy: {
      servicesPageOrder: 'desc',
    },
    select: {
      servicesPageOrder: true,
    },
  });

  return Number(current?.servicesPageOrder ?? 0) + 1;
}

export class ServiceItemService {
  private static baseWhere(isAdmin = false): Prisma.POSProductWhereInput {
    return {
      showOnServicesPage: true,
      servicesPageCategory: { not: null },
      ...(isAdmin ? {} : { isActive: true }),
    };
  }

  static async getAll() {
    const products = await prisma.pOSProduct.findMany({
      where: this.baseWhere(false),
      orderBy: [
        { servicesPageCategory: 'asc' },
        { servicesPageOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return products.map(mapProductToServiceItem);
  }

  static async getAllAdmin() {
    const products = await prisma.pOSProduct.findMany({
      where: this.baseWhere(true),
      include: {
        category: true,
      },
      orderBy: [
        { servicesPageCategory: 'asc' },
        { servicesPageOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return products.map(mapProductToServiceItem);
  }

  static async getByCategory(category: ServiceCategory) {
    const products = await prisma.pOSProduct.findMany({
      where: {
        ...this.baseWhere(false),
        servicesPageCategory: category,
      },
      orderBy: [{ servicesPageOrder: 'asc' }, { name: 'asc' }],
    });

    return products.map(mapProductToServiceItem);
  }

  static async getByCategoryAdmin(category: ServiceCategory) {
    const products = await prisma.pOSProduct.findMany({
      where: {
        ...this.baseWhere(true),
        servicesPageCategory: category,
      },
      orderBy: [{ servicesPageOrder: 'asc' }, { name: 'asc' }],
    });

    return products.map(mapProductToServiceItem);
  }

  static async getById(id: string) {
    const product = await prisma.pOSProduct.findFirst({
      where: {
        id,
        servicesPageCategory: { not: null },
      },
    });

    if (!product) {
      throw new NotFoundError('Item de serviço não encontrado');
    }

    return mapProductToServiceItem(product);
  }

  static async create(data: any) {
    const category = data.category as ServiceCategory;
    const categoryId = await resolveOperationalCategoryId(category);
    const order = await getNextOrder(category);

    const product = await prisma.pOSProduct.create({
      data: {
        name: data.title.trim(),
        categoryId,
        image: data.image?.trim() || null,
        price: Number(data.price ?? 0),
        costPrice: 0,
        stockQuantity: 0,
        minStockQuantity: 0,
        saleUnit: 'UN',
        trackStock: false,
        isActive: data.isActive ?? true,
        description: data.description?.trim() || '',
        showOnServicesPage: true,
        servicesPageCategory: category,
        servicesPageOrder: order,
        servicesPageSubtitle: data.subtitle?.trim() || null,
        servicesPageFeatures: Array.isArray(data.features)
          ? data.features.map((item: string) => item.trim()).filter(Boolean)
          : [],
      },
    });

    return mapProductToServiceItem(product);
  }

  static async update(id: string, data: any) {
    const product = await prisma.pOSProduct.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundError('Item de serviço não encontrado');
    }

    const nextCategory = (data.category as ServiceCategory | undefined) ?? product.servicesPageCategory;
    const order =
      nextCategory && nextCategory !== product.servicesPageCategory
        ? await getNextOrder(nextCategory)
        : product.servicesPageOrder;

    const updated = await prisma.pOSProduct.update({
      where: { id },
      data: {
        name: data.title !== undefined ? data.title.trim() : product.name,
        image: data.image !== undefined ? data.image?.trim() || null : product.image,
        price: data.price !== undefined && data.price !== null ? Number(data.price) : product.price,
        description: data.description !== undefined ? data.description?.trim() || '' : product.description,
        isActive: data.isActive ?? product.isActive,
        showOnServicesPage: true,
        servicesPageCategory: nextCategory,
        servicesPageOrder: order,
        servicesPageSubtitle:
          data.subtitle !== undefined ? data.subtitle?.trim() || null : product.servicesPageSubtitle,
        servicesPageFeatures:
          data.features !== undefined
            ? Array.isArray(data.features)
              ? data.features.map((item: string) => item.trim()).filter(Boolean)
              : []
            : product.servicesPageFeatures,
      },
    });

    return mapProductToServiceItem(updated);
  }

  static async delete(id: string) {
    const product = await prisma.pOSProduct.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundError('Item de serviço não encontrado');
    }

    await prisma.pOSProduct.update({
      where: { id },
      data: {
        showOnServicesPage: false,
        servicesPageCategory: null,
        servicesPageOrder: null,
        servicesPageSubtitle: null,
        servicesPageFeatures: [],
      },
    });
  }

  static async reorder(serviceItemIds: string[]) {
    const products = await prisma.pOSProduct.findMany({
      where: {
        id: { in: serviceItemIds },
        showOnServicesPage: true,
        servicesPageCategory: { not: null },
      },
      select: {
        id: true,
        servicesPageCategory: true,
      },
    });

    const categoryById = new Map(products.map((item) => [item.id, item.servicesPageCategory]));

    const updates = serviceItemIds
      .filter((id) => categoryById.has(id))
      .map((id, index) =>
        prisma.pOSProduct.update({
          where: { id },
          data: { servicesPageOrder: index + 1 },
        })
      );

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }
  }
}
