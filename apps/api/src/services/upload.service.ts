/**
 * Upload Service
 *
 * Serviço de gerenciamento de uploads
 */

import {
  processAndSaveImage,
  processAndSaveMultipleImages,
  generateImageVersions,
  deleteFile,
  deleteMultipleFiles,
  ImageVersions,
} from '../config/multer';
import logger from '../utils/logger';
import { FileUploadError } from '../utils/errors';

/**
 * Service de upload
 */
export class UploadService {
  /**
   * Faz upload de uma única imagem
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'general'
  ): Promise<string> {
    try {
      const url = await processAndSaveImage(file, folder);

      logger.info('Image uploaded', { url, folder });

      return url;
    } catch (error) {
      logger.error('Image upload failed', error);
      throw new FileUploadError('Failed to upload image');
    }
  }

  /**
   * Faz upload de múltiplas imagens
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string = 'general'
  ): Promise<string[]> {
    try {
      const urls = await processAndSaveMultipleImages(files, folder);

      logger.info('Multiple images uploaded', { count: files.length, folder });

      return urls;
    } catch (error) {
      logger.error('Multiple images upload failed', error);
      throw new FileUploadError('Failed to upload images');
    }
  }

  /**
   * Faz upload de imagem com múltiplas versões
   */
  async uploadImageWithVersions(
    file: Express.Multer.File,
    folder: string = 'general'
  ): Promise<ImageVersions> {
    try {
      const versions = await generateImageVersions(file, folder);

      logger.info('Image with versions uploaded', { folder });

      return versions;
    } catch (error) {
      logger.error('Image with versions upload failed', error);
      throw new FileUploadError('Failed to upload image with versions');
    }
  }

  /**
   * Deleta um arquivo
   */
  async deleteFile(filepath: string): Promise<void> {
    try {
      await deleteFile(filepath);

      logger.info('File deleted', { filepath });
    } catch (error) {
      logger.error('File deletion failed', error);
      throw new FileUploadError('Failed to delete file');
    }
  }

  /**
   * Deleta múltiplos arquivos
   */
  async deleteMultiple(filepaths: string[]): Promise<void> {
    try {
      await deleteMultipleFiles(filepaths);

      logger.info('Multiple files deleted', { count: filepaths.length });
    } catch (error) {
      logger.error('Multiple files deletion failed', error);
      throw new FileUploadError('Failed to delete files');
    }
  }
}

export default new UploadService();
