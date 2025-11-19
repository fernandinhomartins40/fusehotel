import { Router } from 'express';
import { PromotionController } from '../controllers/promotions.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', PromotionController.list);
router.get('/:id', PromotionController.getById);
router.get('/slug/:slug', PromotionController.getBySlug);
router.post('/', authenticate, requireRole(['ADMIN', 'MANAGER']), PromotionController.create);

export default router;
