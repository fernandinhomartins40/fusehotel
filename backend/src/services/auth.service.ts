import { User, UserRole } from '@prisma/client';
import prisma from '../config/database';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  generateRandomToken,
} from '../utils/crypto';
import {
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordRequest,
} from '../types/auth.types';
import {
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../utils/errors';
import { addHours } from '../utils/date';
import logger from '../utils/logger';

/**
 * Authentication Service
 * Handles all authentication-related business logic
 */
export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictError('Email already registered');
      }

      // Check CPF if provided
      if (data.cpf) {
        const existingCpf = await prisma.user.findUnique({
          where: { cpf: data.cpf },
        });

        if (existingCpf) {
          throw new ConflictError('CPF already registered');
        }
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          cpf: data.cpf,
          role: UserRole.CUSTOMER,
        },
      });

      // Generate tokens
      const tokens = await this.generateTokensForUser(user);

      logger.info(`User registered successfully: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens,
      };
    } catch (error) {
      logger.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedError('Account is disabled');
      }

      // Verify password
      const isPasswordValid = await comparePassword(credentials.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate tokens
      const tokens = await this.generateTokensForUser(user);

      logger.info(`User logged in: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Find refresh token in database
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Check if token is expired
      if (tokenRecord.expiresAt < new Date()) {
        // Delete expired token
        await prisma.refreshToken.delete({
          where: { id: tokenRecord.id },
        });

        throw new UnauthorizedError('Refresh token has expired');
      }

      // Check if user is active
      if (!tokenRecord.user.isActive) {
        throw new UnauthorizedError('Account is disabled');
      }

      // Generate new tokens
      const tokens = await this.generateTokensForUser(tokenRecord.user);

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });

      logger.info(`Token refreshed for user: ${tokenRecord.user.email}`);

      return tokens;
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw error;
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      logger.info('User logged out successfully');
    } catch (error) {
      // Silently fail if token doesn't exist
      logger.debug('Logout error:', error);
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: PasswordResetRequest): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        // Don't reveal if email exists
        logger.info(`Password reset requested for non-existent email: ${data.email}`);
        return;
      }

      // Generate reset token
      const resetToken = generateRandomToken();

      // Save reset token
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt: addHours(new Date(), 1), // 1 hour expiration
        },
      });

      // TODO: Send email with reset link
      // await emailService.sendPasswordResetEmail(user.email, resetToken);

      logger.info(`Password reset requested for: ${user.email}`);
    } catch (error) {
      logger.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: PasswordResetConfirm): Promise<void> {
    try {
      // Find reset token
      const resetRecord = await prisma.passwordReset.findUnique({
        where: { token: data.token },
        include: { user: true },
      });

      if (!resetRecord) {
        throw new ValidationError('Invalid or expired reset token');
      }

      // Check if token is expired
      if (resetRecord.expiresAt < new Date()) {
        throw new ValidationError('Reset token has expired');
      }

      // Check if token was already used
      if (resetRecord.used) {
        throw new ValidationError('Reset token has already been used');
      }

      // Hash new password
      const hashedPassword = await hashPassword(data.newPassword);

      // Update user password
      await prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      });

      // Mark token as used
      await prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { used: true },
      });

      logger.info(`Password reset successful for user: ${resetRecord.user.email}`);
    } catch (error) {
      logger.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Verify current password
      const isPasswordValid = await comparePassword(data.currentPassword, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await hashPassword(data.newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      // Invalidate all refresh tokens for this user
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });

      logger.info(`Password changed for user: ${user.email}`);
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Generate tokens for user
   */
  private async generateTokensForUser(user: User): Promise<AuthTokens> {
    // Generate access token
    const accessToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Generate refresh token
    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    // Save refresh token to database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: addHours(new Date(), 24 * 7), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
