/**
 * Accommodations Controller
 *
 * Controller de gerenciamento de acomodações
 */

import { Request, Response } from 'express';
import accommodationsService from '../services/accommodations.service';
import { success, created, updated, deleted, paginated } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizePagination } from '../utils/response';

export class AccommodationsController {
  /**
   * GET /accommodations
   * Lista todas as acomodações
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = normalizePagination(req.query.page, req.query.limit);

    const filters: any = {
      type: req.query.type as any,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minCapacity: req.query.minCapacity ? Number(req.query.minCapacity) : undefined,
      amenityIds: req.query.amenityIds ? (req.query.amenityIds as string).split(',') : undefined,
      isAvailable: req.query.isAvailable === 'true',
      isFeatured: req.query.isFeatured === 'true',
      checkInDate: req.query.checkInDate ? new Date(req.query.checkInDate as string) : undefined,
      checkOutDate: req.query.checkOutDate ? new Date(req.query.checkOutDate as string) : undefined,
    };

    const { accommodations, total } = await accommodationsService.findAll(page, limit, filters);
    return paginated(res, accommodations, page, limit, total);
  });

  /**
   * GET /accommodations/:id
   * Busca uma acomodação por ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const accommodation = await accommodationsService.findById(req.params.id);
    return success(res, accommodation);
  });

  /**
   * GET /accommodations/slug/:slug
   * Busca uma acomodação por slug
   */
  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const accommodation = await accommodationsService.findBySlug(req.params.slug);
    return success(res, accommodation);
  });

  /**
   * POST /accommodations
   * Cria uma nova acomodação
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const accommodation = await accommodationsService.create(req.body);
    return created(res, accommodation, 'Accommodation created successfully');
  });

  /**
   * PUT /accommodations/:id
   * Atualiza uma acomodação
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const accommodation = await accommodationsService.update(req.params.id, req.body);
    return updated(res, accommodation, 'Accommodation updated successfully');
  });

  /**
   * DELETE /accommodations/:id
   * Deleta uma acomodação
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await accommodationsService.delete(req.params.id);
    return deleted(res, 'Accommodation deleted successfully');
  });

  /**
   * POST /accommodations/:id/check-availability
   * Verifica disponibilidade
   */
  checkAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { checkInDate, checkOutDate } = req.body;
    const available = await accommodationsService.checkAvailability(
      req.params.id,
      new Date(checkInDate),
      new Date(checkOutDate)
    );
    return success(res, { available });
  });

  /**
   * GET /accommodations/stats
   * Obtém estatísticas
   */
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await accommodationsService.getStats();
    return success(res, stats);
  });
}

export default new AccommodationsController();
