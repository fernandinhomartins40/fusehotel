import { NextFunction, Request, Response } from 'express';
import { DistributionService } from '../services/distribution.service';
import { sendSuccess } from '../utils/response';

export class DistributionController {
  static async listRatePlans(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await DistributionService.listRatePlans());
    } catch (error) {
      next(error);
    }
  }

  static async createRatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await DistributionService.createRatePlan(req.body), 'Tarifa criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateRatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await DistributionService.updateRatePlan(req.params.id, req.body), 'Tarifa atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async listInventoryBlocks(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await DistributionService.listInventoryBlocks());
    } catch (error) {
      next(error);
    }
  }

  static async createInventoryBlock(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await DistributionService.createInventoryBlock(req.body), 'Bloqueio criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateInventoryBlock(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await DistributionService.updateInventoryBlock(req.params.id, req.body), 'Bloqueio atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async listChannels(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await DistributionService.listChannels());
    } catch (error) {
      next(error);
    }
  }

  static async createChannel(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await DistributionService.createChannel(req.body), 'Canal criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateChannel(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await DistributionService.updateChannel(req.params.id, req.body), 'Canal atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
