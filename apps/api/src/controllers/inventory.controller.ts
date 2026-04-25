import { NextFunction, Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';
import { sendSuccess } from '../utils/response';

export class InventoryController {
  static async listProducts(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await InventoryService.listProducts());
    } catch (error) {
      next(error);
    }
  }

  static async createMovement(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await InventoryService.createMovement(req.body, (req as any).user), 'Movimentação registrada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }
}
