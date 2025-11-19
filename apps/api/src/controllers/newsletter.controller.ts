/**
 * Newsletter Controller
 *
 * Controller de gerenciamento de newsletter
 */

import { Request, Response } from 'express';
import newsletterService from '../services/newsletter.service';
import { success, created, paginated } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizePagination } from '../utils/response';
import { SUCCESS_MESSAGES } from '../utils/constants';

export class NewsletterController {
  /**
   * POST /newsletter/subscribe
   * Inscreve um email na newsletter
   */
  subscribe = asyncHandler(async (req: Request, res: Response) => {
    const { email, name } = req.body;
    const subscription = await newsletterService.subscribe(email, name);
    return created(res, subscription, SUCCESS_MESSAGES.NEWSLETTER_SUBSCRIBED);
  });

  /**
   * POST /newsletter/unsubscribe
   * Desinscreve um email da newsletter
   */
  unsubscribe = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await newsletterService.unsubscribe(email);
    return success(res, null, SUCCESS_MESSAGES.NEWSLETTER_UNSUBSCRIBED);
  });

  /**
   * GET /newsletter/subscriptions
   * Lista todos os inscritos
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = normalizePagination(req.query.page, req.query.limit);
    const activeOnly = req.query.activeOnly !== 'false';

    const { subscriptions, total } = await newsletterService.findAll(page, limit, activeOnly);
    return paginated(res, subscriptions, page, limit, total);
  });

  /**
   * GET /newsletter/stats
   * Obtém estatísticas
   */
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await newsletterService.getStats();
    return success(res, stats);
  });
}

export default new NewsletterController();
