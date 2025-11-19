/**
 * Routes Index
 *
 * Registra todas as rotas da aplicação
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import accommodationsRoutes from './accommodations.routes';
import reservationsRoutes from './reservations.routes';
import promotionsRoutes from './promotions.routes';
import settingsRoutes from './settings.routes';
import uploadRoutes from './upload.routes';
import newsletterRoutes from './newsletter.routes';
import contactRoutes from './contact.routes';
import { healthCheck } from '../utils/response';

const router = Router();

/**
 * Health Check
 */
router.get('/health', (req, res) => {
  return healthCheck(res, {
    database: 'ok',
    api: 'ok',
  }, '1.0.0');
});

/**
 * API Info
 */
router.get('/', (req, res) => {
  res.json({
    name: 'FuseHotel API',
    version: '1.0.0',
    description: 'RESTful API for FuseHotel - Hotel Booking System',
    endpoints: {
      health: '/health',
      auth: '/auth',
      users: '/users',
      accommodations: '/accommodations',
      reservations: '/reservations',
      promotions: '/promotions',
      settings: '/settings',
      upload: '/upload',
      newsletter: '/newsletter',
      contact: '/contact',
    },
    documentation: '/api-docs',
  });
});

/**
 * Rotas da API
 */
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/accommodations', accommodationsRoutes);
router.use('/reservations', reservationsRoutes);
router.use('/promotions', promotionsRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/contact', contactRoutes);

export default router;
