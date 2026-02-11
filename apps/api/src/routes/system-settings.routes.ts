import { Router } from 'express';
import { SystemSettingsController } from '../controllers/system-settings.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Public routes
router.get('/public', SystemSettingsController.getPublicSettings);

// Admin routes - Visual Identity
router.get(
  '/visual-identity',
  authenticate,
  requireRole(['ADMIN']),
  SystemSettingsController.getVisualIdentity
);
router.put(
  '/visual-identity',
  authenticate,
  requireRole(['ADMIN']),
  SystemSettingsController.updateVisualIdentity
);

// Admin routes - SEO
router.get('/seo', authenticate, requireRole(['ADMIN']), SystemSettingsController.getSEO);
router.put('/seo', authenticate, requireRole(['ADMIN']), SystemSettingsController.updateSEO);

// Admin routes - Content (policies, terms, etc.)
router.get(
  '/content/:key',
  authenticate,
  requireRole(['ADMIN']),
  SystemSettingsController.getContent
);
router.put(
  '/content/:key',
  authenticate,
  requireRole(['ADMIN']),
  SystemSettingsController.updateContent
);

export default router;
