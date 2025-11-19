import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class UserService {
  static async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        cpf: true,
        role: true,
        isActive: true,
        emailVerified: true,
        profileImage: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user;
  }

  static async list(filters: any) {
    return prisma.user.findMany({
      where: {
        role: filters.role,
        isActive: filters.isActive !== undefined ? filters.isActive === 'true' : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async update(id: string, data: any) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        profileImage: data.profileImage,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        profileImage: true,
      }
    });

    return user;
  }

  static async delete(id: string) {
    await prisma.user.delete({ where: { id } });
  }
}
