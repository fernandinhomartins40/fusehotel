import { prisma } from '../config/database';
import { ConflictError } from '../utils/errors';

export class NewsletterService {
  static async subscribe(email: string, name?: string) {
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email }
    });

    if (existing && existing.isActive) {
      throw new ConflictError('Email já cadastrado');
    }

    if (existing) {
      return prisma.newsletterSubscription.update({
        where: { email },
        data: { isActive: true, name, unsubscribedAt: null }
      });
    }

    return prisma.newsletterSubscription.create({
      data: { email, name }
    });
  }
}
