import { Router } from 'express';
import { POSController } from '../controllers/pos.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import {
  createPOSOrderSchema,
  createPOSProductSchema,
  updatePOSOrderStatusSchema,
} from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/products', POSController.listProducts);
router.post('/products', validateBody(createPOSProductSchema), POSController.createProduct);
router.get('/orders', POSController.listOrders);
router.post('/orders', validateBody(createPOSOrderSchema), POSController.createOrder);
router.patch('/orders/:id/status', validateBody(updatePOSOrderStatusSchema), POSController.updateOrderStatus);

export default router;
