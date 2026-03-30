import { Router } from 'express';
import { AccommodationController } from '../controllers/accommodations.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createAccommodationSchema, updateAccommodationSchema } from '@fusehotel/shared';

const router = Router();

router.get('/', AccommodationController.list);
router.get('/slug/:slug', AccommodationController.getBySlug);
router.get('/:id', AccommodationController.getById);
router.post(
  '/',
  authenticate,
  requireRole(['ADMIN', 'MANAGER']),
  validateBody(createAccommodationSchema),
  AccommodationController.create
);
router.put(
  '/:id',
  authenticate,
  requireRole(['ADMIN', 'MANAGER']),
  validateBody(updateAccommodationSchema),
  AccommodationController.update
);
router.delete('/:id', authenticate, requireRole(['ADMIN']), AccommodationController.delete);

export default router;
