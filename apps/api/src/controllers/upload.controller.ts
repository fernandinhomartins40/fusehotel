import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { sendSuccess } from '../utils/response';

export class UploadController {
  static async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });
      }
      const result = await UploadService.uploadImage(req.file);
      return sendSuccess(res, result, 'Upload realizado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
