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

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const reservation = await ReservationService.updateStatus(req.params.id, status);
      return sendSuccess(res, reservation, 'Status da reserva atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationService.update(req.params.id, req.body);
      return sendSuccess(res, reservation, 'Reserva atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
