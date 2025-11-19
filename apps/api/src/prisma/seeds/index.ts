import { prisma } from '../../config/database';
import { hashPassword } from '../../utils/crypto';
import { logger } from '../../utils/logger';

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
    { name: 'Wi-Fi', icon: 'wifi', category: 'GENERAL' },
    { name: 'Ar Condicionado', icon: 'wind', category: 'BEDROOM' },
    { name: 'TV', icon: 'tv', category: 'ENTERTAINMENT' },
    { name: 'Frigobar', icon: 'refrigerator', category: 'KITCHEN' },
    { name: 'Cofre', icon: 'lock', category: 'BEDROOM' },
    { name: 'Secador de Cabelo', icon: 'wind', category: 'BATHROOM' },
    { name: 'Roupa de Cama', icon: 'bed', category: 'BEDROOM' },
    { name: 'Toalhas', icon: 'bath', category: 'BATHROOM' },
    { name: 'Chuveiro', icon: 'shower', category: 'BATHROOM' },
    { name: 'Estacionamento', icon: 'car', category: 'GENERAL' },
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
      category: 'SITE_INFO',
      description: 'Nome do site',
      isPublic: true
    },
    {
      key: 'site_description',
      value: 'Hotel completo com as melhores acomodações',
      category: 'SITE_INFO',
      description: 'Descrição do site',
      isPublic: true
    },
    {
      key: 'contact_email',
      value: 'contato@fusehotel.com',
      category: 'SITE_INFO',
      description: 'Email de contato',
      isPublic: true
    },
    {
      key: 'contact_phone',
      value: '(11) 1234-5678',
      category: 'SITE_INFO',
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
