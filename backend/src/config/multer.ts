import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FILE_UPLOAD } from '../utils/constants';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get upload category from query or default to 'temp'
    const category = (req.query.category as string) || 'temp';
    const uploadPath = path.join(process.cwd(), 'uploads', category);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-uuid-originalname
    const timestamp = Date.now();
    const uniqueId = uuidv4().split('-')[0]; // First part of UUID
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    const filename = `${timestamp}-${uniqueId}-${sanitizedName}${ext}`;
    cb(null, filename);
  },
});

// File filter - only allow images
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.'));
  }
};

// Single file upload
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
  },
}).single('image');

// Multiple files upload
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
    files: FILE_UPLOAD.MAX_IMAGES_PER_ACCOMMODATION,
  },
}).array('images', FILE_UPLOAD.MAX_IMAGES_PER_ACCOMMODATION);

// Export multer instance for custom usage
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
  },
});

export default upload;
