import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/users.service';
import { sendSuccess } from '../utils/response';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await UserService.getById(userId);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await UserService.update(userId, req.body);
      return sendSuccess(res, user, 'Perfil atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.list(req.query);
      return sendSuccess(res, users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getById(req.params.id);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.delete(req.params.id);
      return sendSuccess(res, null, 'Usuário deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
