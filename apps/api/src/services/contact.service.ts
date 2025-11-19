import { prisma } from '../config/database';

export class ContactService {
  static async create(data: any) {
    return prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      }
    });
  }
}
