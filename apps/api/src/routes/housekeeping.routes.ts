import { Router } from 'express';
import { HousekeepingController } from '../controllers/housekeeping.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { updateHousekeepingTaskStatusSchema } from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/tasks', HousekeepingController.listTasks);
router.patch(
  '/tasks/:id/status',
  validateBody(updateHousekeepingTaskStatusSchema),
  HousekeepingController.updateStatus
);

export default router;
