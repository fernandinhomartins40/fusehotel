import { Router } from 'express';
import { RoomUnitsController } from '../controllers/room-units.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createRoomUnitSchema, updateRoomUnitSchema } from '../validators/pms.validators';

const router = Router();

router.get('/public', RoomUnitsController.listPublic);
router.get('/public/slug/:slug', RoomUnitsController.getPublicBySlug);
router.get('/public/:id', RoomUnitsController.getPublicById);
router.get('/', authenticate, requireRole(['ADMIN', 'MANAGER']), RoomUnitsController.list);
router.get(
  '/available/:accommodationId',
  authenticate,
  requireRole(['ADMIN', 'MANAGER']),
  RoomUnitsController.listAvailableByAccommodation
);
router.post(
  '/',
  authenticate,
  requireRole(['ADMIN', 'MANAGER']),
  validateBody(createRoomUnitSchema),
  RoomUnitsController.create
);
router.put(
  '/:id',
  authenticate,
  requireRole(['ADMIN', 'MANAGER']),
  validateBody(updateRoomUnitSchema),
  RoomUnitsController.update
);

export default router;
