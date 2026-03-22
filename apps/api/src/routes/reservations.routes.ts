import { Router } from 'express';
import { ReservationController } from '../controllers/reservations.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createReservationSchema, cancelReservationSchema } from '@fusehotel/shared';

const router = Router();

router.get('/', authenticate, requireRole(['ADMIN', 'MANAGER']), ReservationController.list);
router.get('/my-reservations', authenticate, ReservationController.myReservations);
router.get('/:id', authenticate, ReservationController.getById);
router.get('/code/:code', authenticate, requireRole(['ADMIN', 'MANAGER']), ReservationController.getByCode);
router.post('/', validateBody(createReservationSchema), ReservationController.create);
router.post('/:id/cancel', authenticate, validateBody(cancelReservationSchema), ReservationController.cancel);
router.patch('/:id/status', authenticate, requireRole(['ADMIN', 'MANAGER']), ReservationController.updateStatus);
router.put('/:id', authenticate, requireRole(['ADMIN', 'MANAGER']), ReservationController.update);

export default router;
