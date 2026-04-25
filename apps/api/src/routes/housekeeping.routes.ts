import { Router } from 'express';
import { HousekeepingController } from '../controllers/housekeeping.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import {
  createHousekeepingStaffSchema,
  createLostFoundItemSchema,
  updateHousekeepingStaffSchema,
  updateHousekeepingTaskStatusSchema,
  updateLostFoundItemSchema,
} from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/tasks', HousekeepingController.listTasks);
router.patch(
  '/tasks/:id/status',
  validateBody(updateHousekeepingTaskStatusSchema),
  HousekeepingController.updateStatus
);
router.get('/staff', HousekeepingController.listStaff);
router.post('/staff', validateBody(createHousekeepingStaffSchema), HousekeepingController.createStaff);
router.put('/staff/:id', validateBody(updateHousekeepingStaffSchema), HousekeepingController.updateStaff);
router.get('/lost-found', HousekeepingController.listLostFound);
router.post('/lost-found', validateBody(createLostFoundItemSchema), HousekeepingController.createLostFound);
router.put('/lost-found/:id', validateBody(updateLostFoundItemSchema), HousekeepingController.updateLostFound);

export default router;
