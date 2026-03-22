import { addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';

export class PasswordResetService {
  static async issueToken(userId: string): Promise<string> {
    await prisma.passwordReset.deleteMany({
      where: {
        userId,
        used: false,
      },
    });

    const token = uuidv4();

    await prisma.passwordReset.create({
      data: {
        userId,
        token,
        expiresAt: addDays(new Date(), 1),
      },
    });

    return token;
  }
}
