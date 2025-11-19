/**
 * Auth Routes
 */

import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authRateLimiter, registerRateLimiter, passwordResetRateLimiter } from '../middlewares/rate-limiter.middleware';

const router = Router();

// Public routes
router.post('/register', registerRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', passwordResetRateLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/check-email', authController.checkEmail);
router.get('/check-cpf', authController.checkCpf);

// Protected routes
router.post('/change-password', authenticate, authController.changePassword);

export default router;
