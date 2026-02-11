import { Request, Response, NextFunction } from 'express';
import { AwardService } from '../services/award.service';
import { sendSuccess } from '../utils/response';

export class AwardController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const awards = await AwardService.getAll();
      return sendSuccess(res, awards);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const awards = await AwardService.getAllAdmin();
      return sendSuccess(res, awards);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const award = await AwardService.getById(id);
      return sendSuccess(res, award);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const award = await AwardService.create(req.body);
      return sendSuccess(res, award, 'Prêmio criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const award = await AwardService.update(id, req.body);
      return sendSuccess(res, award, 'Prêmio atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AwardService.delete(id);
      return sendSuccess(res, null, 'Prêmio deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { awardIds } = req.body;
      await AwardService.reorder(awardIds);
      return sendSuccess(res, null, 'Ordem atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
