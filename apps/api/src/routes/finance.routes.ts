import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { FinanceController } from '../controllers/finance.controller';
import { createFinancialEntrySchema, registerFinancialSettlementSchema } from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/entries', FinanceController.listEntries);
router.post('/entries', validateBody(createFinancialEntrySchema), FinanceController.createEntry);
router.post('/entries/:id/settlements', validateBody(registerFinancialSettlementSchema), FinanceController.registerSettlement);

export default router;
