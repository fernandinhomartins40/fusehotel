import { PrismaClient, PromotionType } from '@prisma/client';
import { generateSlug } from '../../utils/slug';

const prisma = new PrismaClient();

const promotions = [
  {
    title: 'Pacote Romântico',
    shortDescription: 'Desfrute de uma escapada romântica com jantar à luz de velas e tratamentos de spa.',
    longDescription: `Pacote romântico especial para casais que buscam um momento inesquecível.

Inclui:
- Hospedagem por 2 noites em uma suíte luxuosa
- Jantar à luz de velas com menu especial
- Uma sessão de massagem para casal
- Café da manhã no quarto
- Espumante de boas-vindas
- Decoração especial no quarto`,
    image: '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-07-30'),
    originalPrice: 1500,
    discountedPrice: 1200,
    discountPercent: 20,
    type: 'PACKAGE' as PromotionType,
    isActive: true,
    isFeatured: true,
    termsAndConditions: 'Válido para reservas feitas até 30 dias antes da data de check-in. Sujeito a disponibilidade.',
    maxRedemptions: 50,
    currentRedemptions: 0,
    promotionCode: 'ROMANTICO2025',
    features: [
      'Hospedagem 2 noites',
      'Jantar romântico',
      'Massagem para casal',
      'Café da manhã no quarto'
    ]
  },
  {
    title: 'Promoção de Férias',
    shortDescription: 'Traga a família e ganhe 30% de desconto em estadias de 5 ou mais diárias.',
    longDescription: `Promoção especial para toda família aproveitar as férias!

Detalhes:
- 30% de desconto em estadias de 5 ou mais diárias
- Acesso gratuito a todas as instalações do hotel
- Crianças até 10 anos não pagam hospedagem
- Inclui café da manhã completo
- Uma atividade recreativa gratuita por dia para as crianças`,
    image: '/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png',
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-08-15'),
    originalPrice: 3500,
    discountedPrice: 2450,
    discountPercent: 30,
    type: 'SEASONAL' as PromotionType,
    isActive: true,
    isFeatured: true,
    termsAndConditions: 'Desconto aplicável apenas para reservas de 5 diárias ou mais. Crianças até 10 anos não pagam hospedagem (máximo 2 crianças por quarto).',
    maxRedemptions: 100,
    currentRedemptions: 0,
    promotionCode: 'FERIAS30',
    features: [
      '30% de desconto',
      'Crianças não pagam',
      'Café da manhã',
      'Atividades recreativas'
    ]
  },
  {
    title: 'Escapada de Fim de Semana',
    shortDescription: 'Escape da rotina com nossa promoção especial para fins de semana.',
    longDescription: `Relaxe e recarregue suas energias com nossa escapada de fim de semana.

Inclui:
- Hospedagem por 2 noites (sexta a domingo)
- Café da manhã completo
- Acesso ao spa e instalações de bem-estar
- Check-out tardio (até às 16h, sujeito à disponibilidade)
- Welcome drink`,
    image: '/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-12-15'),
    originalPrice: 1200,
    discountedPrice: 950,
    discountPercent: 21,
    type: 'SPECIAL_OFFER' as PromotionType,
    isActive: true,
    isFeatured: false,
    termsAndConditions: 'Válido apenas para check-in às sextas-feiras. Check-out tardio sujeito a disponibilidade.',
    maxRedemptions: 75,
    currentRedemptions: 0,
    promotionCode: 'FIMDESEMANA',
    features: [
      'Hospedagem 2 noites',
      'Café da manhã',
      'Acesso ao spa',
      'Check-out tardio'
    ]
  }
];

export async function seedPromotions() {
  console.log('🌱 Seeding promotions...');

  for (const promotionData of promotions) {
    const { features, ...promotion } = promotionData;
    const slug = generateSlug(promotion.title);

    // Verificar se já existe uma promoção com esse slug
    const existingPromotion = await prisma.promotion.findUnique({
      where: { slug }
    });

    if (existingPromotion) {
      console.log(`  ⏭️  Promotion "${promotion.title}" already exists, skipping...`);
      continue;
    }

    // Criar a promoção com suas features
    await prisma.promotion.create({
      data: {
        ...promotion,
        slug,
        features: {
          create: features.map((feature, index) => ({
            feature,
            order: index
          }))
        }
      },
      include: {
        features: true
      }
    });

    console.log(`  ✅ Created promotion: ${promotion.title}`);
  }

  const count = await prisma.promotion.count();
  console.log(`✅ Promotions seeded successfully! Total: ${count}`);
}

// Run seed if called directly
if (require.main === module) {
  seedPromotions()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
