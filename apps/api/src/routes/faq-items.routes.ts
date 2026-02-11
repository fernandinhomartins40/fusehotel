import { Router } from 'express';
import faqItemController from '../controllers/faq-item.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/items', faqItemController.findAll);
router.get('/items/category/:categoryId', faqItemController.findByCategoryId);
router.get('/items/:id', faqItemController.findById);

// Admin routes
router.get('/admin/items', authenticate, faqItemController.findAllAdmin);
router.post('/admin/items', authenticate, faqItemController.create);
router.put('/admin/items/:id', authenticate, faqItemController.update);
router.delete('/admin/items/:id', authenticate, faqItemController.delete);
router.post('/admin/items/reorder', authenticate, faqItemController.reorder);

export default router;
