import { Request, Response, NextFunction } from 'express';
import { ContactService } from '../services/contact.service';
import { sendSuccess } from '../utils/response';

export class ContactController {
  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      await ContactService.create(req.body);
      return sendSuccess(res, null, 'Mensagem enviada com sucesso!');
    } catch (error) {
      next(error);
    }
  }
}
