import { Router } from 'express';
import { ServiceItemController } from '../controllers/service-item.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Service Items - Public
router.get('/service-items', ServiceItemController.getAll);
router.get('/service-items/category/:category', ServiceItemController.getByCategory);
router.get('/service-items/:id', ServiceItemController.getById);

// Service Items - Admin (protected)
router.get('/admin/service-items', authenticate, ServiceItemController.getAllAdmin);
router.get('/admin/service-items/category/:category', authenticate, ServiceItemController.getByCategoryAdmin);
router.post('/admin/service-items', authenticate, ServiceItemController.create);
router.put('/admin/service-items/:id', authenticate, ServiceItemController.update);
router.delete('/admin/service-items/:id', authenticate, ServiceItemController.delete);
router.post('/admin/service-items/reorder', authenticate, ServiceItemController.reorder);

export default router;
