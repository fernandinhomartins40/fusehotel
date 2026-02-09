import { Request, Response, NextFunction } from 'express';
import { HighlightService } from '../services/highlight.service';
import { GalleryService } from '../services/gallery.service';
import { PartnerService } from '../services/partner.service';
import { LandingSettingsService } from '../services/landing-settings.service';
import { sendSuccess } from '../utils/response';

export class HighlightController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const highlights = await HighlightService.getAll();
      return sendSuccess(res, highlights);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const highlights = await HighlightService.getAllAdmin();
      return sendSuccess(res, highlights);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const highlight = await HighlightService.getById(id);
      return sendSuccess(res, highlight);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const highlight = await HighlightService.create(req.body);
      return sendSuccess(res, highlight, 'Destaque criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const highlight = await HighlightService.update(id, req.body);
      return sendSuccess(res, highlight, 'Destaque atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await HighlightService.delete(id);
      return sendSuccess(res, null, 'Destaque deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { highlightIds } = req.body;
      await HighlightService.reorder(highlightIds);
      return sendSuccess(res, null, 'Ordem atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export class GalleryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const images = await GalleryService.getAll();
      return sendSuccess(res, images);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const images = await GalleryService.getAllAdmin();
      return sendSuccess(res, images);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const image = await GalleryService.getById(id);
      return sendSuccess(res, image);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const image = await GalleryService.create(req.body);
      return sendSuccess(res, image, 'Imagem criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const image = await GalleryService.update(id, req.body);
      return sendSuccess(res, image, 'Imagem atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await GalleryService.delete(id);
      return sendSuccess(res, null, 'Imagem deletada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageIds } = req.body;
      await GalleryService.reorder(imageIds);
      return sendSuccess(res, null, 'Ordem atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export class PartnerController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const partners = await PartnerService.getAll();
      return sendSuccess(res, partners);
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const partners = await PartnerService.getAllAdmin();
      return sendSuccess(res, partners);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const partner = await PartnerService.getById(id);
      return sendSuccess(res, partner);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const partner = await PartnerService.create(req.body);
      return sendSuccess(res, partner, 'Parceiro criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const partner = await PartnerService.update(id, req.body);
      return sendSuccess(res, partner, 'Parceiro atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await PartnerService.delete(id);
      return sendSuccess(res, null, 'Parceiro deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { partnerIds } = req.body;
      await PartnerService.reorder(partnerIds);
      return sendSuccess(res, null, 'Ordem atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export class LandingSettingsController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { section } = req.params;
      const settings = await LandingSettingsService.get(section);
      return sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await LandingSettingsService.getAll();
      return sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  static async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const { section } = req.params;
      const settings = await LandingSettingsService.upsert(section, req.body.config);
      return sendSuccess(res, settings, 'Configurações salvas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { section } = req.params;
      await LandingSettingsService.delete(section);
      return sendSuccess(res, null, 'Configurações deletadas com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
