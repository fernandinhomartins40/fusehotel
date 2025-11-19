import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';

const router = Router();

router.post('/send-message', ContactController.sendMessage);

export default router;
