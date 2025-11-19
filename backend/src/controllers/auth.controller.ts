import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';
import {
  LoginCredentials,
  RegisterData,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordRequest,
} from '../types/auth.types';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */
export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const data: RegisterData = req.body;

    const result = await authService.register(data);

    successResponse(res, result, 'Registration successful', 201);
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const credentials: LoginCredentials = req.body;

    const result = await authService.login(credentials);

    successResponse(res, result, 'Login successful');
  });

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  refreshToken = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    successResponse(res, result, 'Token refreshed successfully');
  });

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    successResponse(res, undefined, 'Logout successful');
  });

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  forgotPassword = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const data: PasswordResetRequest = req.body;

    await authService.forgotPassword(data);

    successResponse(
      res,
      undefined,
      'If the email exists, a password reset link has been sent'
    );
  });

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  resetPassword = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const data: PasswordResetConfirm = req.body;

    await authService.resetPassword(data);

    successResponse(res, undefined, 'Password reset successful');
  });

  /**
   * Change password (authenticated)
   * PUT /api/auth/change-password
   */
  changePassword = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const data: ChangePasswordRequest = req.body;

    await authService.changePassword(userId, data);

    successResponse(res, undefined, 'Password changed successfully');
  });
}

export default new AuthController();
