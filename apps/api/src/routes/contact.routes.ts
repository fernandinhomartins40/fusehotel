/**
 * Contact Routes
 */

import { Router } from 'express';
import contactController from '../controllers/contact.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireManager } from '../middlewares/role.middleware';
import { validateIdParam } from '../middlewares/validate.middleware';
import { contactRateLimiter } from '../middlewares/rate-limiter.middleware';

const router = Router();

// Public routes
router.post('/', contactRateLimiter, contactController.sendMessage);

// Protected routes (Manager and above)
router.use(authenticate, requireManager);

router.get('/messages', contactController.getMessages);
router.get('/messages/:id', validateIdParam, contactController.getById);
router.put('/messages/:id/mark-read', validateIdParam, contactController.markAsRead);
router.post('/messages/:id/reply', validateIdParam, contactController.reply);
router.delete('/messages/:id', validateIdParam, contactController.delete);
router.get('/stats', contactController.getStats);

export default router;
