import { Router } from 'express';
import { scheduleController } from '../controllers/schedule.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All schedule routes require authentication (admin/manager only)
router.get('/', authenticate, scheduleController.getSchedule);
router.get('/availability/:accommodationId', authenticate, scheduleController.checkAvailability);
router.get('/stats', authenticate, scheduleController.getStats);

export default router;
