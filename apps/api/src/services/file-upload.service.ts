import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';

export class FileUploadService {
  private static UPLOAD_DIR = path.join(process.cwd(), 'uploads');

  static getMulterConfig(category: string) {
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        const dir = path.join(this.UPLOAD_DIR, category);
        try {
          await fs.mkdir(dir, { recursive: true });
          cb(null, dir);
        } catch (error) {
          cb(error as Error, dir);
        }
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
      }
    });

    return multer({
      storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de arquivo não permitido. Apenas JPEG, PNG e WEBP.'));
        }
      }
    });
  }

  static async optimizeImage(filePath: string): Promise<void> {
    try {
      const buffer = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();

      let optimized;

      if (ext === '.png') {
        optimized = await sharp(buffer)
          .resize(2000, 2000, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .png({ quality: 85, compressionLevel: 9 })
          .toBuffer();
      } else if (ext === '.webp') {
        optimized = await sharp(buffer)
          .resize(2000, 2000, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 85 })
          .toBuffer();
      } else {
        // JPEG/JPG
        optimized = await sharp(buffer)
          .resize(2000, 2000, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 85 })
          .toBuffer();
      }

      await fs.writeFile(filePath, optimized);
    } catch (error) {
      console.error('Erro ao otimizar imagem:', error);
      throw error;
    }
  }

  static async saveFileRecord(data: {
    filename: string;
    storedName: string;
    path: string;
    mimetype: string;
    size: number;
    category: string;
    uploadedBy?: string;
    alt?: string;
  }) {
    return await prisma.uploadedFile.create({
      data: {
        filename: data.filename,
        storedName: data.storedName,
        path: data.path,
        url: `/uploads/${data.path.replace(/\\/g, '/')}`,
        mimetype: data.mimetype,
        size: data.size,
        category: data.category as any,
        uploadedBy: data.uploadedBy,
        alt: data.alt,
      }
    });
  }

  static async deleteFile(fileId: string): Promise<void> {
    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      throw new Error('Arquivo não encontrado');
    }

    const fullPath = path.join(this.UPLOAD_DIR, file.path);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Erro ao deletar arquivo físico:', error);
    }

    await prisma.uploadedFile.delete({
      where: { id: fileId }
    });
  }

  static async listFiles(category?: string) {
    return await prisma.uploadedFile.findMany({
      where: category ? { category: category as any } : undefined,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async generateThumbnail(filePath: string): Promise<string> {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const basename = path.basename(filePath, ext);
    const thumbnailPath = path.join(dir, `${basename}_thumb${ext}`);

    await sharp(filePath)
      .resize(300, 300, { fit: 'cover' })
      .toFile(thumbnailPath);

    return thumbnailPath;
  }

  static async getFileById(id: string) {
    return await prisma.uploadedFile.findUnique({
      where: { id }
    });
  }
}
