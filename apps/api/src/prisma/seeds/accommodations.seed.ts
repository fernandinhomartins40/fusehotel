import { AccommodationType, Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { generateSlug } from '../../utils/slug';

type SeedAccommodation = {
  name: string;
  type: AccommodationType;
  capacity: number;
  pricePerNight: number;
  description: string;
  shortDescription: string;
  floor?: number | null;
  view?: string | null;
  area?: number | null;
  checkInTime?: string;
  checkOutTime?: string;
  extraBeds?: number;
  maxExtraBeds?: number;
  extraBedPrice?: number;
  cancellationPolicy?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
  images: Array<{
    url: string;
    alt: string;
    order: number;
    isPrimary?: boolean;
  }>;
  amenities: string[];
};

const accommodations: SeedAccommodation[] = [
  {
    name: 'Quarto Standard Vista Jardim',
    type: AccommodationType.ROOM,
    capacity: 2,
    pricePerNight: 320,
    description:
      'Categoria ideal para casais ou viajantes individuais que procuram praticidade, conforto acústico e vista para o jardim interno do hotel.',
    shortDescription: 'Conforto essencial com vista para o jardim e atmosfera silenciosa.',
    floor: 1,
    view: 'Jardim interno',
    area: 24,
    extraBeds: 0,
    maxExtraBeds: 1,
    extraBedPrice: 95,
    cancellationPolicy:
      'Cancelamento gratuito até 48 horas antes do check-in. Após esse prazo, é cobrada a primeira diária.',
    metaTitle: 'Quarto Standard Vista Jardim | FuseHotel',
    metaDescription: 'Quartos superiores com vista para o jardim, ideais para estadias tranquilas.',
    keywords: ['quarto superior', 'vista jardim', 'hotel', 'hospedagem'],
    isAvailable: true,
    isFeatured: false,
    images: [
      {
        url: '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png',
        alt: 'Quarto da categoria Jardim Superior',
        order: 0,
        isPrimary: true,
      },
    ],
    amenities: ['Ar Condicionado', 'Wi-Fi', 'TV', 'Frigobar', 'Cofre', 'Chuveiro'],
  },
  {
    name: 'Quarto Deluxe Vista Mar',
    type: AccommodationType.ROOM,
    capacity: 2,
    pricePerNight: 490,
    description:
      'Categoria premium com varanda, acabamento contemporâneo e vista aberta para o mar, pensada para uma estadia de lazer com mais conforto.',
    shortDescription: 'Categoria premium com varanda e vista frontal para o mar.',
    floor: 2,
    view: 'Mar',
    area: 32,
    extraBeds: 0,
    maxExtraBeds: 1,
    extraBedPrice: 120,
    cancellationPolicy:
      'Cancelamento gratuito até 7 dias antes do check-in. Após esse prazo, cobrança de 50% da reserva.',
    metaTitle: 'Quarto Deluxe Vista Mar | FuseHotel',
    metaDescription: 'Quartos premium com varanda, amenities superiores e vista para o mar.',
    keywords: ['vista mar', 'quarto premium', 'varanda', 'hotel'],
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png',
        alt: 'Quarto da categoria Mar Premium',
        order: 0,
        isPrimary: true,
      },
    ],
    amenities: ['Ar Condicionado', 'Wi-Fi', 'TV a cabo', 'Varanda', 'Vista para o mar', 'Banheira', 'Roupões'],
  },
  {
    name: 'Suíte Master com Hidromassagem',
    type: AccommodationType.SUITE,
    capacity: 3,
    pricePerNight: 780,
    description:
      'Suíte premium com estar integrado, banheira de hidromassagem e ambientação voltada para estadias de lazer de alto padrão.',
    shortDescription: 'Suíte premium com hidromassagem e experiência mais exclusiva.',
    floor: 3,
    view: 'Mar parcial',
    area: 48,
    extraBeds: 0,
    maxExtraBeds: 1,
    extraBedPrice: 130,
    cancellationPolicy:
      'Cancelamento gratuito até 7 dias antes do check-in. Após esse prazo, o sinal é convertido em crédito.',
    metaTitle: 'Suíte Master com Hidromassagem | FuseHotel',
    metaDescription: 'Suíte premium com banheira de hidromassagem e serviços diferenciados.',
    keywords: ['suíte master', 'hidromassagem', 'luxo'],
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png',
        alt: 'Suíte Master com Hidromassagem',
        order: 0,
        isPrimary: true,
      },
    ],
    amenities: ['Ar Condicionado', 'Wi-Fi', 'TV a cabo', 'Frigobar', 'Banheira', 'Roupões', 'Serviço de quarto'],
  },
  {
    name: 'Suíte Família',
    type: AccommodationType.SUITE,
    capacity: 4,
    pricePerNight: 690,
    description:
      'Categoria ampla para famílias, com ambientes generosos, apoio de copa e configuração flexível para adultos e crianças.',
    shortDescription: 'Suíte familiar com mais espaço, apoio de copa e conforto para longas estadias.',
    floor: 4,
    view: 'Piscina e jardim',
    area: 54,
    extraBeds: 1,
    maxExtraBeds: 2,
    extraBedPrice: 110,
    cancellationPolicy:
      'Cancelamento gratuito até 5 dias antes do check-in. Após esse prazo, é cobrada multa de 30%.',
    metaTitle: 'Suíte Família | FuseHotel',
    metaDescription: 'Suíte ideal para famílias com copa de apoio e espaço ampliado.',
    keywords: ['suíte família', 'quarto familiar', 'hotel com crianças'],
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png',
        alt: 'Suíte Família',
        order: 0,
        isPrimary: true,
      },
    ],
    amenities: ['Ar Condicionado', 'Wi-Fi', 'TV', 'Frigobar', 'Micro-ondas', 'Cafeteira', 'Toalhas'],
  },
  {
    name: 'Chalé Romântico',
    type: AccommodationType.CHALET,
    capacity: 2,
    pricePerNight: 980,
    description:
      'Categoria exclusiva em formato chalé, com privacidade, deck externo e atmosfera romântica para experiências a dois.',
    shortDescription: 'Chalé privativo com deck e clima romântico.',
    floor: 0,
    view: 'Bosque e lago',
    area: 58,
    extraBeds: 0,
    maxExtraBeds: 0,
    extraBedPrice: 0,
    cancellationPolicy:
      'Cancelamento gratuito até 10 dias antes do check-in. Após esse prazo, o sinal não é reembolsável.',
    metaTitle: 'Chalé Romântico | FuseHotel',
    metaDescription: 'Chalés privativos para casais com deck externo e ambientação especial.',
    keywords: ['chalé romântico', 'hotel para casal', 'deck privativo'],
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png',
        alt: 'Chalé Reserva',
        order: 0,
        isPrimary: true,
      },
    ],
    amenities: ['Aquecedor', 'Wi-Fi', 'Netflix', 'Cafeteira', 'Jardim', 'Banheira', 'Serviço de quarto'],
  },
  {
    name: 'Villa Presidencial',
    type: AccommodationType.VILLA,
    capacity: 6,
    pricePerNight: 1850,
    description:
      'Categoria premium de maior capacidade do hotel, indicada para famílias grandes, grupos privativos e ocasiões especiais com atendimento diferenciado.',
    shortDescription: 'Villa exclusiva com ampla capacidade e experiência premium.',
    floor: 0,
    view: 'Panorâmica',
    area: 148,
    extraBeds: 0,
    maxExtraBeds: 2,
    extraBedPrice: 180,
    cancellationPolicy:
      'Cancelamento gratuito até 15 dias antes do check-in. Após esse prazo, cobrança integral do sinal.',
    metaTitle: 'Villa Presidencial | FuseHotel',
    metaDescription: 'Villa exclusiva com serviços premium, alto padrão e grande capacidade.',
    keywords: ['villa', 'luxo', 'grupo', 'experiência premium'],
    isAvailable: true,
    isFeatured: true,
    images: [
      {
        url: '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png',
        alt: 'Villa Signature',
        order: 0,
        isPrimary: true,
      },
    ],
    amenities: [
      'Ar Condicionado',
      'Wi-Fi',
      'Cozinha completa',
      'Piscina privativa',
      'Churrasqueira',
      'Banheira',
      'Serviço de quarto',
      'Transfer',
    ],
  },
];

export async function seedAccommodations() {
  const amenityRecords = await prisma.amenity.findMany();
  const amenityById = new Map(amenityRecords.map((item) => [item.id, item]));

  for (const seed of accommodations) {
    const slug = generateSlug(seed.name);

    const data: Prisma.AccommodationUncheckedCreateInput = {
      name: seed.name,
      slug,
      type: seed.type,
      capacity: seed.capacity,
      pricePerNight: seed.pricePerNight,
      description: seed.description,
      shortDescription: seed.shortDescription,
      floor: seed.floor ?? null,
      view: seed.view ?? null,
      area: seed.area ?? null,
      checkInTime: seed.checkInTime ?? '14:00',
      checkOutTime: seed.checkOutTime ?? '12:00',
      extraBeds: seed.extraBeds ?? 0,
      maxExtraBeds: seed.maxExtraBeds ?? 0,
      extraBedPrice: seed.extraBedPrice ?? 0,
      cancellationPolicy: seed.cancellationPolicy ?? null,
      metaTitle: seed.metaTitle ?? seed.name,
      metaDescription: seed.metaDescription ?? seed.shortDescription,
      keywords: seed.keywords ?? [],
      isAvailable: seed.isAvailable ?? true,
      isFeatured: seed.isFeatured ?? false,
    };

    const accommodation = await prisma.accommodation.upsert({
      where: { slug },
      update: data,
      create: data,
    });

    await prisma.accommodationImage.deleteMany({
      where: { accommodationId: accommodation.id },
    });
    await prisma.accommodationAmenity.deleteMany({
      where: { accommodationId: accommodation.id },
    });

    if (seed.images.length) {
      await prisma.accommodationImage.createMany({
        data: seed.images.map((image) => ({
          accommodationId: accommodation.id,
          url: image.url,
          alt: image.alt,
          order: image.order,
          isPrimary: image.isPrimary ?? false,
        })),
      });
    }

    const amenityIds = seed.amenities
      .map((amenityId) => amenityById.get(amenityId)?.id)
      .filter((value): value is string => Boolean(value));

    if (amenityIds.length) {
      await prisma.accommodationAmenity.createMany({
        data: amenityIds.map((amenityId) => ({
          accommodationId: accommodation.id,
          amenityId,
        })),
      });
    }
  }

  console.log(`✅ Accommodations seeded successfully! Total: ${accommodations.length}`);
}
