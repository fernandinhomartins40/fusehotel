import { Request, Response, NextFunction } from 'express';
import { FileUploadService } from '../services/file-upload.service';
import { sendSuccess, sendError } from '../utils/response';

export class UploadController {
  static async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return sendError(res, 'Nenhum arquivo enviado', 400);
      }

      const { category = 'GENERAL', alt } = req.body;
      const userId = (req as any).user?.id;

      await FileUploadService.optimizeImage(req.file.path);

      const relativePath = req.file.path.replace(/\\/g, '/').split('uploads/')[1];

      const fileRecord = await FileUploadService.saveFileRecord({
        filename: req.file.originalname,
        storedName: req.file.filename,
        path: relativePath,
        mimetype: req.file.mimetype,
        size: req.file.size,
        category,
        uploadedBy: userId,
        alt
      });

      return sendSuccess(res, fileRecord, 'Arquivo enviado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return sendError(res, 'Nenhum arquivo enviado', 400);
      }

      const { category = 'GENERAL' } = req.body;
      const userId = (req as any).user?.id;

      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          await FileUploadService.optimizeImage(file.path);

          const relativePath = file.path.replace(/\\/g, '/').split('uploads/')[1];

          return await FileUploadService.saveFileRecord({
            filename: file.originalname,
            storedName: file.filename,
            path: relativePath,
            mimetype: file.mimetype,
            size: file.size,
            category,
            uploadedBy: userId
          });
        })
      );

      return sendSuccess(res, uploadedFiles, 'Arquivos enviados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async listFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;
      const files = await FileUploadService.listFiles(category as string);
      return sendSuccess(res, files);
    } catch (error) {
      next(error);
    }
  }

  static async getFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const file = await FileUploadService.getFileById(id);

      if (!file) {
        return sendError(res, 'Arquivo não encontrado', 404);
      }

      return sendSuccess(res, file);
    } catch (error) {
      next(error);
    }
  }

  static async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await FileUploadService.deleteFile(id);
      return sendSuccess(res, null, 'Arquivo deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
