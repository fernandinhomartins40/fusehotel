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
      const task = await HousekeepingService.updateStatus(req.params.id, req.body.status);
      return sendSuccess(res, task, 'Status da tarefa atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
