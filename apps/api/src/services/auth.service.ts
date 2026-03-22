import { addDays } from 'date-fns';
import { LoginCredentials, RegisterData, AuthResponse } from '@fusehotel/shared';
import { prisma } from '../config/database';
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from '../utils/crypto';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors';
import { EmailService } from './email.service';
import { PasswordResetService } from './password-reset.service';

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { cpf: data.cpf || undefined },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictError('Email ou CPF já cadastrado');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        cpf: data.cpf,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        profileImage: true,
      },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as AuthResponse['user']['role'],
        profileImage: user.profileImage,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900,
        tokenType: 'Bearer',
      },
    };
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: credentials.email },
          { whatsapp: credentials.email.replace(/\D/g, '') },
        ],
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Email/WhatsApp ou senha inválidos');
    }

    const isPasswordValid = await comparePassword(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Email ou senha inválidos');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as AuthResponse['user']['role'],
        profileImage: user.profileImage,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900,
        tokenType: 'Bearer',
      },
    };
  }

  static async refreshToken(token: string): Promise<{ accessToken: string }> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token inválido ou expirado');
    }

    const accessToken = generateAccessToken({
      userId: refreshToken.user.id,
      email: refreshToken.user.email,
      role: refreshToken.user.role,
    });

    return { accessToken };
  }

  static async logout(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return;
    }

    const token = await PasswordResetService.issueToken(user.id);
    await EmailService.sendPasswordResetEmail({
      to: email,
      name: user.name,
      token,
    });
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new BadRequestError('Token inválido ou expirado');
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Senha atual inválida');
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
