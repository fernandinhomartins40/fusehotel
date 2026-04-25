import { NextFunction, Request, Response } from 'express';
import { HousekeepingService } from '../services/housekeeping.service';
import { sendSuccess } from '../utils/response';

export class HousekeepingController {
  static async listTasks(_req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await HousekeepingService.listTasks();
      return sendSuccess(res, tasks);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await HousekeepingService.updateStatus(req.params.id, req.body.status, req.body.assignedToId);
      return sendSuccess(res, task, 'Status da tarefa atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async listStaff(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await HousekeepingService.listStaff());
    } catch (error) {
      next(error);
    }
  }

  static async createStaff(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await HousekeepingService.createStaff(req.body), 'Equipe cadastrada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateStaff(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await HousekeepingService.updateStaff(req.params.id, req.body), 'Equipe atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async listLostFound(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await HousekeepingService.listLostFound());
    } catch (error) {
      next(error);
    }
  }

  static async createLostFound(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await HousekeepingService.createLostFound(req.body), 'Item registrado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateLostFound(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await HousekeepingService.updateLostFound(req.params.id, req.body), 'Item atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
