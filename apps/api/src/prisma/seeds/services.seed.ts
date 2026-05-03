import { PrismaClient, ServiceCategory } from '@prisma/client';

const prisma = new PrismaClient();

const serviceCategoryToProductSlug: Record<ServiceCategory, string> = {
  ACCOMMODATION: 'SERVICE',
  GASTRONOMY: 'FOOD',
  RECREATION: 'SERVICE',
  BUSINESS: 'SERVICE',
  SPECIAL: 'CONVENIENCE',
};

type PublishedServiceSeed = {
  sku: string;
  name: string;
  category: ServiceCategory;
  subtitle?: string;
  description: string;
  image: string;
  price: number;
  isRoomServiceEnabled?: boolean;
  features: string[];
  order: number;
};

const publishedServices: PublishedServiceSeed[] = [
  {
    sku: 'SER-010',
    name: 'Early check-in garantido',
    category: ServiceCategory.ACCOMMODATION,
    subtitle: 'Entrada antecipada',
    description: 'Antecipe sua entrada e garanta acesso ao quarto antes do horário padrão de check-in.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    price: 120,
    features: ['Sujeito à confirmação operacional', 'Ideal para voos matinais'],
    order: 1,
  },
  {
    sku: 'SER-011',
    name: 'Late check-out estendido',
    category: ServiceCategory.ACCOMMODATION,
    subtitle: 'Saída estendida',
    description: 'Estenda sua permanência por algumas horas e finalize a estadia com mais conforto.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    price: 150,
    features: ['Saída até 18h', 'Disponibilidade limitada'],
    order: 2,
  },
  {
    sku: 'ALM-003',
    name: 'Hambúrguer artesanal',
    category: ServiceCategory.GASTRONOMY,
    subtitle: 'Cozinha do hotel',
    description: 'Hambúrguer artesanal servido com batatas rústicas, disponível para consumo direto ou entrega no quarto.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2070&auto=format&fit=crop',
    price: 39,
    isRoomServiceEnabled: true,
    features: ['Entrega no quarto', 'Produção na hora'],
    order: 1,
  },
  {
    sku: 'ALM-004',
    name: 'Pizza individual marguerita',
    category: ServiceCategory.GASTRONOMY,
    subtitle: 'Forno do hotel',
    description: 'Pizza individual assada na hora, ideal para lanche da tarde ou refeição rápida.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    price: 42,
    isRoomServiceEnabled: true,
    features: ['Entrega no quarto', 'Massa artesanal'],
    order: 2,
  },
  {
    sku: 'SER-012',
    name: 'Massagem relaxante',
    category: ServiceCategory.RECREATION,
    subtitle: 'Spa & bem-estar',
    description: 'Sessão de massagem relaxante com 50 minutos, agendada junto à recepção.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    price: 210,
    features: ['Sessão de 50 minutos', 'Agendamento conforme disponibilidade'],
    order: 1,
  },
  {
    sku: 'SER-013',
    name: 'Circuito spa day use',
    category: ServiceCategory.RECREATION,
    subtitle: 'Piscina aquecida e sauna',
    description: 'Acesso ao circuito completo de bem-estar com piscina aquecida, sauna e área de relaxamento.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070&auto=format&fit=crop',
    price: 180,
    features: ['Acesso por período', 'Uso das áreas úmidas'],
    order: 2,
  },
  {
    sku: 'SER-014',
    name: 'Sala de reunião executiva',
    category: ServiceCategory.BUSINESS,
    subtitle: 'Até 10 pessoas',
    description: 'Locação da sala executiva com TV, Wi-Fi dedicado e apoio de água e café.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop',
    price: 380,
    features: ['Período de 4 horas', 'Internet dedicada'],
    order: 1,
  },
  {
    sku: 'SER-015',
    name: 'Coffee break corporativo',
    category: ServiceCategory.BUSINESS,
    subtitle: 'Por participante',
    description: 'Serviço de coffee break com itens doces e salgados para eventos e reuniões corporativas.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    price: 48,
    features: ['Cobrança por participante', 'Montagem no espaço do evento'],
    order: 2,
  },
  {
    sku: 'SER-003',
    name: 'Transfer aeroporto',
    category: ServiceCategory.SPECIAL,
    subtitle: 'Ida e volta sob consulta',
    description: 'Serviço de transfer com agendamento prévio entre o hotel e o aeroporto.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
    price: 160,
    features: ['Agendamento com recepção', 'Serviço terceirizado parceiro'],
    order: 1,
  },
  {
    sku: 'SER-001',
    name: 'Lavanderia expressa',
    category: ServiceCategory.SPECIAL,
    subtitle: 'Peças do dia a dia',
    description: 'Lavagem e passagem expressa para hóspedes que precisam da peça pronta no mesmo dia.',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=2070&auto=format&fit=crop',
    price: 12,
    features: ['Entrega conforme horário de coleta', 'Cobrança por peça'],
    order: 2,
  },
];

async function resolveProductCategoryId(category: ServiceCategory) {
  const preferredSlug = serviceCategoryToProductSlug[category];

  const preferred = await prisma.productCategory.findFirst({
    where: { slug: preferredSlug },
  });

  if (preferred) {
    return preferred.id;
  }

  const fallback = await prisma.productCategory.findFirst({
    orderBy: [{ order: 'asc' }, { label: 'asc' }],
  });

  if (fallback) {
    return fallback.id;
  }

  const labelMap: Record<string, string> = {
    FOOD: 'Alimentos',
    SERVICE: 'Serviços',
    CONVENIENCE: 'Conveniência',
  };

  const created = await prisma.productCategory.create({
    data: {
      slug: preferredSlug,
      label: labelMap[preferredSlug] ?? 'Outros',
      order: 0,
      isActive: true,
    },
  });

  return created.id;
}

async function ensurePublishedService(item: PublishedServiceSeed) {
  const categoryId = await resolveProductCategoryId(item.category);

  const existing =
    (await prisma.pOSProduct.findFirst({
      where: {
        OR: [{ sku: item.sku }, { name: item.name }],
      },
    })) ?? null;

  const payload = {
    name: item.name,
    sku: item.sku,
    categoryId,
    image: item.image,
    price: item.price,
    costPrice: 0,
    stockQuantity: 0,
    minStockQuantity: 0,
    saleUnit: 'UN',
    trackStock: false,
    isActive: true,
    isRoomServiceEnabled: item.isRoomServiceEnabled ?? false,
    description: item.description,
    showOnServicesPage: true,
    servicesPageCategory: item.category,
    servicesPageOrder: item.order,
    servicesPageSubtitle: item.subtitle ?? null,
    servicesPageFeatures: item.features,
  };

  if (existing) {
    await prisma.pOSProduct.update({
      where: { id: existing.id },
      data: payload,
    });
    return;
  }

  await prisma.pOSProduct.create({
    data: payload,
  });
}

export async function seedServices() {
  console.log('🌱 Seeding services page...');

  const sectionsConfig = [
    {
      section: 'services-hero',
      config: {
        title: 'Serviços do hotel',
        subtitle: 'Descubra produtos e serviços que podem ser solicitados durante sua estadia.',
        height: '400px',
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF',
      },
    },
    {
      section: 'services-accommodation',
      config: {
        title: 'Facilidades da hospedagem',
        subtitle: 'Mais flexibilidade para sua estadia',
        description: 'Personalize horários e experiências da hospedagem com serviços cobrados sob demanda.',
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
        buttonText: 'Ver quartos disponíveis',
        buttonColor: '#0466C8',
        buttonHoverColor: '#0355A6',
        showButton: true,
      },
    },
    {
      section: 'services-gastronomy',
      config: {
        title: 'Gastronomia',
        subtitle: 'Pedidos e room service',
        description: 'Seleção de itens do restaurante e da cozinha do hotel disponíveis para consumo.',
        backgroundColor: '#F9F9F9',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
      },
    },
    {
      section: 'services-recreation',
      config: {
        title: 'Lazer e bem-estar',
        subtitle: 'Experiências do resort',
        description: 'Serviços adicionais para relaxar, aproveitar as áreas comuns e elevar a experiência.',
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
      },
    },
    {
      section: 'services-business',
      config: {
        title: 'Eventos e negócios',
        subtitle: 'Estrutura corporativa',
        description: 'Itens e serviços para reuniões, treinamentos e eventos realizados dentro do hotel.',
        backgroundColor: '#F9F9F9',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
        buttonText: 'Falar com o comercial',
        buttonColor: '#0466C8',
        buttonUrl: '/contato',
      },
    },
    {
      section: 'services-special',
      config: {
        title: 'Serviços especiais',
        subtitle: 'Demandas avulsas e conveniências',
        description: 'Serviços complementares para facilitar sua rotina antes, durante e após a hospedagem.',
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
        iconBackgroundColor: '#EFF6FF',
      },
    },
    {
      section: 'services-cta',
      config: {
        title: 'Monte sua experiência',
        description: 'Reserve o quarto e complemente a estadia com os serviços mais adequados ao perfil do hóspede.',
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF',
        primaryButtonText: 'Reservar agora',
        primaryButtonColor: '#FFFFFF',
        primaryButtonUrl: '/acomodacoes',
        secondaryButtonText: 'Falar com o hotel',
        secondaryButtonColor: '#FFFFFF',
        secondaryButtonUrl: '/contato',
      },
    },
  ];

  for (const section of sectionsConfig) {
    await prisma.landingPageSettings.upsert({
      where: { section: section.section },
      update: { config: section.config, isActive: true },
      create: {
        section: section.section,
        config: section.config,
        isActive: true,
      },
    });
  }

  for (const item of publishedServices) {
    await ensurePublishedService(item);
  }

  console.log(`✅ Services page seeded with ${publishedServices.length} published items`);
}
