/**
 * Reservations Routes
 */

import { Router } from 'express';
import reservationsController from '../controllers/reservations.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireManager } from '../middlewares/role.middleware';
import { validateIdParam } from '../middlewares/validate.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/my', reservationsController.getMyReservations);
router.post('/', reservationsController.create);
router.post('/check-availability', reservationsController.checkAvailability);

// Specific reservation routes
router.get('/code/:code', reservationsController.getByCode);
router.get('/:id', validateIdParam, reservationsController.getById);
router.put('/:id', validateIdParam, reservationsController.update);
router.post('/:id/cancel', validateIdParam, reservationsController.cancel);

// Manager routes
router.get('/', requireManager, reservationsController.getAll);
router.get('/stats', requireManager, reservationsController.getStats);
router.post('/:id/check-in', validateIdParam, requireManager, reservationsController.checkIn);
router.post('/:id/check-out', validateIdParam, requireManager, reservationsController.checkOut);

export default router;
