/**
 * Settings Controller
 *
 * Controller de gerenciamento de configurações
 */

import { Request, Response } from 'express';
import settingsService from '../services/settings.service';
import { success, created, updated, deleted } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';

export class SettingsController {
  /**
   * GET /settings
   * Lista todas as configurações
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.findAll();
    return success(res, settings);
  });

  /**
   * GET /settings/public
   * Lista configurações públicas
   */
  getPublic = asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.findPublic();
    return success(res, settings);
  });

  /**
   * GET /settings/:category
   * Lista configurações por categoria
   */
  getByCategory = asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.findByCategory(req.params.category as any);
    return success(res, settings);
  });

  /**
   * GET /settings/:category/:key
   * Busca uma configuração específica
   */
  getOne = asyncHandler(async (req: Request, res: Response) => {
    const setting = await settingsService.findOne(
      req.params.category as any,
      req.params.key
    );
    return success(res, setting);
  });

  /**
   * POST /settings
   * Cria uma nova configuração
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const setting = await settingsService.create(req.body);
    return created(res, setting, 'Setting created successfully');
  });

  /**
   * PUT /settings/:category/:key
   * Atualiza uma configuração
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const setting = await settingsService.update(
      req.params.category as any,
      req.params.key,
      req.body
    );
    return updated(res, setting, 'Setting updated successfully');
  });

  /**
   * PUT /settings/bulk
   * Atualiza múltiplas configurações
   */
  updateMultiple = asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.updateMultiple(req.body);
    return updated(res, settings, 'Settings updated successfully');
  });

  /**
   * DELETE /settings/:category/:key
   * Deleta uma configuração
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await settingsService.delete(req.params.category as any, req.params.key);
    return deleted(res, 'Setting deleted successfully');
  });

  /**
   * GET /settings/:category/object
   * Obtém configurações como objeto key-value
   */
  getAsObject = asyncHandler(async (req: Request, res: Response) => {
    const object = await settingsService.getAsObject(req.params.category as any);
    return success(res, object);
  });
}

export default new SettingsController();
