import { Router } from 'express';
import { PromotionController } from '../controllers/promotions.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', PromotionController.list);
router.get('/slug/:slug', PromotionController.getBySlug);
router.get('/:id', PromotionController.getById);
router.post('/', authenticate, requireRole(['ADMIN', 'MANAGER']), PromotionController.create);
router.put('/:id', authenticate, requireRole(['ADMIN', 'MANAGER']), PromotionController.update);
router.delete('/:id', authenticate, requireRole(['ADMIN']), PromotionController.delete);

export default router;
