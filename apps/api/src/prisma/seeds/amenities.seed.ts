import { PrismaClient, AmenityCategory } from '@prisma/client';

const prisma = new PrismaClient();

const amenities = [
  { id: 'Ar Condicionado', name: 'Ar condicionado', icon: 'wind', category: AmenityCategory.BEDROOM },
  { id: 'Aquecedor', name: 'Aquecedor', icon: 'flame', category: AmenityCategory.BEDROOM },
  { id: 'TV', name: 'TV', icon: 'tv', category: AmenityCategory.ENTERTAINMENT },
  { id: 'Frigobar', name: 'Frigobar', icon: 'refrigerator', category: AmenityCategory.KITCHEN },
  { id: 'Cofre', name: 'Cofre', icon: 'lock', category: AmenityCategory.BEDROOM },
  { id: 'Varanda', name: 'Varanda', icon: 'panel-top-open', category: AmenityCategory.BEDROOM },
  { id: 'Roupeiro', name: 'Roupeiro', icon: 'shirt', category: AmenityCategory.BEDROOM },
  { id: 'Escrivaninha', name: 'Escrivaninha', icon: 'armchair', category: AmenityCategory.BEDROOM },
  { id: 'Banheira', name: 'Banheira', icon: 'bath', category: AmenityCategory.BATHROOM },
  { id: 'Chuveiro', name: 'Chuveiro', icon: 'shower-head', category: AmenityCategory.BATHROOM },
  { id: 'Secador de Cabelo', name: 'Secador de cabelo', icon: 'wind', category: AmenityCategory.BATHROOM },
  { id: 'Roupões', name: 'Roupões', icon: 'shirt', category: AmenityCategory.BATHROOM },
  { id: 'Chinelos', name: 'Chinelos', icon: 'footprints', category: AmenityCategory.BATHROOM },
  { id: 'Produtos de banho', name: 'Produtos de banho', icon: 'package-open', category: AmenityCategory.BATHROOM },
  { id: 'Toalhas', name: 'Toalhas', icon: 'bath', category: AmenityCategory.BATHROOM },
  { id: 'Wi-Fi', name: 'Wi-Fi gratuito', icon: 'wifi', category: AmenityCategory.ENTERTAINMENT },
  { id: 'TV a cabo', name: 'TV a cabo', icon: 'tv', category: AmenityCategory.ENTERTAINMENT },
  { id: 'Netflix', name: 'Netflix', icon: 'monitor-play', category: AmenityCategory.ENTERTAINMENT },
  { id: 'Som ambiente', name: 'Som ambiente', icon: 'speaker', category: AmenityCategory.ENTERTAINMENT },
  { id: 'Cozinha completa', name: 'Cozinha completa', icon: 'chef-hat', category: AmenityCategory.KITCHEN },
  { id: 'Micro-ondas', name: 'Micro-ondas', icon: 'microwave', category: AmenityCategory.KITCHEN },
  { id: 'Cafeteira', name: 'Cafeteira', icon: 'coffee', category: AmenityCategory.KITCHEN },
  { id: 'Utensílios de cozinha', name: 'Utensílios de cozinha', icon: 'utensils-crossed', category: AmenityCategory.KITCHEN },
  { id: 'Geladeira', name: 'Geladeira', icon: 'refrigerator', category: AmenityCategory.KITCHEN },
  { id: 'Vista para o mar', name: 'Vista para o mar', icon: 'waves', category: AmenityCategory.OUTDOOR },
  { id: 'Vista para a montanha', name: 'Vista para a montanha', icon: 'mountain', category: AmenityCategory.OUTDOOR },
  { id: 'Vista para o jardim', name: 'Vista para o jardim', icon: 'trees', category: AmenityCategory.OUTDOOR },
  { id: 'Piscina privativa', name: 'Piscina privativa', icon: 'waves-ladder', category: AmenityCategory.OUTDOOR },
  { id: 'Churrasqueira', name: 'Churrasqueira', icon: 'flame', category: AmenityCategory.OUTDOOR },
  { id: 'Jardim', name: 'Jardim', icon: 'flower-2', category: AmenityCategory.OUTDOOR },
  { id: 'Serviço de quarto', name: 'Serviço de quarto', icon: 'bell-ring', category: AmenityCategory.GENERAL },
  { id: 'Café da manhã incluído', name: 'Café da manhã incluído', icon: 'croissant', category: AmenityCategory.GENERAL },
  { id: 'Estacionamento', name: 'Estacionamento gratuito', icon: 'car', category: AmenityCategory.GENERAL },
  { id: 'Academia', name: 'Academia', icon: 'dumbbell', category: AmenityCategory.GENERAL },
  { id: 'Spa', name: 'Spa', icon: 'sparkles', category: AmenityCategory.GENERAL },
  { id: 'Restaurante', name: 'Restaurante', icon: 'utensils-crossed', category: AmenityCategory.GENERAL },
  { id: 'Bar', name: 'Bar', icon: 'martini', category: AmenityCategory.GENERAL },
  { id: 'Lavanderia', name: 'Lavanderia', icon: 'shirt', category: AmenityCategory.GENERAL },
  { id: 'Transfer', name: 'Transfer', icon: 'car-taxi-front', category: AmenityCategory.GENERAL },
  { id: 'Acesso para cadeirantes', name: 'Acesso para cadeirantes', icon: 'accessibility', category: AmenityCategory.ACCESSIBILITY },
  { id: 'Elevador', name: 'Elevador', icon: 'arrow-up-down', category: AmenityCategory.ACCESSIBILITY },
  { id: 'Roupa de Cama', name: 'Roupa de Cama', icon: 'bed', category: AmenityCategory.BEDROOM },
] as const;

export async function seedAmenities() {
  console.log('🌱 Seeding amenities...');

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { id: amenity.id },
      update: {
        name: amenity.name,
        icon: amenity.icon,
        category: amenity.category,
      },
      create: amenity,
    });
  }

  const count = await prisma.amenity.count();
  console.log(`✅ Amenities seeded successfully! Total: ${count}`);
}

if (require.main === module) {
  seedAmenities()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
