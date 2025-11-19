/**
 * Users Routes
 */

import { Router } from 'express';
import usersController from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin, requireManager, requireOwnerOrAdmin } from '../middlewares/role.middleware';
import { validateIdParam } from '../middlewares/validate.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', usersController.getProfile);
router.put('/profile', usersController.updateProfile);

// Admin routes
router.get('/', requireManager, usersController.getAll);
router.get('/stats', requireManager, usersController.getStats);
router.get('/:id', validateIdParam, usersController.getById);
router.put('/:id', validateIdParam, requireOwnerOrAdmin((req) => req.params.id), usersController.update);
router.delete('/:id', validateIdParam, requireAdmin, usersController.delete);
router.put('/:id/role', validateIdParam, requireAdmin, usersController.changeRole);
router.put('/:id/toggle-active', validateIdParam, requireAdmin, usersController.toggleActive);

export default router;
