import { prisma } from '../../config/database';
import { hashPassword } from '../../utils/crypto';
import { logger } from '../../utils/logger';
import { AmenityCategory, SettingsCategory } from '@prisma/client';
import { seedPromotions } from './promotions.seed';
import { seedAccommodations } from './accommodations.seed';
import { seedHotelSettings } from './hotel-settings.seed';
import { seedLandingPage } from './landing.seed';
import { seedServices } from './services.seed';
import { seedAboutPage } from './about.seed';
import { seedFAQ } from './faq.seed';
import { seedContact } from './contact.seed';

async function seedUsers() {
  logger.info('🌱 Seeding users...');

  // Senhas para testes
  const adminPassword = await hashPassword('Admin@123');
  const managerPassword = await hashPassword('Manager@123');
  const customerPassword = await hashPassword('Customer@123');

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@fusehotel.com' },
    update: {},
    create: {
      email: 'admin@fusehotel.com',
      password: adminPassword,
      name: 'Administrador do Sistema',
      phone: '(11) 99999-9999',
      cpf: '111.111.111-11',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    }
  });

  // Manager
  await prisma.user.upsert({
    where: { email: 'gerente@fusehotel.com' },
    update: {},
    create: {
      email: 'gerente@fusehotel.com',
      password: managerPassword,
      name: 'Carlos Gerente',
      phone: '(11) 98888-8888',
      cpf: '222.222.222-22',
      role: 'MANAGER',
      isActive: true,
      emailVerified: true,
    }
  });

  // Customer 1
  await prisma.user.upsert({
    where: { email: 'joao.silva@email.com' },
    update: {},
    create: {
      email: 'joao.silva@email.com',
      password: customerPassword,
      name: 'João Silva',
      phone: '(11) 97777-7777',
      cpf: '333.333.333-33',
      role: 'CUSTOMER',
      isActive: true,
      emailVerified: true,
    }
  });

  // Customer 2
  await prisma.user.upsert({
    where: { email: 'maria.santos@email.com' },
    update: {},
    create: {
      email: 'maria.santos@email.com',
      password: customerPassword,
      name: 'Maria Santos',
      phone: '(11) 96666-6666',
      cpf: '444.444.444-44',
      role: 'CUSTOMER',
      isActive: true,
      emailVerified: true,
    }
  });

  // Customer 3
  await prisma.user.upsert({
    where: { email: 'pedro.oliveira@email.com' },
    update: {},
    create: {
      email: 'pedro.oliveira@email.com',
      password: customerPassword,
      name: 'Pedro Oliveira',
      phone: '(11) 95555-5555',
      cpf: '555.555.555-55',
      role: 'CUSTOMER',
      isActive: true,
      emailVerified: true,
    }
  });

  // Customer 4 (não verificado - para testar fluxo de verificação)
  await prisma.user.upsert({
    where: { email: 'ana.costa@email.com' },
    update: {},
    create: {
      email: 'ana.costa@email.com',
      password: customerPassword,
      name: 'Ana Costa',
      phone: '(11) 94444-4444',
      cpf: '666.666.666-66',
      role: 'CUSTOMER',
      isActive: true,
      emailVerified: false,
    }
  });

  // Customer 5 (inativo - para testar bloqueio)
  await prisma.user.upsert({
    where: { email: 'lucas.ferreira@email.com' },
    update: {},
    create: {
      email: 'lucas.ferreira@email.com',
      password: customerPassword,
      name: 'Lucas Ferreira',
      phone: '(11) 93333-3333',
      cpf: '777.777.777-77',
      role: 'CUSTOMER',
      isActive: false,
      emailVerified: true,
    }
  });

  logger.info('✅ Users seeded (6 total: 1 admin, 1 manager, 4 customers)');
}

async function seedAmenities() {
  logger.info('🌱 Seeding amenities...');

  const amenities = [
    { name: 'Wi-Fi', icon: 'wifi', category: AmenityCategory.GENERAL },
    { name: 'Ar Condicionado', icon: 'wind', category: AmenityCategory.BEDROOM },
    { name: 'TV', icon: 'tv', category: AmenityCategory.ENTERTAINMENT },
    { name: 'Frigobar', icon: 'refrigerator', category: AmenityCategory.KITCHEN },
    { name: 'Cofre', icon: 'lock', category: AmenityCategory.BEDROOM },
    { name: 'Secador de Cabelo', icon: 'wind', category: AmenityCategory.BATHROOM },
    { name: 'Roupa de Cama', icon: 'bed', category: AmenityCategory.BEDROOM },
    { name: 'Toalhas', icon: 'bath', category: AmenityCategory.BATHROOM },
    { name: 'Chuveiro', icon: 'shower', category: AmenityCategory.BATHROOM },
    { name: 'Estacionamento', icon: 'car', category: AmenityCategory.GENERAL },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { id: amenity.name },
      update: amenity,
      create: { id: amenity.name, ...amenity }
    });
  }

  logger.info('✅ Amenities seeded');
}

async function seedSettings() {
  logger.info('🌱 Seeding settings...');
  
  const settings = [
    {
      key: 'site_name',
      value: 'FuseHotel',
      category: SettingsCategory.SITE_INFO,
      description: 'Nome do site',
      isPublic: true
    },
    {
      key: 'site_description',
      value: 'Hotel completo com as melhores acomodações',
      category: SettingsCategory.SITE_INFO,
      description: 'Descrição do site',
      isPublic: true
    },
    {
      key: 'contact_email',
      value: 'contato@fusehotel.com',
      category: SettingsCategory.SITE_INFO,
      description: 'Email de contato',
      isPublic: true
    },
    {
      key: 'contact_phone',
      value: '(11) 1234-5678',
      category: SettingsCategory.SITE_INFO,
      description: 'Telefone de contato',
      isPublic: true
    },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting
    });
  }

  logger.info('✅ Settings seeded');
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
