import { NextFunction, Request, Response } from 'express';
import { RoomUnitsService } from '../services/room-units.service';
import { sendSuccess } from '../utils/response';

export class RoomUnitsController {
  static async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const roomUnits = await RoomUnitsService.listPublic({
        isFeatured:
          req.query.isFeatured === undefined
            ? undefined
            : req.query.isFeatured === 'true',
      });
      return sendSuccess(res, roomUnits);
    } catch (error) {
      next(error);
    }
  }

  static async getPublicBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const roomUnit = await RoomUnitsService.getPublicBySlug(req.params.slug);
      return sendSuccess(res, roomUnit);
    } catch (error) {
      next(error);
    }
  }

  static async getPublicById(req: Request, res: Response, next: NextFunction) {
    try {
      const roomUnit = await RoomUnitsService.getPublicById(req.params.id);
      return sendSuccess(res, roomUnit);
    } catch (error) {
      next(error);
    }
  }

  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const roomUnits = await RoomUnitsService.list();
      return sendSuccess(res, roomUnits);
    } catch (error) {
      next(error);
    }
  }

  static async listAvailableByAccommodation(req: Request, res: Response, next: NextFunction) {
    try {
      const roomUnits = await RoomUnitsService.getAvailableByAccommodation(req.params.accommodationId);
      return sendSuccess(res, roomUnits);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const roomUnit = await RoomUnitsService.create(req.body);
      return sendSuccess(res, roomUnit, 'Quarto cadastrado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const roomUnit = await RoomUnitsService.update(req.params.id, req.body);
      return sendSuccess(res, roomUnit, 'Quarto atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
