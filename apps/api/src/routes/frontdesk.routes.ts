import { Router } from 'express';
import { FrontdeskController } from '../controllers/frontdesk.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { checkInSchema, checkOutSchema } from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/dashboard', FrontdeskController.dashboard);
router.get('/stays', FrontdeskController.listStays);
router.post('/check-in', validateBody(checkInSchema), FrontdeskController.checkIn);
router.post('/check-out', validateBody(checkOutSchema), FrontdeskController.checkOut);

export default router;
