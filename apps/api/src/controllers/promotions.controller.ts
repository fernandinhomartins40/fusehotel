import { Request, Response, NextFunction } from 'express';
import { PromotionService } from '../services/promotions.service';
import { sendSuccess } from '../utils/response';

export class PromotionController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const promotions = await PromotionService.list(req.query);
      return sendSuccess(res, promotions);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const promotion = await PromotionService.getById(req.params.id);
      return sendSuccess(res, promotion);
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const promotion = await PromotionService.getBySlug(req.params.slug);
      return sendSuccess(res, promotion);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const promotion = await PromotionService.create(req.body);
      return sendSuccess(res, promotion, 'Promoção criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }
}
