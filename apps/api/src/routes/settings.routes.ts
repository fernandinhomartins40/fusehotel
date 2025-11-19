/**
 * Settings Routes
 */

import { Router } from 'express';
import settingsController from '../controllers/settings.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireManager } from '../middlewares/role.middleware';

const router = Router();

// Public routes
router.get('/public', settingsController.getPublic);

// Protected routes (Manager and above)
router.use(authenticate, requireManager);

router.get('/', settingsController.getAll);
router.get('/:category', settingsController.getByCategory);
router.get('/:category/object', settingsController.getAsObject);
router.get('/:category/:key', settingsController.getOne);
router.post('/', settingsController.create);
router.put('/:category/:key', settingsController.update);
router.put('/bulk', settingsController.updateMultiple);
router.delete('/:category/:key', settingsController.delete);

export default router;
