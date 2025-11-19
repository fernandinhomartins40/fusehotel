/**
 * Newsletter Routes
 */

import { Router } from 'express';
import newsletterController from '../controllers/newsletter.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireManager } from '../middlewares/role.middleware';
import { contactRateLimiter } from '../middlewares/rate-limiter.middleware';

const router = Router();

// Public routes
router.post('/subscribe', contactRateLimiter, newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);

// Protected routes (Manager and above)
router.get('/subscriptions', authenticate, requireManager, newsletterController.getAll);
router.get('/stats', authenticate, requireManager, newsletterController.getStats);

export default router;
