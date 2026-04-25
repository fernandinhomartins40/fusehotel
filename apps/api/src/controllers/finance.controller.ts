import { NextFunction, Request, Response } from 'express';
import { FinanceService } from '../services/finance.service';
import { sendSuccess } from '../utils/response';

export class FinanceController {
  static async listEntries(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await FinanceService.listEntries());
    } catch (error) {
      next(error);
    }
  }

  static async createEntry(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await FinanceService.createEntry(req.body), 'Lançamento financeiro criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async registerSettlement(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await FinanceService.registerSettlement(req.params.id, req.body), 'Baixa financeira registrada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
