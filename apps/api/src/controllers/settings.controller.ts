import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';
import { sendSuccess } from '../utils/response';

export class SettingsController {
  static async getHotelSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getHotelSettings();
      return sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  static async updateHotelSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.updateHotelSettings(req.body);
      return sendSuccess(res, settings, 'Configurações atualizadas com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
