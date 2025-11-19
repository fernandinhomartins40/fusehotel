/**
 * Accommodations Routes
 */

import { Router } from 'express';
import accommodationsController from '../controllers/accommodations.controller';
import { authenticateOptional, authenticate } from '../middlewares/auth.middleware';
import { requireManager } from '../middlewares/role.middleware';
import { validateIdParam, validateSlugParam } from '../middlewares/validate.middleware';

const router = Router();

// Public routes
router.get('/', authenticateOptional, accommodationsController.getAll);
router.get('/slug/:slug', validateSlugParam, authenticateOptional, accommodationsController.getBySlug);
router.get('/:id', validateIdParam, authenticateOptional, accommodationsController.getById);
router.post('/:id/check-availability', validateIdParam, accommodationsController.checkAvailability);

// Protected routes (Manager and above)
router.post('/', authenticate, requireManager, accommodationsController.create);
router.put('/:id', validateIdParam, authenticate, requireManager, accommodationsController.update);
router.delete('/:id', validateIdParam, authenticate, requireManager, accommodationsController.delete);
router.get('/stats', authenticate, requireManager, accommodationsController.getStats);

export default router;
