/**
 * Reservations Controller
 *
 * Controller de gerenciamento de reservas
 */

import { Request, Response } from 'express';
import reservationsService from '../services/reservations.service';
import { success, created, updated, deleted, paginated } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizePagination } from '../utils/response';
import { SUCCESS_MESSAGES } from '../utils/constants';

export class ReservationsController {
  /**
   * GET /reservations
   * Lista todas as reservas
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = normalizePagination(req.query.page, req.query.limit);

    const filters: any = {
      userId: req.query.userId as string,
      accommodationId: req.query.accommodationId as string,
      status: req.query.status as any,
      paymentStatus: req.query.paymentStatus as any,
      checkInDateFrom: req.query.checkInDateFrom
        ? new Date(req.query.checkInDateFrom as string)
        : undefined,
      checkInDateTo: req.query.checkInDateTo
        ? new Date(req.query.checkInDateTo as string)
        : undefined,
      checkOutDateFrom: req.query.checkOutDateFrom
        ? new Date(req.query.checkOutDateFrom as string)
        : undefined,
      checkOutDateTo: req.query.checkOutDateTo
        ? new Date(req.query.checkOutDateTo as string)
        : undefined,
      guestName: req.query.guestName as string,
      reservationCode: req.query.reservationCode as string,
    };

    const { reservations, total } = await reservationsService.findAll(page, limit, filters);
    return paginated(res, reservations, page, limit, total);
  });

  /**
   * GET /reservations/my
   * Lista reservas do usuário autenticado
   */
  getMyReservations = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = normalizePagination(req.query.page, req.query.limit);
    const userId = req.user!.userId;

    const { reservations, total } = await reservationsService.findByUser(userId, page, limit);
    return paginated(res, reservations, page, limit, total);
  });

  /**
   * GET /reservations/:id
   * Busca uma reserva por ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const reservation = await reservationsService.findById(req.params.id);
    return success(res, reservation);
  });

  /**
   * GET /reservations/code/:code
   * Busca uma reserva por código
   */
  getByCode = asyncHandler(async (req: Request, res: Response) => {
    const reservation = await reservationsService.findByCode(req.params.code);
    return success(res, reservation);
  });

  /**
   * POST /reservations
   * Cria uma nova reserva
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const data = {
      ...req.body,
      userId,
      checkInDate: new Date(req.body.checkInDate),
      checkOutDate: new Date(req.body.checkOutDate),
    };

    const reservation = await reservationsService.create(data);
    return created(res, reservation, SUCCESS_MESSAGES.RESERVATION_CREATED);
  });

  /**
   * PUT /reservations/:id
   * Atualiza uma reserva
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      checkInDate: req.body.checkInDate ? new Date(req.body.checkInDate) : undefined,
      checkOutDate: req.body.checkOutDate ? new Date(req.body.checkOutDate) : undefined,
    };

    const reservation = await reservationsService.update(req.params.id, data);
    return updated(res, reservation, SUCCESS_MESSAGES.RESERVATION_UPDATED);
  });

  /**
   * POST /reservations/:id/cancel
   * Cancela uma reserva
   */
  cancel = asyncHandler(async (req: Request, res: Response) => {
    const { reason } = req.body;
    const reservation = await reservationsService.cancel(req.params.id, reason);
    return success(res, reservation, SUCCESS_MESSAGES.RESERVATION_CANCELLED);
  });

  /**
   * POST /reservations/:id/check-in
   * Faz check-in de uma reserva
   */
  checkIn = asyncHandler(async (req: Request, res: Response) => {
    const reservation = await reservationsService.checkIn(req.params.id);
    return success(res, reservation, SUCCESS_MESSAGES.CHECK_IN_SUCCESS);
  });

  /**
   * POST /reservations/:id/check-out
   * Faz check-out de uma reserva
   */
  checkOut = asyncHandler(async (req: Request, res: Response) => {
    const reservation = await reservationsService.checkOut(req.params.id);
    return success(res, reservation, SUCCESS_MESSAGES.CHECK_OUT_SUCCESS);
  });

  /**
   * POST /reservations/check-availability
   * Verifica disponibilidade
   */
  checkAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { accommodationId, checkInDate, checkOutDate } = req.body;
    const available = await reservationsService.checkAvailability(
      accommodationId,
      new Date(checkInDate),
      new Date(checkOutDate)
    );
    return success(res, { available });
  });

  /**
   * GET /reservations/stats
   * Obtém estatísticas
   */
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await reservationsService.getStats();
    return success(res, stats);
  });
}

export default new ReservationsController();
