import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema } from '@fusehotel/shared';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await AuthService.register(data);

      // Configurar tokens como httpOnly cookies
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict' as const,
      };

      // Set access token cookie
      res.cookie('accessToken', result.tokens.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutos
      });

      // Set refresh token cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      // Retornar dados do usuário (sem os tokens)
      return sendSuccess(res, {
        user: result.user,
        message: 'Tokens configurados em cookies httpOnly'
      }, 'Usuário registrado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data);

      // Configurar tokens como httpOnly cookies
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction, // HTTPS apenas em produção
        sameSite: 'strict' as const,
        maxAge: data.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 dias ou 1 dia
      };

      // Set access token cookie
      res.cookie('accessToken', result.tokens.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutos
      });

      // Set refresh token cookie
      res.cookie('refreshToken', result.tokens.refreshToken, cookieOptions);

      // Retornar dados do usuário (sem os tokens)
      return sendSuccess(res, {
        user: result.user,
        message: 'Tokens configurados em cookies httpOnly'
      }, 'Login realizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Tentar pegar refresh token do cookie primeiro, senão do body
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token não fornecido' });
      }

      const result = await AuthService.refreshToken(refreshToken);

      // Configurar novo access token como httpOnly cookie
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict' as const,
        maxAge: 15 * 60 * 1000, // 15 minutos
      });

      return sendSuccess(res, {
        message: 'Access token atualizado em cookie httpOnly'
      }, 'Token atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      // Limpar cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

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
