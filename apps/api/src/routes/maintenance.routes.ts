import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenance.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import {
  createMaintenanceOrderSchema,
  updateMaintenanceOrderSchema,
} from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/', MaintenanceController.list);
router.post('/', validateBody(createMaintenanceOrderSchema), MaintenanceController.create);
router.patch('/:id', validateBody(updateMaintenanceOrderSchema), MaintenanceController.update);

export default router;
