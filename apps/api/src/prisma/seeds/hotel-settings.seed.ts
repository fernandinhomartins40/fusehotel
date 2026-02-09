import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedHotelSettings() {
  console.log('🏨 Seeding hotel settings...');

  try {
    // Verificar se já existe configuração
    const existingSettings = await prisma.hotelSettings.findFirst();

    if (existingSettings) {
      console.log('⚠️  Hotel settings already exist, skipping...');
      return;
    }

    // Criar configurações padrão
    const settings = await prisma.hotelSettings.create({
      data: {
        hotelWhatsApp: '5511999999999',
        hotelName: 'FuseHotel',
        hotelEmail: 'contato@fusehotel.com',
        hotelPhone: '(11) 3333-4444',
        hotelAddress: 'Rua Exemplo, 123 - São Paulo, SP',
      }
    });

    console.log(`✅ Hotel settings created: ${settings.hotelName}`);
    console.log(`   WhatsApp: ${settings.hotelWhatsApp}`);
  } catch (error) {
    console.error('❌ Error seeding hotel settings:', error);
    throw error;
  }
}
