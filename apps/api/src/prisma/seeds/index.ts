import { prisma } from '../../config/database';
import { hashPassword } from '../../utils/crypto';
import { logger } from '../../utils/logger';
import { AmenityCategory, SettingsCategory } from '@prisma/client';

async function seedUsers() {
  logger.info('🌱 Seeding users...');
  
  const adminPassword = await hashPassword('Admin@123');
  
  await prisma.user.upsert({
    where: { email: 'admin@fusehotel.com' },
    update: {},
    create: {
      email: 'admin@fusehotel.com',
      password: adminPassword,
      name: 'Administrador',
      phone: '(11) 99999-9999',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    }
  });

  logger.info('✅ Users seeded');
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
    
    logger.info('🎉 Seed completed successfully!');
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
