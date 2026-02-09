import { Router } from 'express';
import { AmenityController } from '../controllers/amenities.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', AmenityController.list);
router.get('/:id', AmenityController.getById);
router.post('/', authenticate, requireRole(['ADMIN', 'MANAGER']), AmenityController.create);
router.put('/:id', authenticate, requireRole(['ADMIN', 'MANAGER']), AmenityController.update);
router.delete('/:id', authenticate, requireRole(['ADMIN']), AmenityController.delete);

export default router;
