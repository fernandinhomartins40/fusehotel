/**
 * Promotions Controller
 *
 * Controller de gerenciamento de promoções
 */

import { Request, Response } from 'express';
import promotionsService from '../services/promotions.service';
import { success, created, updated, deleted, paginated } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizePagination } from '../utils/response';

export class PromotionsController {
  /**
   * GET /promotions
   * Lista todas as promoções
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = normalizePagination(req.query.page, req.query.limit);

    const filters: any = {
      type: req.query.type as any,
      isActive: req.query.isActive === 'true',
      isFeatured: req.query.isFeatured === 'true',
      discountType: req.query.discountType as any,
    };

    const { promotions, total } = await promotionsService.findAll(page, limit, filters);
    return paginated(res, promotions, page, limit, total);
  });

  /**
   * GET /promotions/:id
   * Busca uma promoção por ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const promotion = await promotionsService.findById(req.params.id);
    return success(res, promotion);
  });

  /**
   * GET /promotions/slug/:slug
   * Busca uma promoção por slug
   */
  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const promotion = await promotionsService.findBySlug(req.params.slug);
    return success(res, promotion);
  });

  /**
   * POST /promotions
   * Cria uma nova promoção
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    };

    const promotion = await promotionsService.create(data);
    return created(res, promotion, 'Promotion created successfully');
  });

  /**
   * PUT /promotions/:id
   * Atualiza uma promoção
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
    };

    const promotion = await promotionsService.update(req.params.id, data);
    return updated(res, promotion, 'Promotion updated successfully');
  });

  /**
   * DELETE /promotions/:id
   * Deleta uma promoção
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await promotionsService.delete(req.params.id);
    return deleted(res, 'Promotion deleted successfully');
  });

  /**
   * POST /promotions/validate-code
   * Valida código promocional
   */
  validateCode = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;
    const result = await promotionsService.validateCode(code);
    return success(res, result, 'Promotion code validated successfully');
  });
}

export default new PromotionsController();
