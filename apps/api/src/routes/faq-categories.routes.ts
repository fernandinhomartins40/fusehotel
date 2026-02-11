import { Router } from 'express';
import faqCategoryController from '../controllers/faq-category.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/categories', faqCategoryController.findAll);
router.get('/categories/:id', faqCategoryController.findById);

// Admin routes
router.get('/admin/categories', authenticate, faqCategoryController.findAllAdmin);
router.post('/admin/categories', authenticate, faqCategoryController.create);
router.put('/admin/categories/:id', authenticate, faqCategoryController.update);
router.delete('/admin/categories/:id', authenticate, faqCategoryController.delete);
router.post('/admin/categories/reorder', authenticate, faqCategoryController.reorder);

export default router;
