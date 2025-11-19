/**
 * Users Service
 *
 * Serviço de gerenciamento de usuários
 */

import { prisma } from '../config/database';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import logger from '../utils/logger';
import { User, UserRole } from '@prisma/client';

/**
 * Interface de dados para atualização de usuário
 */
export interface UpdateUserData {
  name?: string;
  phone?: string;
  profileImage?: string;
  preferences?: any;
}

/**
 * Interface de filtros de busca
 */
export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
  search?: string;
}

/**
 * Service de usuários
 */
export class UsersService {
  /**
   * Lista todos os usuários (com paginação)
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: UserFilters
  ): Promise<{ users: Omit<User, 'password'>[]; total: number }> {
    const skip = (page - 1) * limit;

    // Monta o where baseado nos filtros
    const where: any = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.emailVerified !== undefined) {
      where.emailVerified = filters.emailVerified;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Busca os usuários
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
          preferences: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users: users as any, total };
  }

  /**
   * Busca um usuário por ID
   */
  async findById(id: string): Promise<Omit<User, 'password'>> {
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
        preferences: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return user as any;
  }

  /**
   * Busca perfil do usuário com estatísticas
   */
  async getProfile(userId: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        preferences: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    // Busca estatísticas de reservas
    const [reservationsCount, totalSpent, lastReservation] = await Promise.all([
      prisma.reservation.count({
        where: { userId },
      }),
      prisma.reservation.aggregate({
        where: {
          userId,
          paymentStatus: 'COMPLETED',
        },
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.reservation.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      ...user,
      reservationsCount,
      totalSpent: totalSpent._sum.totalAmount || 0,
      lastReservationAt: lastReservation?.createdAt || null,
    };
  }

  /**
   * Atualiza um usuário
   */
  async update(
    id: string,
    data: UpdateUserData
  ): Promise<Omit<User, 'password'>> {
    // Verifica se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError('User', id);
    }

    // Atualiza o usuário
    const user = await prisma.user.update({
      where: { id },
      data,
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
        preferences: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info('User updated', { userId: id });

    return user as any;
  }

  /**
   * Atualiza o perfil do usuário autenticado
   */
  async updateProfile(
    userId: string,
    data: UpdateUserData
  ): Promise<Omit<User, 'password'>> {
    return this.update(userId, data);
  }

  /**
   * Deleta um usuário (soft delete)
   */
  async delete(id: string): Promise<void> {
    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    // Soft delete - marca como inativo
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    logger.info('User deleted (soft)', { userId: id });
  }

  /**
   * Altera o role de um usuário
   */
  async changeRole(id: string, role: UserRole): Promise<Omit<User, 'password'>> {
    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    // Atualiza o role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
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
        preferences: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info('User role changed', { userId: id, newRole: role });

    return updatedUser as any;
  }

  /**
   * Ativa/desativa um usuário
   */
  async toggleActive(id: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
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
        preferences: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info('User active status toggled', {
      userId: id,
      isActive: updatedUser.isActive,
    });

    return updatedUser as any;
  }

  /**
   * Obtém estatísticas de usuários
   */
  async getStats(): Promise<any> {
    const [total, active, inactive, byRole] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
    ]);

    return {
      total,
      active,
      inactive,
      byRole: byRole.reduce((acc, curr) => {
        acc[curr.role] = curr._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export default new UsersService();
