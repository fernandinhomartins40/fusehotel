import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { generateSecurePassword, hashPassword } from '../utils/crypto';
import { EmailService } from './email.service';
import { PasswordResetService } from './password-reset.service';

type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER';

interface CreateUserData {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  cpf?: string;
  password?: string;
  role?: UserRole;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string | null;
  whatsapp?: string | null;
  cpf?: string | null;
  profileImage?: string | null;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
  emailVerified?: boolean;
}

interface ListUserFilters {
  role?: string;
  isActive?: string;
  isProvisional?: string;
  search?: string;
}

export class UserService {
  static async create(data: CreateUserData) {
    await this.ensureUniqueFields(data);

    const shouldSendSetupEmail = !data.password;

    if (shouldSendSetupEmail && !EmailService.isConfigured()) {
      throw new BadRequestError('Defina uma senha manualmente ou configure SMTP para envio do acesso inicial');
    }

    const hashedPassword = await hashPassword(data.password || generateSecurePassword());

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        whatsapp: data.whatsapp?.replace(/\D/g, ''),
        cpf: data.cpf,
        role: data.role || 'CUSTOMER',
        isActive: true,
        emailVerified: false,
        isProvisional: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        whatsapp: true,
        cpf: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (shouldSendSetupEmail) {
      const token = await PasswordResetService.issueToken(user.id);
      await EmailService.sendPortalAccessEmail({
        to: user.email,
        name: user.name,
        token,
      });
    }

    return user;
  }

  static async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        whatsapp: true,
        cpf: true,
        role: true,
        isActive: true,
        isProvisional: true,
        emailVerified: true,
        profileImage: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user;
  }

  static async list(filters: ListUserFilters) {
    const search = filters.search?.trim();
    const normalizedRole =
      filters.role === 'CUSTOMER' ||
      filters.role === 'ADMIN' ||
      filters.role === 'MANAGER'
        ? filters.role
        : undefined;

    return prisma.user.findMany({
      where: {
        role: normalizedRole,
        isActive: filters.isActive !== undefined ? filters.isActive === 'true' : undefined,
        isProvisional: filters.isProvisional !== undefined ? filters.isProvisional === 'true' : undefined,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { whatsapp: { contains: search.replace(/\D/g, '') } },
            ]
          : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        whatsapp: true,
        cpf: true,
        role: true,
        isActive: true,
        isProvisional: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            reservations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async update(id: string, data: UpdateUserData) {
    await this.getById(id);

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified;
    if (data.password) updateData.password = await hashPassword(data.password);

    if (data.cpf !== undefined) {
      const cleanCpf = data.cpf || null;

      if (cleanCpf) {
        await this.ensureCpfAvailable(cleanCpf, id);
      }

      updateData.cpf = cleanCpf;
    }

    if (data.whatsapp !== undefined) {
      const cleanWhatsApp = data.whatsapp ? data.whatsapp.replace(/\D/g, '') : null;

      if (cleanWhatsApp) {
        await this.ensureWhatsAppAvailable(cleanWhatsApp, id);
      }

      updateData.whatsapp = cleanWhatsApp;
    }

    if (data.email !== undefined) {
      await this.ensureEmailAvailable(data.email, id);
      updateData.email = data.email;

      if (data.email.includes('@') && !data.email.includes('@provisional.fusehotel.com')) {
        updateData.isProvisional = false;
      }
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        whatsapp: true,
        cpf: true,
        role: true,
        isActive: true,
        isProvisional: true,
        emailVerified: true,
        profileImage: true,
        lastLoginAt: true,
      },
    });
  }

  static async updateStatus(id: string, isActive: boolean) {
    await this.getById(id);

    return prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });
  }

  static async delete(id: string) {
    await prisma.user.delete({ where: { id } });
  }

  private static async ensureUniqueFields(data: CreateUserData) {
    await this.ensureEmailAvailable(data.email);

    if (data.cpf) {
      await this.ensureCpfAvailable(data.cpf);
    }

    if (data.whatsapp) {
      await this.ensureWhatsAppAvailable(data.whatsapp.replace(/\D/g, ''));
    }
  }

  private static async ensureEmailAvailable(email: string, userId?: string) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: userId ? { not: userId } : undefined,
      },
    });

    if (existingUser) {
      throw new BadRequestError('Email já cadastrado');
    }
  }

  private static async ensureCpfAvailable(cpf: string, userId?: string) {
    const existingCpf = await prisma.user.findFirst({
      where: {
        cpf,
        id: userId ? { not: userId } : undefined,
      },
    });

    if (existingCpf) {
      throw new BadRequestError('CPF já cadastrado');
    }
  }

  private static async ensureWhatsAppAvailable(whatsapp: string, userId?: string) {
    const existingWhatsApp = await prisma.user.findFirst({
      where: {
        whatsapp,
        id: userId ? { not: userId } : undefined,
      },
    });

    if (existingWhatsApp) {
      throw new BadRequestError('WhatsApp já cadastrado');
    }
  }
}
