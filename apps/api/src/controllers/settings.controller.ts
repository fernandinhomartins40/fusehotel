import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';
import { sendSuccess } from '../utils/response';

export class SettingsController {
  static async getPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getPublic();
      return sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getAll();
      return sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }
}
