import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { hashPassword } from '../utils/crypto';

export class UserService {
  static async create(data: {
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    cpf?: string;
    password?: string;
    role?: 'CUSTOMER' | 'ADMIN' | 'MANAGER';
  }) {
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new BadRequestError('Email já cadastrado');
    }

    // Verificar se CPF já existe (se fornecido)
    if (data.cpf) {
      const existingCpf = await prisma.user.findUnique({
        where: { cpf: data.cpf }
      });

      if (existingCpf) {
        throw new BadRequestError('CPF já cadastrado');
      }
    }

    // Verificar se WhatsApp já existe (se fornecido)
    if (data.whatsapp) {
      const cleanWhatsApp = data.whatsapp.replace(/\D/g, '');
      const existingWhatsApp = await prisma.user.findUnique({
        where: { whatsapp: cleanWhatsApp }
      });

      if (existingWhatsApp) {
        throw new BadRequestError('WhatsApp já cadastrado');
      }
    }

    // Gerar senha padrão se não fornecida (primeiras 3 letras do nome)
    let password = data.password;
    if (!password) {
      const firstThreeLetters = data.name
        .substring(0, 3)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remover acentos
      password = firstThreeLetters;
    }

    const hashedPassword = await hashPassword(password);

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
      }
    });

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
    const updateData: any = {};

    // Campos que sempre podem ser atualizados
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage;

    // Campos especiais (completar cadastro de provisórios)
    if (data.cpf !== undefined) updateData.cpf = data.cpf;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp.replace(/\D/g, '');
    if (data.email !== undefined) {
      // Se estava com email provisório e está atualizando, marcar como não provisório
      updateData.email = data.email;
      if (data.email.includes('@') && !data.email.includes('@provisional.fusehotel.com')) {
        updateData.isProvisional = false;
      }
    }

    const user = await prisma.user.update({
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
        isProvisional: true,
        profileImage: true,
      }
    });

    return user;
  }

  static async delete(id: string) {
    await prisma.user.delete({ where: { id } });
  }
}
