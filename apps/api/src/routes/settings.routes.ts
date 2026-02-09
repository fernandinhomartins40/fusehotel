import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { updateHotelSettingsSchema } from '@fusehotel/shared';

const router = Router();

// Rota pública para obter configurações do hotel (apenas WhatsApp)
router.get('/hotel', SettingsController.getHotelSettings);

// Rotas protegidas para admin
router.put(
  '/hotel',
  authenticate,
  requireRole(['ADMIN']),
  validateBody(updateHotelSettingsSchema),
  SettingsController.updateHotelSettings
);

export default router;
