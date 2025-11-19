import { Request, Response, NextFunction } from 'express';
import { NewsletterService } from '../services/newsletter.service';
import { sendSuccess } from '../utils/response';

export class NewsletterController {
  static async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name } = req.body;
      await NewsletterService.subscribe(email, name);
      return sendSuccess(res, null, 'Inscrito com sucesso na newsletter!');
    } catch (error) {
      next(error);
    }
  }
}
