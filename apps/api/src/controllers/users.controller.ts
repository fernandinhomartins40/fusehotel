/**
 * Users Controller
 *
 * Controller de gerenciamento de usuários
 */

import { Request, Response } from 'express';
import usersService from '../services/users.service';
import { success, paginated, updated, deleted } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizePagination } from '../utils/response';
import { SUCCESS_MESSAGES } from '../utils/constants';

export class UsersController {
  /**
   * GET /users
   * Lista todos os usuários
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = normalizePagination(req.query.page, req.query.limit);
    const filters = {
      role: req.query.role as any,
      isActive: req.query.isActive === 'true',
      emailVerified: req.query.emailVerified === 'true',
      search: req.query.search as string,
    };

    const { users, total } = await usersService.findAll(page, limit, filters);
    return paginated(res, users, page, limit, total);
  });

  /**
   * GET /users/:id
   * Busca um usuário por ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.findById(req.params.id);
    return success(res, user);
  });

  /**
   * GET /users/profile
   * Busca perfil do usuário autenticado
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await usersService.getProfile(req.user!.userId);
    return success(res, profile);
  });

  /**
   * PUT /users/:id
   * Atualiza um usuário
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.update(req.params.id, req.body);
    return updated(res, user);
  });

  /**
   * PUT /users/profile
   * Atualiza perfil do usuário autenticado
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.updateProfile(req.user!.userId, req.body);
    return updated(res, user, SUCCESS_MESSAGES.PROFILE_UPDATED);
  });

  /**
   * DELETE /users/:id
   * Deleta um usuário (soft delete)
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await usersService.delete(req.params.id);
    return deleted(res);
  });

  /**
   * PUT /users/:id/role
   * Altera o role de um usuário
   */
  changeRole = asyncHandler(async (req: Request, res: Response) => {
    const { role } = req.body;
    const user = await usersService.changeRole(req.params.id, role);
    return updated(res, user, 'User role changed successfully');
  });

  /**
   * PUT /users/:id/toggle-active
   * Ativa/desativa um usuário
   */
  toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.toggleActive(req.params.id);
    return updated(res, user, 'User status changed successfully');
  });

  /**
   * GET /users/stats
   * Obtém estatísticas de usuários
   */
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await usersService.getStats();
    return success(res, stats);
  });
}

export default new UsersController();
