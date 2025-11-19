/**
 * Newsletter Service
 *
 * Serviço de gerenciamento de newsletter
 */

import { prisma } from '../config/database';
import { DuplicateError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Service de newsletter
 */
export class NewsletterService {
  /**
   * Inscreve um email na newsletter
   */
  async subscribe(email: string, name?: string): Promise<any> {
    // Verifica se já existe
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      // Se estava inativo, reativa
      if (!existing.isActive) {
        const subscription = await prisma.newsletterSubscription.update({
          where: { email },
          data: {
            isActive: true,
            name: name || existing.name,
            confirmedAt: new Date(),
            unsubscribedAt: null,
          },
        });

        logger.info('Newsletter subscription reactivated', { email });

        return subscription;
      }

      throw new DuplicateError('email', email);
    }

    // Cria nova inscrição
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email,
        name,
        isActive: true,
        confirmedAt: new Date(),
      },
    });

    logger.info('Newsletter subscription created', { email });

    return subscription;
  }

  /**
   * Desinscreve um email da newsletter
   */
  async unsubscribe(email: string): Promise<void> {
    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (!subscription) {
      throw new NotFoundError('Subscription');
    }

    await prisma.newsletterSubscription.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    logger.info('Newsletter subscription cancelled', { email });
  }

  /**
   * Lista todos os inscritos
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    activeOnly: boolean = true
  ): Promise<{ subscriptions: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = activeOnly ? { isActive: true } : {};

    const [subscriptions, total] = await Promise.all([
      prisma.newsletterSubscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.newsletterSubscription.count({ where }),
    ]);

    return { subscriptions, total };
  }

  /**
   * Obtém estatísticas
   */
  async getStats(): Promise<any> {
    const [total, active, inactive] = await Promise.all([
      prisma.newsletterSubscription.count(),
      prisma.newsletterSubscription.count({ where: { isActive: true } }),
      prisma.newsletterSubscription.count({ where: { isActive: false } }),
    ]);

    return {
      total,
      active,
      inactive,
    };
  }
}

export default new NewsletterService();
