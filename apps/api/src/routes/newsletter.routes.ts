import { Router } from 'express';
import { NewsletterController } from '../controllers/newsletter.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { newsletterSubscriptionSchema } from '@fusehotel/shared';

const router = Router();

router.post('/subscribe', validateBody(newsletterSubscriptionSchema), NewsletterController.subscribe);

export default router;
