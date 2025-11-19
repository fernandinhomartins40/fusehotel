import { Router } from 'express';
import { ReservationController } from '../controllers/reservations.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authenticate, requireRole(['ADMIN', 'MANAGER']), ReservationController.list);
router.get('/my-reservations', authenticate, ReservationController.myReservations);
router.get('/:id', authenticate, ReservationController.getById);
router.get('/code/:code', ReservationController.getByCode);
router.post('/', ReservationController.create);
router.post('/:id/cancel', authenticate, ReservationController.cancel);

export default router;
