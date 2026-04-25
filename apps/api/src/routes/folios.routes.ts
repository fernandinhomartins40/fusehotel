import { Router } from 'express';
import { FoliosController } from '../controllers/folios.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createFolioEntrySchema } from '../validators/pms.validators';

const router = Router();

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/stay/:stayId', FoliosController.getByStay);
router.post('/:folioId/entries', validateBody(createFolioEntrySchema), FoliosController.addEntry);

export default router;
