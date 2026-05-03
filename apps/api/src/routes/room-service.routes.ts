import { Router } from 'express';
import { RoomServiceController } from '../controllers/room-service.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import {
  confirmRoomServiceConferenceSchema,
  createGuestRoomServiceOrderSchema,
  toggleDoNotDisturbSchema,
  upsertRoomServiceConfigurationSchema,
} from '../validators/pms.validators';

const router = Router();

router.use(authenticate);

router.get('/my-stay', RoomServiceController.myStay);
router.get('/catalog', RoomServiceController.catalog);
router.get('/my-orders', RoomServiceController.myOrders);
router.post(
  '/my-orders',
  validateBody(createGuestRoomServiceOrderSchema),
  RoomServiceController.createMyOrder
);
router.post(
  '/do-not-disturb',
  validateBody(toggleDoNotDisturbSchema),
  RoomServiceController.toggleDoNotDisturb
);

router.get('/configurations', requireRole(['ADMIN', 'MANAGER']), RoomServiceController.listConfigurations);
router.post(
  '/configurations',
  requireRole(['ADMIN', 'MANAGER']),
  validateBody(upsertRoomServiceConfigurationSchema),
  RoomServiceController.upsertConfiguration
);
router.delete('/configurations/:id', requireRole(['ADMIN', 'MANAGER']), RoomServiceController.deleteConfiguration);
router.get('/checkout/:stayId', requireRole(['ADMIN', 'MANAGER']), RoomServiceController.getConferencePreview);
router.post(
  '/checkout/:stayId',
  requireRole(['ADMIN', 'MANAGER']),
  validateBody(confirmRoomServiceConferenceSchema),
  RoomServiceController.confirmConference
);

export default router;
