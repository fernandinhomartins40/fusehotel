import { Request, Response, NextFunction } from 'express';
import { AccommodationService } from '../services/accommodations.service';
import { sendSuccess } from '../utils/response';

export class AccommodationController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      // Convert string query params to proper types
      const filters: any = { ...req.query };
      if (filters.isAvailable !== undefined) {
        filters.isAvailable = filters.isAvailable === 'true' || filters.isAvailable === true;
      }
      if (filters.isFeatured !== undefined) {
        filters.isFeatured = filters.isFeatured === 'true' || filters.isFeatured === true;
      }
      if (filters.minPrice) filters.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) filters.maxPrice = Number(filters.maxPrice);
      if (filters.minCapacity) filters.minCapacity = Number(filters.minCapacity);

      const accommodations = await AccommodationService.list(filters);
      return sendSuccess(res, accommodations);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const accommodation = await AccommodationService.getById(req.params.id);
      return sendSuccess(res, accommodation);
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const accommodation = await AccommodationService.getBySlug(req.params.slug);
      return sendSuccess(res, accommodation);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const accommodation = await AccommodationService.create(req.body);
      return sendSuccess(res, accommodation, 'Acomodação criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const accommodation = await AccommodationService.update(req.params.id, req.body);
      return sendSuccess(res, accommodation, 'Acomodação atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await AccommodationService.delete(req.params.id);
      return sendSuccess(res, null, 'Acomodação deletada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
