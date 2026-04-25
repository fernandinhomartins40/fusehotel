import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { DistributionController } from '../controllers/distribution.controller';
import {
  createChannelConnectionSchema,
  createInventoryBlockSchema,
  createRatePlanSchema,
  updateChannelConnectionSchema,
  updateInventoryBlockSchema,
  updateRatePlanSchema,
} from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/rate-plans', DistributionController.listRatePlans);
router.post('/rate-plans', validateBody(createRatePlanSchema), DistributionController.createRatePlan);
router.put('/rate-plans/:id', validateBody(updateRatePlanSchema), DistributionController.updateRatePlan);

router.get('/inventory-blocks', DistributionController.listInventoryBlocks);
router.post('/inventory-blocks', validateBody(createInventoryBlockSchema), DistributionController.createInventoryBlock);
router.put('/inventory-blocks/:id', validateBody(updateInventoryBlockSchema), DistributionController.updateInventoryBlock);

router.get('/channels', DistributionController.listChannels);
router.post('/channels', validateBody(createChannelConnectionSchema), DistributionController.createChannel);
router.put('/channels/:id', validateBody(updateChannelConnectionSchema), DistributionController.updateChannel);

export default router;
