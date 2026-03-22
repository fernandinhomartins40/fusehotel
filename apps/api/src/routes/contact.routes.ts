import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { contactMessageSchema } from '@fusehotel/shared';

const router = Router();

router.post('/send-message', validateBody(contactMessageSchema), ContactController.sendMessage);

export default router;
