import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { CRMController } from '../controllers/crm.controller';
import {
  createBusinessAccountSchema,
  createFeedbackSchema,
  createQuoteSchema,
  issuePreCheckInSchema,
  submitPreCheckInSchema,
  updateBusinessAccountSchema,
  updateQuoteSchema,
} from '../validators/pms.validators';

const router = Router();

router.get('/pre-check-in/:token', CRMController.getPreCheckInByToken);
router.post('/pre-check-in/:token/submit', validateBody(submitPreCheckInSchema), CRMController.submitPreCheckIn);

router.use(authenticate, requireRole(['ADMIN', 'MANAGER']));

router.get('/quotes', CRMController.listQuotes);
router.post('/quotes', validateBody(createQuoteSchema), CRMController.createQuote);
router.put('/quotes/:id', validateBody(updateQuoteSchema), CRMController.updateQuote);
router.post('/quotes/:id/convert', CRMController.convertQuote);

router.get('/business-accounts', CRMController.listBusinessAccounts);
router.post('/business-accounts', validateBody(createBusinessAccountSchema), CRMController.createBusinessAccount);
router.put('/business-accounts/:id', validateBody(updateBusinessAccountSchema), CRMController.updateBusinessAccount);

router.get('/feedbacks', CRMController.listFeedbacks);
router.post('/feedbacks', validateBody(createFeedbackSchema), CRMController.createFeedback);

router.get('/pre-check-ins', CRMController.listPreCheckIns);
router.post('/pre-check-ins/issue', validateBody(issuePreCheckInSchema), CRMController.issuePreCheckIn);
router.post('/pre-check-ins/:id/approve', CRMController.approvePreCheckIn);
router.post('/pre-check-ins/:id/fnrh', CRMController.sendFNRH);

router.post('/reservations/:reservationId/voucher', CRMController.sendVoucher);
router.post('/reservations/:reservationId/payment-link', CRMController.generatePaymentLink);

export default router;
