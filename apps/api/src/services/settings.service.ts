import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class SettingsService {
  static async getHotelSettings() {
    let settings = await prisma.hotelSettings.findFirst();

    if (!settings) {
      // Criar configurações padrão se não existirem
      settings = await prisma.hotelSettings.create({
        data: {
          hotelWhatsApp: '5511999999999',
          hotelName: 'FuseHotel',
        }
      });
    }

    return settings;
  }

  static async updateHotelSettings(data: any) {
    let settings = await prisma.hotelSettings.findFirst();

    if (!settings) {
      // Criar se não existe
      settings = await prisma.hotelSettings.create({
        data: {
          hotelWhatsApp: data.hotelWhatsApp,
          hotelName: data.hotelName || 'FuseHotel',
          hotelEmail: data.hotelEmail,
          hotelPhone: data.hotelPhone,
          hotelAddress: data.hotelAddress,
        }
      });
    } else {
      // Atualizar existente
      settings = await prisma.hotelSettings.update({
        where: { id: settings.id },
        data: {
          hotelWhatsApp: data.hotelWhatsApp !== undefined ? data.hotelWhatsApp : settings.hotelWhatsApp,
          hotelName: data.hotelName !== undefined ? data.hotelName : settings.hotelName,
          hotelEmail: data.hotelEmail !== undefined ? data.hotelEmail : settings.hotelEmail,
          hotelPhone: data.hotelPhone !== undefined ? data.hotelPhone : settings.hotelPhone,
          hotelAddress: data.hotelAddress !== undefined ? data.hotelAddress : settings.hotelAddress,
        }
      });
    }

    return settings;
  }
}
