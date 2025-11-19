/**
 * Upload Controller
 *
 * Controller de gerenciamento de uploads
 */

import { Request, Response } from 'express';
import uploadService from '../services/upload.service';
import { success, created } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';
import { ValidationError } from '../utils/errors';

export class UploadController {
  /**
   * POST /upload/image
   * Faz upload de uma única imagem
   */
  uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ValidationError('No file provided');
    }

    const folder = (req.body.folder as string) || 'general';
    const url = await uploadService.uploadImage(req.file, folder);

    return created(res, { url }, 'Image uploaded successfully');
  });

  /**
   * POST /upload/images
   * Faz upload de múltiplas imagens
   */
  uploadMultiple = asyncHandler(async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new ValidationError('No files provided');
    }

    const folder = (req.body.folder as string) || 'general';
    const urls = await uploadService.uploadMultiple(req.files, folder);

    return created(res, { urls }, 'Images uploaded successfully');
  });

  /**
   * POST /upload/image-versions
   * Faz upload de imagem com múltiplas versões
   */
  uploadImageWithVersions = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ValidationError('No file provided');
    }

    const folder = (req.body.folder as string) || 'general';
    const versions = await uploadService.uploadImageWithVersions(req.file, folder);

    return created(res, versions, 'Image versions uploaded successfully');
  });

  /**
   * DELETE /upload
   * Deleta um arquivo
   */
  deleteFile = asyncHandler(async (req: Request, res: Response) => {
    const { filepath } = req.body;

    if (!filepath) {
      throw new ValidationError('Filepath is required');
    }

    await uploadService.deleteFile(filepath);

    return success(res, null, 'File deleted successfully');
  });

  /**
   * DELETE /upload/multiple
   * Deleta múltiplos arquivos
   */
  deleteMultiple = asyncHandler(async (req: Request, res: Response) => {
    const { filepaths } = req.body;

    if (!filepaths || !Array.isArray(filepaths) || filepaths.length === 0) {
      throw new ValidationError('Filepaths array is required');
    }

    await uploadService.deleteMultiple(filepaths);

    return success(res, null, 'Files deleted successfully');
  });
}

export default new UploadController();
