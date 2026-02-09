import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { FileUploadService } from '../services/file-upload.service';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post(
  '/single/:category',
  (req, res, next) => {
    const upload = FileUploadService.getMulterConfig(req.params.category);
    upload.single('file')(req, res, next);
  },
  UploadController.uploadSingle
);

router.post(
  '/multiple/:category',
  (req, res, next) => {
    const upload = FileUploadService.getMulterConfig(req.params.category);
    upload.array('files', 10)(req, res, next);
  },
  UploadController.uploadMultiple
);

router.get('/', UploadController.listFiles);
router.get('/:id', UploadController.getFile);
router.delete('/:id', UploadController.deleteFile);

export default router;
