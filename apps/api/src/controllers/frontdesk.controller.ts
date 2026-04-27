import { NextFunction, Request, Response } from 'express';
import { FrontdeskService } from '../services/frontdesk.service';
import { sendSuccess } from '../utils/response';

export class FrontdeskController {
  static async dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboard = await FrontdeskService.getDashboard(
        typeof req.query.date === 'string' ? req.query.date : undefined
      );
      return sendSuccess(res, dashboard);
    } catch (error) {
      next(error);
    }
  }

  static async listStays(_req: Request, res: Response, next: NextFunction) {
    try {
      const stays = await FrontdeskService.listStays();
      return sendSuccess(res, stays);
    } catch (error) {
      next(error);
    }
  }

  static async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const stay = await FrontdeskService.checkIn(req.body);
      return sendSuccess(res, stay, 'Check-in realizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async walkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const stay = await FrontdeskService.walkIn(req.body);
      return sendSuccess(res, stay, 'Walk-in realizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async checkOut(req: Request, res: Response, next: NextFunction) {
    try {
      const stay = await FrontdeskService.checkOut(req.body);
      return sendSuccess(res, stay, 'Check-out realizado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
