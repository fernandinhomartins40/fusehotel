/**
 * Promotions Routes
 */

import { Router } from 'express';
import promotionsController from '../controllers/promotions.controller';
import { authenticateOptional, authenticate } from '../middlewares/auth.middleware';
import { requireManager } from '../middlewares/role.middleware';
import { validateIdParam, validateSlugParam } from '../middlewares/validate.middleware';

const router = Router();

// Public routes
router.get('/', authenticateOptional, promotionsController.getAll);
router.get('/slug/:slug', validateSlugParam, authenticateOptional, promotionsController.getBySlug);
router.get('/:id', validateIdParam, authenticateOptional, promotionsController.getById);
router.post('/validate-code', promotionsController.validateCode);

// Protected routes (Manager and above)
router.post('/', authenticate, requireManager, promotionsController.create);
router.put('/:id', validateIdParam, authenticate, requireManager, promotionsController.update);
router.delete('/:id', validateIdParam, authenticate, requireManager, promotionsController.delete);

export default router;
