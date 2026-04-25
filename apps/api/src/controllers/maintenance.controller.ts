import { NextFunction, Request, Response } from 'express';
import { MaintenanceService } from '../services/maintenance.service';
import { sendSuccess } from '../utils/response';

export class MaintenanceController {
  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await MaintenanceService.list();
      return sendSuccess(res, orders);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await MaintenanceService.create(req.body);
      return sendSuccess(res, order, 'Ordem de manutencao criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await MaintenanceService.update(req.params.id, req.body);
      return sendSuccess(res, order, 'Ordem de manutencao atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
