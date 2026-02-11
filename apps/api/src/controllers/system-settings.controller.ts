import { Request, Response, NextFunction } from 'express';
import { SystemSettingsService } from '../services/system-settings.service';
import { sendSuccess } from '../utils/response';

export class SystemSettingsController {
  static async getVisualIdentity(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SystemSettingsService.getVisualIdentity();
      return sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  static async updateVisualIdentity(req: Request, res: Response, next: NextFunction) {
    try {
      await SystemSettingsService.updateVisualIdentity(req.body);
      return sendSuccess(res, null, 'Identidade visual atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async getSEO(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SystemSettingsService.getSEO();
      return sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  static async updateSEO(req: Request, res: Response, next: NextFunction) {
    try {
      await SystemSettingsService.updateSEO(req.body);
      return sendSuccess(res, null, 'Configurações de SEO atualizadas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async getContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const content = await SystemSettingsService.getContent(key);
      return sendSuccess(res, { content });
    } catch (error) {
      next(error);
    }
  }

  static async updateContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const { content } = req.body;
      await SystemSettingsService.updateContent(key, content);
      return sendSuccess(res, null, 'Conteúdo atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async getPublicSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SystemSettingsService.getPublicSettings();
      return sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }
}
