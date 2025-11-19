import { prisma } from '../config/database';

export class SettingsService {
  static async getPublic() {
    return prisma.settings.findMany({
      where: { isPublic: true }
    });
  }

  static async getAll() {
    return prisma.settings.findMany();
  }
}
