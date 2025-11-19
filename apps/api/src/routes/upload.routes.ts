/**
 * Upload Routes
 */

import { Router } from 'express';
import uploadController from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireManager } from '../middlewares/role.middleware';
import { uploadRateLimiter } from '../middlewares/rate-limiter.middleware';
import { upload } from '../config/multer';

const router = Router();

// All routes require authentication and manager role
router.use(authenticate, requireManager);

// Upload routes
router.post('/image', uploadRateLimiter, upload.single('file'), uploadController.uploadImage);
router.post('/images', uploadRateLimiter, upload.array('files', 10), uploadController.uploadMultiple);
router.post('/image-versions', uploadRateLimiter, upload.single('file'), uploadController.uploadImageWithVersions);

// Delete routes
router.delete('/', uploadController.deleteFile);
router.delete('/multiple', uploadController.deleteMultiple);

export default router;
