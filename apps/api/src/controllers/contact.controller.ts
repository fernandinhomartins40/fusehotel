/**
 * Contact Controller
 *
 * Controller de gerenciamento de mensagens de contato
 */

import { Request, Response } from 'express';
import contactService from '../services/contact.service';
import { success, created, updated, deleted, paginated } from '../utils/response';
import { asyncHandler } from '../middlewares/error.middleware';
import { normalizePagination } from '../utils/response';
import { SUCCESS_MESSAGES } from '../utils/constants';

export class ContactController {
  /**
   * POST /contact
   * Envia uma mensagem de contato
   */
  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const message = await contactService.create(req.body);
    return created(res, message, SUCCESS_MESSAGES.CONTACT_MESSAGE_SENT);
  });

  /**
   * GET /contact/messages
   * Lista todas as mensagens
   */
  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = normalizePagination(req.query.page, req.query.limit);
    const unreadOnly = req.query.unreadOnly === 'true';

    const { messages, total } = await contactService.findAll(page, limit, unreadOnly);
    return paginated(res, messages, page, limit, total);
  });

  /**
   * GET /contact/messages/:id
   * Busca uma mensagem por ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const message = await contactService.findById(req.params.id);
    return success(res, message);
  });

  /**
   * PUT /contact/messages/:id/mark-read
   * Marca uma mensagem como lida
   */
  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const message = await contactService.markAsRead(req.params.id);
    return updated(res, message, 'Message marked as read');
  });

  /**
   * POST /contact/messages/:id/reply
   * Responde uma mensagem
   */
  reply = asyncHandler(async (req: Request, res: Response) => {
    const { reply } = req.body;
    const message = await contactService.reply(req.params.id, reply);
    return updated(res, message, 'Reply sent successfully');
  });

  /**
   * DELETE /contact/messages/:id
   * Deleta uma mensagem
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await contactService.delete(req.params.id);
    return deleted(res, 'Message deleted successfully');
  });

  /**
   * GET /contact/stats
   * Obtém estatísticas
   */
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await contactService.getStats();
    return success(res, stats);
  });
}

export default new ContactController();
