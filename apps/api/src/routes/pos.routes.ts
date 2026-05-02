import { Router } from 'express';
import { POSController } from '../controllers/pos.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import {
  cancelPOSOrderSchema,
  closeCashSessionSchema,
  createCashMovementSchema,
  createPOSOrderSchema,
  createPOSProductSchema,
  openCashSessionSchema,
  refundPOSPaymentSchema,
  registerPOSPaymentSchema,
  updatePOSOrderSchema,
  updatePOSOrderStatusSchema,
} from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/products', POSController.listProducts);
router.post('/products', validateBody(createPOSProductSchema), POSController.createProduct);
router.put('/products/:id', validateBody(createPOSProductSchema), POSController.updateProduct);
router.delete('/products/:id', POSController.deleteProduct);
router.get('/orders', POSController.listOrders);
router.post('/orders', validateBody(createPOSOrderSchema), POSController.createOrder);
router.patch('/orders/:id', validateBody(updatePOSOrderSchema), POSController.updateOrder);
router.patch('/orders/:id/status', validateBody(updatePOSOrderStatusSchema), POSController.updateOrderStatus);
router.post('/orders/:id/cancel', validateBody(cancelPOSOrderSchema), POSController.cancelOrder);
router.get('/cash-sessions/active', POSController.getActiveCashSession);
router.get('/cash-sessions', POSController.listCashSessions);
router.post('/cash-sessions/open', validateBody(openCashSessionSchema), POSController.openCashSession);
router.post('/cash-sessions/close', validateBody(closeCashSessionSchema), POSController.closeCashSession);
router.post('/cash-sessions/movements', validateBody(createCashMovementSchema), POSController.createCashMovement);
router.post('/payments', validateBody(registerPOSPaymentSchema), POSController.registerPayment);
router.post('/payments/refund', validateBody(refundPOSPaymentSchema), POSController.refundPayment);

export default router;
