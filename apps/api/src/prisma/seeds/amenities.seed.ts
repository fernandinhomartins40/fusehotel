import { PrismaClient, AmenityCategory } from '@prisma/client';

const prisma = new PrismaClient();

const amenities = [
  // BEDROOM
  { name: 'Ar condicionado', icon: '❄️', category: 'BEDROOM' as AmenityCategory },
  { name: 'Aquecedor', icon: '🔥', category: 'BEDROOM' as AmenityCategory },
  { name: 'TV', icon: '📺', category: 'BEDROOM' as AmenityCategory },
  { name: 'Frigobar', icon: '🧊', category: 'BEDROOM' as AmenityCategory },
  { name: 'Cofre', icon: '🔒', category: 'BEDROOM' as AmenityCategory },
  { name: 'Varanda', icon: '🪟', category: 'BEDROOM' as AmenityCategory },
  { name: 'Roupeiro', icon: '👔', category: 'BEDROOM' as AmenityCategory },
  { name: 'Escrivaninha', icon: '🪑', category: 'BEDROOM' as AmenityCategory },

  // BATHROOM
  { name: 'Banheira', icon: '🛁', category: 'BATHROOM' as AmenityCategory },
  { name: 'Chuveiro', icon: '🚿', category: 'BATHROOM' as AmenityCategory },
  { name: 'Secador de cabelo', icon: '💨', category: 'BATHROOM' as AmenityCategory },
  { name: 'Roupões', icon: '🧥', category: 'BATHROOM' as AmenityCategory },
  { name: 'Chinelos', icon: '🩴', category: 'BATHROOM' as AmenityCategory },
  { name: 'Produtos de banho', icon: '🧴', category: 'BATHROOM' as AmenityCategory },
  { name: 'Toalhas', icon: '🧺', category: 'BATHROOM' as AmenityCategory },

  // ENTERTAINMENT
  { name: 'Wi-Fi gratuito', icon: '📶', category: 'ENTERTAINMENT' as AmenityCategory },
  { name: 'TV a cabo', icon: '📡', category: 'ENTERTAINMENT' as AmenityCategory },
  { name: 'Netflix', icon: '🎬', category: 'ENTERTAINMENT' as AmenityCategory },
  { name: 'Som ambiente', icon: '🔊', category: 'ENTERTAINMENT' as AmenityCategory },

  // KITCHEN
  { name: 'Cozinha completa', icon: '🍳', category: 'KITCHEN' as AmenityCategory },
  { name: 'Micro-ondas', icon: '📟', category: 'KITCHEN' as AmenityCategory },
  { name: 'Cafeteira', icon: '☕', category: 'KITCHEN' as AmenityCategory },
  { name: 'Utensílios de cozinha', icon: '🍴', category: 'KITCHEN' as AmenityCategory },
  { name: 'Geladeira', icon: '🧊', category: 'KITCHEN' as AmenityCategory },

  // OUTDOOR
  { name: 'Vista para o mar', icon: '🌊', category: 'OUTDOOR' as AmenityCategory },
  { name: 'Vista para a montanha', icon: '⛰️', category: 'OUTDOOR' as AmenityCategory },
  { name: 'Vista para o jardim', icon: '🌳', category: 'OUTDOOR' as AmenityCategory },
  { name: 'Piscina privativa', icon: '🏊', category: 'OUTDOOR' as AmenityCategory },
  { name: 'Churrasqueira', icon: '🔥', category: 'OUTDOOR' as AmenityCategory },
  { name: 'Jardim', icon: '🌺', category: 'OUTDOOR' as AmenityCategory },

  // GENERAL
  { name: 'Serviço de quarto', icon: '🛎️', category: 'GENERAL' as AmenityCategory },
  { name: 'Café da manhã incluído', icon: '🥐', category: 'GENERAL' as AmenityCategory },
  { name: 'Estacionamento gratuito', icon: '🅿️', category: 'GENERAL' as AmenityCategory },
  { name: 'Academia', icon: '💪', category: 'GENERAL' as AmenityCategory },
  { name: 'Spa', icon: '💆', category: 'GENERAL' as AmenityCategory },
  { name: 'Restaurante', icon: '🍽️', category: 'GENERAL' as AmenityCategory },
  { name: 'Bar', icon: '🍹', category: 'GENERAL' as AmenityCategory },
  { name: 'Lavanderia', icon: '🧺', category: 'GENERAL' as AmenityCategory },
  { name: 'Transfer', icon: '🚗', category: 'GENERAL' as AmenityCategory },

  // ACCESSIBILITY
  { name: 'Acesso para cadeirantes', icon: '♿', category: 'ACCESSIBILITY' as AmenityCategory },
  { name: 'Elevador', icon: '🛗', category: 'ACCESSIBILITY' as AmenityCategory },
];

export async function seedAmenities() {
  console.log('🌱 Seeding amenities...');

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: {
        // Use a composite unique key based on name and category
        // Since Prisma doesn't support this directly, we'll use create/skip pattern
        id: '' // This will never match, forcing create
      },
      update: {},
      create: amenity,
    }).catch(() => {
      // Ignore duplicates - amenity might already exist
      console.log(`  ⏭️  Amenity "${amenity.name}" already exists, skipping...`);
    });
  }

  const count = await prisma.amenity.count();
  console.log(`✅ Amenities seeded successfully! Total: ${count}`);
}

// Run seed if called directly
if (require.main === module) {
  seedAmenities()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
