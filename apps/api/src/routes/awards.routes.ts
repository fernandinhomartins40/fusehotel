import { Router } from 'express';
import { AwardController } from '../controllers/award.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Awards - Public
router.get('/awards', AwardController.getAll);
router.get('/awards/:id', AwardController.getById);

// Awards - Admin (protected)
router.get('/admin/awards', authenticate, AwardController.getAllAdmin);
router.post('/admin/awards', authenticate, AwardController.create);
router.put('/admin/awards/:id', authenticate, AwardController.update);
router.delete('/admin/awards/:id', authenticate, AwardController.delete);
router.post('/admin/awards/reorder', authenticate, AwardController.reorder);

export default router;
