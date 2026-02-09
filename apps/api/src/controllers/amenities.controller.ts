import { Request, Response, NextFunction } from 'express';
import { AmenityService } from '../services/amenities.service';
import { sendSuccess } from '../utils/response';

export class AmenityController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const amenities = await AmenityService.list();
      return sendSuccess(res, amenities);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const amenity = await AmenityService.getById(req.params.id);
      return sendSuccess(res, amenity);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const amenity = await AmenityService.create(req.body);
      return sendSuccess(res, amenity, 'Amenidade criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const amenity = await AmenityService.update(req.params.id, req.body);
      return sendSuccess(res, amenity, 'Amenidade atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await AmenityService.delete(req.params.id);
      return sendSuccess(res, null, 'Amenidade deletada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
