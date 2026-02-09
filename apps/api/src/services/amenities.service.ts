import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class AmenityService {
  static async list() {
    return prisma.amenity.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
  }

  static async getById(id: string) {
    const amenity = await prisma.amenity.findUnique({
      where: { id }
    });

    if (!amenity) {
      throw new NotFoundError('Amenidade não encontrada');
    }

    return amenity;
  }

  static async create(data: {
    name: string;
    icon: string;
    category: string;
    description?: string;
  }) {
    return prisma.amenity.create({
      data: {
        name: data.name,
        icon: data.icon,
        category: data.category as any,
        description: data.description || null
      }
    });
  }

  static async update(id: string, data: {
    name?: string;
    icon?: string;
    category?: string;
    description?: string;
  }) {
    await this.getById(id);

    return prisma.amenity.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon,
        category: data.category as any,
        description: data.description
      }
    });
  }

  static async delete(id: string) {
    await this.getById(id);
    await prisma.amenity.delete({ where: { id } });
  }
}
