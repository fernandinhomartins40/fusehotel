/**
 * Auth Service
 *
 * Serviço de autenticação e gerenciamento de usuários
 */

import { prisma } from '../config/database';
import {
  hashPassword,
  comparePassword,
  generateAuthTokens,
  generateRandomToken,
  verifyRefreshToken,
} from '../utils/crypto';
import {
  InvalidCredentialsError,
  InactiveAccountError,
  DuplicateError,
  NotFoundError,
  InvalidTokenError,
  UnauthorizedError,
} from '../utils/errors';
import logger, { logAuth } from '../utils/logger';
import { User, UserRole } from '@prisma/client';
import { addDays, addHours } from 'date-fns';

/**
 * Interface de dados de registro
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  cpf?: string;
}

/**
 * Interface de dados de login
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Interface de resposta de autenticação
 */
export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

/**
 * Service de autenticação
 */
export class AuthService {
  /**
   * Registra um novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new DuplicateError('email', data.email);
    }

    // Verifica se o CPF já existe (se fornecido)
    if (data.cpf) {
      const existingCpf = await prisma.user.findUnique({
        where: { cpf: data.cpf },
      });

      if (existingCpf) {
        throw new DuplicateError('cpf', data.cpf);
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        cpf: data.cpf,
        role: UserRole.CUSTOMER,
        isActive: true,
        emailVerified: false,
      },
    });

    // Gera tokens
    const tokens = generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Salva refresh token no banco
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7),
      },
    });

    // Atualiza último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logAuth('register', user.id, true, { email: user.email });

    // Remove senha da resposta
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Faz login de um usuário
   */
  async login(data: LoginData): Promise<AuthResponse> {
    // Busca o usuário
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      logAuth('login', data.email, false);
      throw new InvalidCredentialsError();
    }

    // Verifica a senha
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      logAuth('login', user.id, false);
      throw new InvalidCredentialsError();
    }

    // Verifica se a conta está ativa
    if (!user.isActive) {
      logAuth('login', user.id, false, { reason: 'inactive_account' });
      throw new InactiveAccountError();
    }

    // Gera tokens
    const tokens = generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Salva refresh token no banco
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7),
      },
    });

    // Atualiza último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logAuth('login', user.id, true);

    // Remove senha da resposta
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Faz logout de um usuário
   */
  async logout(refreshToken: string): Promise<void> {
    // Remove o refresh token do banco
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    logger.info('User logged out successfully');
  }

  /**
   * Atualiza o access token usando refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    // Verifica o refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new InvalidTokenError('Invalid or expired refresh token');
    }

    // Busca o refresh token no banco
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new InvalidTokenError('Refresh token not found');
    }

    // Verifica se o token expirou
    if (storedToken.expiresAt < new Date()) {
      // Remove o token expirado
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
      throw new InvalidTokenError('Refresh token expired');
    }

    // Verifica se a conta está ativa
    if (!storedToken.user.isActive) {
      throw new InactiveAccountError();
    }

    // Gera novos tokens
    const tokens = generateAuthTokens({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    // Remove o refresh token antigo
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    // Salva o novo refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: storedToken.user.id,
        expiresAt: addDays(new Date(), 7),
      },
    });

    logAuth('token_refresh', storedToken.user.id, true);

    // Remove senha da resposta
    const { password, ...userWithoutPassword } = storedToken.user;

    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Solicita reset de senha
   */
  async forgotPassword(email: string): Promise<void> {
    // Busca o usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por segurança, não informa se o email existe ou não
      logger.info('Password reset requested for non-existent email', { email });
      return;
    }

    // Gera token de reset
    const resetToken = generateRandomToken(32);

    // Salva o token no banco
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: addHours(new Date(), 1), // Expira em 1 hora
      },
    });

    // TODO: Enviar email com o token
    logger.info('Password reset token generated', {
      userId: user.id,
      email: user.email,
      token: resetToken, // Remove em produção
    });
  }

  /**
   * Reseta a senha usando o token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Busca o token de reset
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new InvalidTokenError('Invalid or expired reset token');
    }

    // Verifica se já foi usado
    if (resetToken.used) {
      throw new InvalidTokenError('Reset token already used');
    }

    // Verifica se expirou
    if (resetToken.expiresAt < new Date()) {
      throw new InvalidTokenError('Reset token expired');
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword);

    // Atualiza a senha do usuário
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Marca o token como usado
    await prisma.passwordReset.update({
      where: { token },
      data: { used: true },
    });

    // Remove todos os refresh tokens do usuário
    await prisma.refreshToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    logger.info('Password reset successfully', { userId: resetToken.userId });
  }

  /**
   * Altera a senha do usuário autenticado
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Busca o usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    // Verifica a senha atual
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError('Current password is incorrect');
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword);

    // Atualiza a senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Remove todos os refresh tokens do usuário
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    logger.info('Password changed successfully', { userId });
  }

  /**
   * Verifica se um email está disponível
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return !user;
  }

  /**
   * Verifica se um CPF está disponível
   */
  async checkCpfAvailability(cpf: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { cpf },
    });

    return !user;
  }
}

export default new AuthService();
