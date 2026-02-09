import { Request, Response, NextFunction } from 'express';
import { HeroSlideService } from '../services/hero-slide.service';
import { sendSuccess } from '../utils/response';

export class HeroSlideController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const slides = await HeroSlideService.getAll();
      return sendSuccess(res, slides);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const slides = await HeroSlideService.getAllAdmin();
      return sendSuccess(res, slides);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const slide = await HeroSlideService.getById(id);
      return sendSuccess(res, slide);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const slide = await HeroSlideService.create(req.body);
      return sendSuccess(res, slide, 'Slide criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const slide = await HeroSlideService.update(id, req.body);
      return sendSuccess(res, slide, 'Slide atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await HeroSlideService.delete(id);
      return sendSuccess(res, null, 'Slide deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { slideIds } = req.body;
      await HeroSlideService.reorder(slideIds);
      return sendSuccess(res, null, 'Ordem atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
