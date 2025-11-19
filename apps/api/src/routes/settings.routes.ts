import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/public', SettingsController.getPublic);
router.get('/', authenticate, requireRole(['ADMIN']), SettingsController.getAll);

export default router;
