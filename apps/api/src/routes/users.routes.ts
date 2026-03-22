import { Router } from 'express';
import { UserController } from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.post('/', authenticate, requireRole(['ADMIN', 'MANAGER']), UserController.create);
router.get('/profile', authenticate, UserController.getProfile);
router.put('/profile', authenticate, UserController.updateProfile);
router.get('/', authenticate, requireRole(['ADMIN', 'MANAGER']), UserController.list);
router.get('/:id', authenticate, requireRole(['ADMIN', 'MANAGER']), UserController.getById);
router.put('/:id', authenticate, requireRole(['ADMIN', 'MANAGER']), UserController.updateById);
router.patch('/:id/status', authenticate, requireRole(['ADMIN', 'MANAGER']), UserController.updateStatus);
router.delete('/:id', authenticate, requireRole(['ADMIN']), UserController.delete);

export default router;
