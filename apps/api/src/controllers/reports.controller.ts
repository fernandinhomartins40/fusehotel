import { NextFunction, Request, Response } from 'express';
import { ReportsService } from '../services/reports.service';
import { sendSuccess } from '../utils/response';

export class ReportsController {
  static async operations(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await ReportsService.getOperationsSummary(
        typeof req.query.date === 'string' ? req.query.date : undefined
      );
      return sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }
}
