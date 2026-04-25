import { NextFunction, Request, Response } from 'express';
import { FoliosService } from '../services/folios.service';
import { sendSuccess } from '../utils/response';

export class FoliosController {
  static async getByStay(req: Request, res: Response, next: NextFunction) {
    try {
      const folio = await FoliosService.getByStay(req.params.stayId);
      return sendSuccess(res, folio);
    } catch (error) {
      next(error);
    }
  }

  static async addEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const folio = await FoliosService.addEntry(req.params.folioId, req.body);
      return sendSuccess(res, folio, 'Lancamento registrado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
