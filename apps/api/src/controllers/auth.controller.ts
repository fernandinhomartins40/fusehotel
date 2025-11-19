import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema } from '@fusehotel/shared';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await AuthService.register(data);
      return sendSuccess(res, result, 'Usuário registrado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data);
      return sendSuccess(res, result, 'Login realizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data = refreshTokenSchema.parse(req.body);
      const result = await AuthService.refreshToken(data.refreshToken);
      return sendSuccess(res, result, 'Token atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      return sendSuccess(res, null, 'Logout realizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = forgotPasswordSchema.parse(req.body);
      await AuthService.forgotPassword(data.email);
      return sendSuccess(res, null, 'Email de recuperação enviado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = resetPasswordSchema.parse(req.body);
      await AuthService.resetPassword(data.token, data.newPassword);
      return sendSuccess(res, null, 'Senha alterada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = changePasswordSchema.parse(req.body);
      const userId = req.user!.id;
      await AuthService.changePassword(userId, data.currentPassword, data.newPassword);
      return sendSuccess(res, null, 'Senha alterada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
