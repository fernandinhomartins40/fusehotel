import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservations.service';
import { sendSuccess } from '../utils/response';

export class ReservationController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await ReservationService.list(req.query);
      return sendSuccess(res, reservations);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationService.getById(req.params.id);
      return sendSuccess(res, reservation);
    } catch (error) {
      next(error);
    }
  }

  static async getByCode(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationService.getByCode(req.params.code);
      return sendSuccess(res, reservation);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const reservation = await ReservationService.create(req.body, userId);
      return sendSuccess(res, reservation, 'Reserva criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { reason } = req.body;
      const reservation = await ReservationService.cancel(req.params.id, reason);
      return sendSuccess(res, reservation, 'Reserva cancelada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async myReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const reservations = await ReservationService.list({ userId });
      return sendSuccess(res, reservations);
    } catch (error) {
      next(error);
    }
  }
}
