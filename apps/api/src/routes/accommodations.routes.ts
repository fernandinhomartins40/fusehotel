import { Router } from 'express';
import { AccommodationController } from '../controllers/accommodations.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', AccommodationController.list);
router.get('/:id', AccommodationController.getById);
router.get('/slug/:slug', AccommodationController.getBySlug);
router.post('/', authenticate, requireRole(['ADMIN', 'MANAGER']), AccommodationController.create);
router.put('/:id', authenticate, requireRole(['ADMIN', 'MANAGER']), AccommodationController.update);
router.delete('/:id', authenticate, requireRole(['ADMIN']), AccommodationController.delete);

export default router;
