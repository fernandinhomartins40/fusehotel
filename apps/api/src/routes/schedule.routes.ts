import { Router } from 'express';
import { scheduleController } from '../controllers/schedule.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authenticate, requireRole(['ADMIN', 'MANAGER']), scheduleController.getSchedule);
router.get('/availability/:accommodationId', scheduleController.checkAvailability);
router.get('/stats', authenticate, requireRole(['ADMIN', 'MANAGER']), scheduleController.getStats);

export default router;
