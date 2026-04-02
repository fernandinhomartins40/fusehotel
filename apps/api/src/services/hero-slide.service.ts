import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

const DEFAULT_HERO_SOLID_COLOR = '#6E59A5';

function normalizeHeroColor(value: unknown, fallback = DEFAULT_HERO_SOLID_COLOR) {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (
    normalized === '#0466c8' ||
    normalized === 'hsl(var(--primary))' ||
    normalized.includes('gradient') ||
    normalized.includes('url(')
  ) {
    return fallback;
  }

  return value;
}

function isGradientValue(value: unknown) {
  return typeof value === 'string' && value.includes('gradient');
}

function normalizeHeroSlideData(data: any) {
  const backgroundType = data.backgroundType === 'image' ? 'image' : 'color';
  const overlayColor = normalizeHeroColor(data.overlayColor);

  if (backgroundType === 'image') {
    return {
      ...data,
      backgroundType,
      overlayColor,
      backgroundValue:
        typeof data.backgroundValue === 'string' && !isGradientValue(data.backgroundValue)
          ? data.backgroundValue
          : '',
    };
  }

  return {
    ...data,
    backgroundType,
    overlayColor,
    backgroundValue:
      typeof data.backgroundValue === 'string' && !isGradientValue(data.backgroundValue)
        ? normalizeHeroColor(data.backgroundValue, overlayColor)
        : overlayColor,
  };
}

export class HeroSlideService {
  static async getAll() {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return slides.map((slide) => normalizeHeroSlideData(slide));
  }

  static async getAllAdmin() {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: 'asc' }
    });

    return slides.map((slide) => normalizeHeroSlideData(slide));
  }

  static async getById(id: string) {
    const slide = await prisma.heroSlide.findUnique({
      where: { id }
    });

    if (!slide) {
      throw new NotFoundError('Slide não encontrado');
    }

    return normalizeHeroSlideData(slide);
  }

  static async create(data: any) {
    const maxOrder = await prisma.heroSlide.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });
    const normalizedData = normalizeHeroSlideData(data);
    const writableData = { ...normalizedData };
    delete writableData.id;
    delete writableData.createdAt;
    delete writableData.updatedAt;

    return await prisma.heroSlide.create({
      data: {
        ...writableData,
        order: maxOrder ? maxOrder.order + 1 : 1
      }
    });
  }

  static async update(id: string, data: any) {
    const slide = await this.getById(id);
    const normalizedData = normalizeHeroSlideData({ ...slide, ...data });
    const writableData = { ...normalizedData };
    delete writableData.id;
    delete writableData.createdAt;
    delete writableData.updatedAt;

    return await prisma.heroSlide.update({
      where: { id: slide.id },
      data: writableData
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
