import { prisma } from '../config/database';

interface ContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export class ContactService {
  static async create(data: ContactMessageData) {
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
