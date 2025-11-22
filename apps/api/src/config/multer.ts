/**
 * Multer Configuration
 *
 * Configuração de upload de arquivos com Sharp para processamento de imagens
 */

import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { env } from './environment';
import sharp from 'sharp';

/**
 * Tipos de arquivo permitidos
 */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

/**
 * Extensões permitidas
 */
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

/**
 * Cria o diretório de upload se não existir
 */
const ensureUploadDirectory = (uploadPath: string): void => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

/**
 * Storage em memória para processamento com Sharp
 */
const storage = multer.memoryStorage();

/**
 * Filtro de arquivos
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  // Verifica MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`));
    return;
  }

  // Verifica extensão
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    cb(new Error(`Extensão de arquivo não permitida: ${ext}`));
    return;
  }

  cb(null, true);
};

/**
 * Configuração do Multer
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 10,
  },
});

/**
 * Interface de opções de processamento de imagem
 */
export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Opções padrão de processamento
 */
const DEFAULT_OPTIONS: ImageProcessingOptions = {
  quality: 85,
  format: 'webp',
  fit: 'cover',
};

/**
 * Processa e salva uma imagem
 */
export const processAndSaveImage = async (
  file: Express.Multer.File,
  destinationFolder: string,
  options: ImageProcessingOptions = {}
): Promise<string> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Gera nome único para o arquivo
  const filename = `${uuidv4()}.${opts.format}`;
  const uploadDir = path.join(env.UPLOAD_PATH, destinationFolder);
  const filepath = path.join(uploadDir, filename);

  // Garante que o diretório existe
  ensureUploadDirectory(uploadDir);

  // Processa a imagem com Sharp
  let sharpInstance = sharp(file.buffer);

  // Redimensiona se especificado
  if (opts.width || opts.height) {
    sharpInstance = sharpInstance.resize(opts.width, opts.height, {
      fit: opts.fit,
      withoutEnlargement: true,
    });
  }

  // Converte para o formato especificado
  switch (opts.format) {
    case 'jpeg':
      sharpInstance = sharpInstance.jpeg({ quality: opts.quality });
      break;
    case 'png':
      sharpInstance = sharpInstance.png({ quality: opts.quality });
      break;
    case 'webp':
      sharpInstance = sharpInstance.webp({ quality: opts.quality });
      break;
  }

  // Salva a imagem
  await sharpInstance.toFile(filepath);

  // Retorna o caminho relativo
  return path.join(destinationFolder, filename).replace(/\\/g, '/');
};

/**
 * Processa múltiplas imagens
 */
export const processAndSaveMultipleImages = async (
  files: Express.Multer.File[],
  destinationFolder: string,
  options: ImageProcessingOptions = {}
): Promise<string[]> => {
  const promises = files.map((file) =>
    processAndSaveImage(file, destinationFolder, options)
  );
  return Promise.all(promises);
};

/**
 * Gera thumbnail de uma imagem
 */
export const generateThumbnail = async (
  file: Express.Multer.File,
  destinationFolder: string,
  size: number = 200
): Promise<string> => {
  return processAndSaveImage(file, destinationFolder, {
    width: size,
    height: size,
    quality: 80,
    format: 'webp',
    fit: 'cover',
  });
};

/**
 * Gera múltiplas versões de uma imagem
 */
export interface ImageVersions {
  original: string;
  large: string;
  medium: string;
  thumbnail: string;
}

export const generateImageVersions = async (
  file: Express.Multer.File,
  destinationFolder: string
): Promise<ImageVersions> => {
  const [original, large, medium, thumbnail] = await Promise.all([
    processAndSaveImage(file, `${destinationFolder}/original`, {
      quality: 95,
      format: 'webp',
    }),
    processAndSaveImage(file, `${destinationFolder}/large`, {
      width: 1920,
      quality: 85,
      format: 'webp',
    }),
    processAndSaveImage(file, `${destinationFolder}/medium`, {
      width: 1024,
      quality: 80,
      format: 'webp',
    }),
    processAndSaveImage(file, `${destinationFolder}/thumbnail`, {
      width: 400,
      height: 400,
      quality: 75,
      format: 'webp',
      fit: 'cover',
    }),
  ]);

  return { original, large, medium, thumbnail };
};

/**
 * Deleta um arquivo
 */
export const deleteFile = async (filepath: string): Promise<void> => {
  const fullPath = path.join(env.UPLOAD_PATH, filepath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

/**
 * Deleta múltiplos arquivos
 */
export const deleteMultipleFiles = async (filepaths: string[]): Promise<void> => {
  await Promise.all(filepaths.map((filepath) => deleteFile(filepath)));
};

/**
 * Verifica se um arquivo existe
 */
export const fileExists = (filepath: string): boolean => {
  const fullPath = path.join(env.UPLOAD_PATH, filepath);
  return fs.existsSync(fullPath);
};

/**
 * Obtém informações de um arquivo
 */
export interface FileInfo {
  exists: boolean;
  size?: number;
  extension?: string;
  mimetype?: string;
}

export const getFileInfo = (filepath: string): FileInfo => {
  const fullPath = path.join(env.UPLOAD_PATH, filepath);

  if (!fs.existsSync(fullPath)) {
    return { exists: false };
  }

  const stats = fs.statSync(fullPath);
  const extension = path.extname(filepath);

  return {
    exists: true,
    size: stats.size,
    extension,
  };
};

/**
 * Inicializa os diretórios de upload
 */
export const initializeUploadDirectories = (): void => {
  const directories = [
    'accommodations',
    'accommodations/original',
    'accommodations/large',
    'accommodations/medium',
    'accommodations/thumbnail',
    'promotions',
    'users',
    'documents',
  ];

  directories.forEach((dir) => {
    ensureUploadDirectory(path.join(env.UPLOAD_PATH, dir));
  });

  console.log('✅ Upload directories initialized');
};
