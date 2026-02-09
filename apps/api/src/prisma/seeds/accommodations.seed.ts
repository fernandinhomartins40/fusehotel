import { PrismaClient, AccommodationType } from '@prisma/client';
import { generateSlug } from '../../utils/slug';

const prisma = new PrismaClient();

const accommodations = [
  {
    name: 'Quarto Standard Vista Jardim',
    type: 'ROOM' as AccommodationType,
    capacity: 2,
    pricePerNight: 250,
    description: `Nosso Quarto Standard oferece conforto e praticidade para sua estadia. Com decoração moderna e aconchegante, o quarto conta com uma cama de casal ou duas camas de solteiro, além de uma vista relaxante para o jardim do hotel.

Perfeito para casais ou viajantes a negócios que buscam uma acomodação confortável com excelente custo-benefício.`,
    shortDescription: 'Quarto confortável com vista para o jardim, ideal para casais',
    floor: 2,
    view: 'Jardim',
    area: 25,
    extraBeds: 0,
    maxExtraBeds: 1,
    extraBedPrice: 80,
    cancellationPolicy: 'Cancelamento gratuito até 48 horas antes do check-in. Após este período, será cobrada uma diária.',
    isAvailable: true,
    isFeatured: false,
    images: [
      {
        url: '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png',
        alt: 'Quarto Standard - Vista Geral',
        order: 0,
        isPrimary: true
      }
    ],
    amenities: ['Ar condicionado', 'Wi-Fi gratuito', 'TV a cabo', 'Frigobar', 'Cofre', 'Chuveiro']
  },
  {
    name: 'Quarto Deluxe Vista Mar',
    type: 'ROOM' as AccommodationType,
    capacity: 2,
    pricePerNight: 450,
    description: `Experimente o luxo do nosso Quarto Deluxe com uma vista deslumbrante para o mar. Este quarto espaçoso oferece uma cama king-size, varanda privativa e acabamentos premium.

Ideal para quem deseja uma experiência mais sofisticada, com todo o conforto e uma vista inesquecível do oceano.`,
    shortDescription: 'Quarto luxuoso com vista panorâmica para o mar e varanda privativa',
    floor: 5,
    view: 'Mar',
    area: 35,
    extraBeds: 0,
    maxExtraBeds: 1,
    extraBedPrice: 100,
    cancellationPolicy: 'Cancelamento gratuito até 7 dias antes do check-in. Após este período, será cobrada uma taxa de 50% do valor total.',
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png',
        alt: 'Quarto Deluxe - Vista Mar',
        order: 0,
        isPrimary: true
      }
    ],
    amenities: ['Ar condicionado', 'Wi-Fi gratuito', 'TV a cabo', 'Frigobar', 'Cofre', 'Varanda', 'Vista para o mar', 'Banheira', 'Roupões', 'Chinelos']
  },
  {
    name: 'Suíte Master com Hidromassagem',
    type: 'SUITE' as AccommodationType,
    capacity: 3,
    pricePerNight: 750,
    description: `Nossa Suíte Master é perfeita para quem busca o máximo em conforto e luxo. Com sala de estar separada, quarto espaçoso com cama king-size e banheiro com banheira de hidromassagem.

A suíte oferece uma experiência premium com todos os detalhes pensados para seu bem-estar e relaxamento.`,
    shortDescription: 'Suíte luxuosa com sala de estar e banheira de hidromassagem',
    floor: 6,
    view: 'Mar e Montanha',
    area: 60,
    extraBeds: 1,
    maxExtraBeds: 2,
    extraBedPrice: 120,
    cancellationPolicy: 'Cancelamento gratuito até 10 dias antes do check-in. Cancelamentos tardios terão cobrança integral.',
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png',
        alt: 'Suíte Master - Sala de Estar',
        order: 0,
        isPrimary: true
      }
    ],
    amenities: ['Ar condicionado', 'Wi-Fi gratuito', 'TV a cabo', 'Netflix', 'Cozinha completa', 'Micro-ondas', 'Cafeteira', 'Varanda', 'Banheira', 'Roupões', 'Chinelos', 'Produtos de banho']
  },
  {
    name: 'Suíte Família',
    type: 'SUITE' as AccommodationType,
    capacity: 4,
    pricePerNight: 650,
    description: `A Suíte Família foi projetada para acomodar toda a família com conforto e espaço. Com dois quartos conectados, um com cama de casal e outro com duas camas de solteiro, além de sala de estar compartilhada.

Perfeita para famílias que desejam privacidade e espaço durante suas férias.`,
    shortDescription: 'Suíte ampla com dois quartos, ideal para famílias',
    floor: 3,
    view: 'Jardim e Piscina',
    area: 70,
    extraBeds: 2,
    maxExtraBeds: 2,
    extraBedPrice: 90,
    cancellationPolicy: 'Cancelamento gratuito até 5 dias antes do check-in. Após este período, será cobrada uma taxa de 30% do valor total.',
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png',
        alt: 'Suíte Família - Quarto Principal',
        order: 0,
        isPrimary: true
      }
    ],
    amenities: ['Ar condicionado', 'Wi-Fi gratuito', 'TV a cabo', 'Frigobar', 'Cofre', 'Micro-ondas', 'Cafeteira', 'Chuveiro', 'Toalhas']
  },
  {
    name: 'Chalé Romântico',
    type: 'CHALET' as AccommodationType,
    capacity: 2,
    pricePerNight: 900,
    description: `Nosso Chalé Romântico oferece total privacidade em meio à natureza. Com lareira, banheira de hidromassagem externa, deck privativo com espreguiçadeiras e vista para as montanhas.

A opção perfeita para casais que buscam um refúgio romântico e exclusivo, longe da agitação do hotel principal.`,
    shortDescription: 'Chalé isolado com lareira e hidromassagem externa',
    floor: 1,
    view: 'Montanha',
    area: 50,
    extraBeds: 0,
    maxExtraBeds: 0,
    extraBedPrice: 0,
    cancellationPolicy: 'Cancelamento gratuito até 15 dias antes do check-in. Cancelamentos tardios não terão reembolso.',
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png',
        alt: 'Chalé Romântico - Exterior',
        order: 0,
        isPrimary: true
      }
    ],
    amenities: ['Ar condicionado', 'Aquecedor', 'Wi-Fi gratuito', 'TV a cabo', 'Netflix', 'Cozinha completa', 'Micro-ondas', 'Cafeteira', 'Churrasqueira', 'Jardim', 'Piscina privativa', 'Banheira', 'Roupões', 'Chinelos', 'Produtos de banho']
  },
  {
    name: 'Villa Presidencial',
    type: 'VILLA' as AccommodationType,
    capacity: 6,
    pricePerNight: 1500,
    description: `A Villa Presidencial é o ápice do luxo e exclusividade. Com três suítes, sala de estar ampla, cozinha gourmet completa, piscina privativa com aquecimento, sauna seca e deck com churrasqueira.

Perfeita para grupos que desejam uma experiência VIP com total privacidade e serviços personalizados de mordomo e chef (disponíveis mediante reserva).`,
    shortDescription: 'Villa de luxo com 3 suítes, piscina e churrasqueira privativos',
    floor: 1,
    view: 'Mar Panorâmico',
    area: 180,
    extraBeds: 0,
    maxExtraBeds: 3,
    extraBedPrice: 150,
    cancellationPolicy: 'Cancelamento gratuito até 30 dias antes do check-in. Cancelamentos tardios não terão reembolso.',
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png',
        alt: 'Villa Presidencial - Vista Externa',
        order: 0,
        isPrimary: true
      }
    ],
    amenities: ['Ar condicionado', 'Aquecedor', 'Wi-Fi gratuito', 'TV a cabo', 'Netflix', 'Som ambiente', 'Cozinha completa', 'Micro-ondas', 'Cafeteira', 'Geladeira', 'Vista para o mar', 'Piscina privativa', 'Churrasqueira', 'Jardim', 'Spa', 'Academia', 'Banheira', 'Roupões', 'Chinelos', 'Produtos de banho', 'Serviço de quarto', 'Café da manhã incluído', 'Lavanderia']
  }
];

export async function seedAccommodations() {
  console.log('🌱 Seeding accommodations...');

  for (const accommodationData of accommodations) {
    const { images, amenities, ...accommodation } = accommodationData;
    const slug = generateSlug(accommodation.name);

    // Verificar se já existe uma acomodação com esse slug
    const existingAccommodation = await prisma.accommodation.findUnique({
      where: { slug }
    });

    if (existingAccommodation) {
      console.log(`  ⏭️  Accommodation "${accommodation.name}" already exists, skipping...`);
      continue;
    }

    // Buscar IDs das amenidades pelo nome
    const amenityIds: string[] = [];
    for (const amenityName of amenities) {
      const amenity = await prisma.amenity.findFirst({
        where: { name: amenityName }
      });
      if (amenity) {
        amenityIds.push(amenity.id);
      }
    }

    // Criar a acomodação com imagens e amenidades
    await prisma.accommodation.create({
      data: {
        ...accommodation,
        slug,
        images: {
          create: images
        },
        amenities: {
          create: amenityIds.map(amenityId => ({
            amenityId
          }))
        }
      },
      include: {
        images: true,
        amenities: true
      }
    });

    console.log(`  ✅ Created accommodation: ${accommodation.name}`);
  }

  const count = await prisma.accommodation.count();
  console.log(`✅ Accommodations seeded successfully! Total: ${count}`);
}

// Run seed if called directly
if (require.main === module) {
  seedAccommodations()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
