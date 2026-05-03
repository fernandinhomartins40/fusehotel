import { SettingsCategory } from '@prisma/client';
import { prisma } from '../../config/database';
import { hashPassword } from '../../utils/crypto';
import { logger } from '../../utils/logger';
import { seedAboutPage } from './about.seed';
import { seedAccommodations } from './accommodations.seed';
import { seedAmenities } from './amenities.seed';
import { seedContact } from './contact.seed';
import { seedFAQ } from './faq.seed';
import { seedHotelSettings } from './hotel-settings.seed';
import { seedLandingPage } from './landing.seed';
import { seedPmsData } from './pms.seed';
import { seedPromotions } from './promotions.seed';
import { seedServices } from './services.seed';

async function seedUsers() {
  logger.info('🌱 Seeding users...');

  const adminPassword = await hashPassword('Admin@123');
  const managerPassword = await hashPassword('Manager@123');
  const customerPassword = await hashPassword('Customer@123');

  const users = [
    {
      email: 'admin@fusehotel.com',
      password: adminPassword,
      name: 'Administrador do Sistema',
      phone: '(11) 99999-9999',
      cpf: '111.111.111-11',
      role: 'ADMIN' as const,
      isActive: true,
      emailVerified: true,
    },
    {
      email: 'gerente@fusehotel.com',
      password: managerPassword,
      name: 'Carlos Gerente',
      phone: '(11) 98888-8888',
      cpf: '222.222.222-22',
      role: 'MANAGER' as const,
      isActive: true,
      emailVerified: true,
    },
    {
      email: 'joao.silva@email.com',
      password: customerPassword,
      name: 'João Silva',
      phone: '(11) 97777-7777',
      cpf: '333.333.333-33',
      role: 'CUSTOMER' as const,
      isActive: true,
      emailVerified: true,
    },
    {
      email: 'maria.santos@email.com',
      password: customerPassword,
      name: 'Maria Santos',
      phone: '(11) 96666-6666',
      cpf: '444.444.444-44',
      role: 'CUSTOMER' as const,
      isActive: true,
      emailVerified: true,
    },
    {
      email: 'pedro.oliveira@email.com',
      password: customerPassword,
      name: 'Pedro Oliveira',
      phone: '(11) 95555-5555',
      cpf: '555.555.555-55',
      role: 'CUSTOMER' as const,
      isActive: true,
      emailVerified: true,
    },
    {
      email: 'ana.costa@email.com',
      password: customerPassword,
      name: 'Ana Costa',
      phone: '(11) 94444-4444',
      cpf: '666.666.666-66',
      role: 'CUSTOMER' as const,
      isActive: true,
      emailVerified: false,
    },
    {
      email: 'lucas.ferreira@email.com',
      password: customerPassword,
      name: 'Lucas Ferreira',
      phone: '(11) 93333-3333',
      cpf: '777.777.777-77',
      role: 'CUSTOMER' as const,
      isActive: false,
      emailVerified: true,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  logger.info('✅ Users seeded');
}

async function seedSettings() {
  logger.info('🌱 Seeding base settings...');

  const settings = [
    {
      key: 'site_name',
      value: 'FuseHotel',
      category: SettingsCategory.SITE_INFO,
      description: 'Nome do site',
      isPublic: true,
    },
    {
      key: 'site_description',
      value: 'Resort completo com hospedagem, operação hoteleira e serviços integrados.',
      category: SettingsCategory.SITE_INFO,
      description: 'Descrição principal do site',
      isPublic: true,
    },
    {
      key: 'contact_email',
      value: 'contato@fusehotel.com',
      category: SettingsCategory.SITE_INFO,
      description: 'E-mail de contato',
      isPublic: true,
    },
    {
      key: 'contact_phone',
      value: '(11) 1234-5678',
      category: SettingsCategory.SITE_INFO,
      description: 'Telefone de contato',
      isPublic: true,
    },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  logger.info('✅ Base settings seeded');
}

async function main() {
  try {
    logger.info('🚀 Starting seed...');

    await seedUsers();
    await seedAmenities();
    await seedSettings();
    await seedHotelSettings();
    await seedPromotions();
    await seedAccommodations();
    await seedPmsData();
    await seedLandingPage();
    await seedServices();
    await seedAboutPage();
    await seedFAQ();
    await seedContact();

    logger.info('🎉 Seed completed successfully!');
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
