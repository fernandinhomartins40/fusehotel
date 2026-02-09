import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import accommodationRoutes from './accommodations.routes';
import amenityRoutes from './amenities.routes';
import reservationRoutes from './reservations.routes';
import promotionRoutes from './promotions.routes';
import settingsRoutes from './settings.routes';
import newsletterRoutes from './newsletter.routes';
import contactRoutes from './contact.routes';
import uploadRoutes from './upload.routes';
import landingRoutes from './landing.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/accommodations', accommodationRoutes);
router.use('/amenities', amenityRoutes);
router.use('/reservations', reservationRoutes);
router.use('/promotions', promotionRoutes);
router.use('/settings', settingsRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/contact', contactRoutes);
router.use('/upload', uploadRoutes);
router.use('/landing', landingRoutes);

export default router;
