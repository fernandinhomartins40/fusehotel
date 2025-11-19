/**
 * Contact Service
 *
 * Serviço de gerenciamento de mensagens de contato
 */

import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Interface de dados para criação de mensagem
 */
export interface CreateContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Service de contato
 */
export class ContactService {
  /**
   * Cria uma nova mensagem de contato
   */
  async create(data: CreateContactMessageData): Promise<any> {
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        isRead: false,
      },
    });

    logger.info('Contact message created', { messageId: message.id });

    // TODO: Enviar email de notificação para o admin
    // TODO: Enviar email de confirmação para o usuário

    return message;
  }

  /**
   * Lista todas as mensagens
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    unreadOnly: boolean = false
  ): Promise<{ messages: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = unreadOnly ? { isRead: false } : {};

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return { messages, total };
  }

  /**
   * Busca uma mensagem por ID
   */
  async findById(id: string): Promise<any> {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundError('Contact message', id);
    }

    return message;
  }

  /**
   * Marca uma mensagem como lida
   */
  async markAsRead(id: string): Promise<any> {
    const message = await this.findById(id);

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    logger.info('Contact message marked as read', { messageId: id });

    return updated;
  }

  /**
   * Responde uma mensagem
   */
  async reply(id: string, reply: string): Promise<any> {
    const message = await this.findById(id);

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        reply,
        repliedAt: new Date(),
        isRead: true,
      },
    });

    logger.info('Contact message replied', { messageId: id });

    // TODO: Enviar email com a resposta

    return updated;
  }

  /**
   * Deleta uma mensagem
   */
  async delete(id: string): Promise<void> {
    await this.findById(id);

    await prisma.contactMessage.delete({
      where: { id },
    });

    logger.info('Contact message deleted', { messageId: id });
  }

  /**
   * Obtém estatísticas
   */
  async getStats(): Promise<any> {
    const [total, unread, replied] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count({ where: { repliedAt: { not: null } } }),
    ]);

    return {
      total,
      unread,
      replied,
      pending: total - replied,
    };
  }
}

export default new ContactService();
