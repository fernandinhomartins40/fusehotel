import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { InventoryController } from '../controllers/inventory.controller';
import { createInventoryMovementSchema } from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/products', InventoryController.listProducts);
router.post('/movements', validateBody(createInventoryMovementSchema), InventoryController.createMovement);

export default router;
