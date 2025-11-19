/**
 * Auth Controller
 *
 * Controller de autenticação
 */

import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { success, created } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';
import { SUCCESS_MESSAGES } from '../utils/constants';

export class AuthController {
  /**
   * POST /auth/register
   * Registra um novo usuário
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return created(res, result, SUCCESS_MESSAGES.REGISTER_SUCCESS);
  });

  /**
   * POST /auth/login
   * Faz login de um usuário
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    return success(res, result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
  });

  /**
   * POST /auth/logout
   * Faz logout de um usuário
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return success(res, null, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  });

  /**
   * POST /auth/refresh
   * Atualiza o access token
   */
  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    return success(res, result, 'Token refreshed successfully');
  });

  /**
   * POST /auth/forgot-password
   * Solicita reset de senha
   */
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    return success(res, null, SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT);
  });

  /**
   * POST /auth/reset-password
   * Reseta a senha usando token
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    return success(res, null, SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
  });

  /**
   * POST /auth/change-password
   * Altera a senha do usuário autenticado
   */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(userId, currentPassword, newPassword);
    return success(res, null, SUCCESS_MESSAGES.PASSWORD_CHANGED);
  });

  /**
   * GET /auth/check-email
   * Verifica se um email está disponível
   */
  checkEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;
    const available = await authService.checkEmailAvailability(email as string);
    return success(res, { available });
  });

  /**
   * GET /auth/check-cpf
   * Verifica se um CPF está disponível
   */
  checkCpf = asyncHandler(async (req: Request, res: Response) => {
    const { cpf } = req.query;
    const available = await authService.checkCpfAvailability(cpf as string);
    return success(res, { available });
  });
}

export default new AuthController();
