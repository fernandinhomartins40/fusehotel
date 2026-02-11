import { PrismaClient, ServiceCategory } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedServices() {
  console.log('Seeding services page...');

  // Seed configurações das seções
  const sectionsConfig = [
    {
      id: 'seed-services-hero',
      section: 'services-hero',
      config: {
        title: 'Nossos Serviços',
        subtitle: 'Descubra todos os serviços e facilidades que tornam sua estadia no Hotel Águas Claras uma experiência inesquecível.',
        height: '400px',
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF'
      }
    },
    {
      id: 'seed-services-accommodation',
      section: 'services-accommodation',
      config: {
        title: 'Hospedagem',
        subtitle: 'Acomodações',
        description: 'Oferecemos diversas opções de acomodação para atender às suas necessidades, todas com conforto e elegância.',
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
        buttonText: 'Ver Todas as Acomodações',
        buttonColor: '#0466C8',
        buttonHoverColor: '#0355A6',
        showButton: true
      }
    },
    {
      id: 'seed-services-gastronomy',
      section: 'services-gastronomy',
      config: {
        title: 'Gastronomia',
        subtitle: 'Experiências Culinárias',
        description: 'Nossa gastronomia é um dos destaques do hotel, com pratos preparados com ingredientes frescos e regionais.',
        backgroundColor: '#F9F9F9',
        titleColor: '#0466C8',
        subtitleColor: '#666666'
      }
    },
    {
      id: 'seed-services-recreation',
      section: 'services-recreation',
      config: {
        title: 'Lazer e Bem-Estar',
        subtitle: 'Atividades',
        description: 'Desfrute de momentos de relaxamento e diversão com nossa completa infraestrutura de lazer e bem-estar.',
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        subtitleColor: '#666666'
      }
    },
    {
      id: 'seed-services-business',
      section: 'services-business',
      config: {
        title: 'Serviços Empresariais',
        subtitle: 'Eventos Corporativos',
        description: 'O Hotel Águas Claras oferece espaços versáteis e serviços especializados para eventos corporativos.',
        backgroundColor: '#F9F9F9',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
        buttonText: 'Solicitar Orçamento',
        buttonColor: '#0466C8',
        buttonUrl: '/contato'
      }
    },
    {
      id: 'seed-services-special',
      section: 'services-special',
      config: {
        title: 'Serviços Especiais',
        subtitle: 'Comodidades Exclusivas',
        description: 'Personalize sua estadia com nossos serviços adicionais de alta qualidade.',
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
        iconBackgroundColor: '#EFF6FF'
      }
    },
    {
      id: 'seed-services-cta',
      section: 'services-cta',
      config: {
        title: 'Reserve Sua Experiência',
        description: 'Nossos serviços exclusivos estão esperando por você. Reserve agora e garanta uma estadia inesquecível.',
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF',
        primaryButtonText: 'Reservar Agora',
        primaryButtonColor: '#FFFFFF',
        primaryButtonUrl: '#',
        secondaryButtonText: 'Contato',
        secondaryButtonColor: '#FFFFFF',
        secondaryButtonUrl: '/contato'
      }
    }
  ];

  for (const section of sectionsConfig) {
    await prisma.landingPageSettings.upsert({
      where: { section: section.section },
      update: { config: section.config },
      create: section
    });
  }

  console.log('Services sections config created');

  // Seed itens de hospedagem
  const accommodationItems = [
    {
      id: 'seed-accommodation-1',
      category: ServiceCategory.ACCOMMODATION,
      title: 'Quarto Standard',
      subtitle: '25m² - Queen Size',
      description: 'Quartos confortáveis com cama queen-size ou duas camas de solteiro, ar-condicionado, TV e banheiro privativo.',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Frigobar', 'Secador de cabelo'],
      order: 1,
      isActive: true
    },
    {
      id: 'seed-accommodation-2',
      category: ServiceCategory.ACCOMMODATION,
      title: 'Suíte Luxo',
      subtitle: '40m² - King Size',
      description: 'Suítes espaçosas com cama king-size, sala de estar, banheira de hidromassagem e varanda com vista privilegiada.',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
      features: ['Café da manhã incluso', 'Wi-Fi de alta velocidade', 'Serviço de quarto 24h', 'Amenities premium'],
      order: 2,
      isActive: true
    },
    {
      id: 'seed-accommodation-3',
      category: ServiceCategory.ACCOMMODATION,
      title: 'Chalé',
      subtitle: '60m² - 2 Quartos',
      description: 'Chalés independentes perfeitos para famílias, com 2 quartos, sala de estar, cozinha compacta e deck privativo.',
      image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop',
      features: ['Café da manhã incluso', 'Lareira', 'Vista para a mata', 'Churrasqueira privativa'],
      order: 3,
      isActive: true
    }
  ];

  for (const item of accommodationItems) {
    await prisma.serviceItem.upsert({
      where: { id: item.id },
      update: {},
      create: item
    });
  }

  console.log('Accommodation items created');

  // Seed itens de gastronomia
  const gastronomyItems = [
    {
      id: 'seed-gastronomy-1',
      category: ServiceCategory.GASTRONOMY,
      title: 'Restaurante Principal',
      subtitle: 'Cozinha Internacional',
      description: 'O Restaurante Águas Claras serve café da manhã, almoço e jantar com uma rica variedade de pratos da culinária nacional e internacional. Vista panorâmica para as montanhas.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 1,
      isActive: true
    },
    {
      id: 'seed-gastronomy-2',
      category: ServiceCategory.GASTRONOMY,
      title: 'Bar da Piscina',
      subtitle: 'Drinks & Petiscos',
      description: 'Bebidas refrescantes, coquetéis e petiscos servidos à beira da piscina. O local perfeito para relaxar enquanto aprecia o pôr do sol.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2071&auto=format&fit=crop',
      features: [],
      order: 2,
      isActive: true
    },
    {
      id: 'seed-gastronomy-3',
      category: ServiceCategory.GASTRONOMY,
      title: 'Lobby Bar',
      subtitle: 'Ambiente Sofisticado',
      description: 'Ambiente sofisticado para desfrutar de drinques premium e uma carta de vinhos selecionada. Música ao vivo nas sextas e sábados.',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2127&auto=format&fit=crop',
      features: [],
      order: 3,
      isActive: true
    }
  ];

  for (const item of gastronomyItems) {
    await prisma.serviceItem.upsert({
      where: { id: item.id },
      update: {},
      create: item
    });
  }

  console.log('Gastronomy items created');

  // Seed itens de lazer
  const recreationItems = [
    {
      id: 'seed-recreation-1',
      category: ServiceCategory.RECREATION,
      title: 'Piscinas',
      description: 'Duas piscinas: externa com vista panorâmica e interna aquecida. Serviço de bar na piscina externa e espreguiçadeiras para o seu conforto.',
      image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 1,
      isActive: true
    },
    {
      id: 'seed-recreation-2',
      category: ServiceCategory.RECREATION,
      title: 'Spa',
      description: 'Espaço dedicado ao bem-estar com massagens terapêuticas, tratamentos faciais e corporais, sauna seca, sauna a vapor e ofurô.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 2,
      isActive: true
    },
    {
      id: 'seed-recreation-3',
      category: ServiceCategory.RECREATION,
      title: 'Academia',
      description: 'Academia completa com equipamentos modernos de musculação e cardiovascular. Aulas de yoga e alongamento disponíveis mediante agendamento.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 3,
      isActive: true
    },
    {
      id: 'seed-recreation-4',
      category: ServiceCategory.RECREATION,
      title: 'Trilhas Ecológicas',
      description: 'Trilhas de diferentes níveis de dificuldade pela mata nativa, com guias especializados. Observação de pássaros e contato com a natureza.',
      image: 'https://images.unsplash.com/photo-1626368175877-79236777e95e?q=80&w=2071&auto=format&fit=crop',
      features: [],
      order: 4,
      isActive: true
    },
    {
      id: 'seed-recreation-5',
      category: ServiceCategory.RECREATION,
      title: 'Esportes',
      description: 'Quadras de tênis, vôlei de areia, campo de futebol society e mesa de ping-pong. Equipamentos disponíveis para empréstimo na recepção.',
      image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 5,
      isActive: true
    },
    {
      id: 'seed-recreation-6',
      category: ServiceCategory.RECREATION,
      title: 'Recreação Infantil',
      description: 'Espaço kids com monitores especializados, brinquedoteca, atividades ao ar livre e programação especial nas férias e feriados.',
      image: 'https://images.unsplash.com/photo-1596461868807-a81baa0d7e3f?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 6,
      isActive: true
    }
  ];

  for (const item of recreationItems) {
    await prisma.serviceItem.upsert({
      where: { id: item.id },
      update: {},
      create: item
    });
  }

  console.log('Recreation items created');

  // Seed itens empresariais
  const businessItems = [
    {
      id: 'seed-business-1',
      category: ServiceCategory.BUSINESS,
      title: 'Salas de Reunião',
      description: '3 salas modulares com capacidade para até 120 pessoas, equipadas com tecnologia audiovisual e internet de alta velocidade.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 1,
      isActive: true
    },
    {
      id: 'seed-business-2',
      category: ServiceCategory.BUSINESS,
      title: 'Business Center',
      description: 'Espaço dedicado com computadores, impressora, scanner e serviços de secretariado para atender suas necessidades profissionais.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 2,
      isActive: true
    },
    {
      id: 'seed-business-3',
      category: ServiceCategory.BUSINESS,
      title: 'Pacotes Corporativos',
      description: 'Oferecemos pacotes especiais para empresas, incluindo hospedagem, coffee breaks, refeições e atividades de team building.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 3,
      isActive: true
    },
    {
      id: 'seed-business-4',
      category: ServiceCategory.BUSINESS,
      title: 'Eventos Sociais',
      description: 'Espaços versáteis para casamentos, aniversários, formaturas e outros eventos sociais, com serviço de buffet personalizado.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 4,
      isActive: true
    }
  ];

  for (const item of businessItems) {
    await prisma.serviceItem.upsert({
      where: { id: item.id },
      update: {},
      create: item
    });
  }

  console.log('Business items created');

  // Seed itens especiais
  const specialItems = [
    {
      id: 'seed-special-1',
      category: ServiceCategory.SPECIAL,
      title: 'Decorações Especiais',
      description: 'Decoração romântica, surpresas para aniversários, flores e outros detalhes personalizados para comemorações.',
      image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 1,
      isActive: true
    },
    {
      id: 'seed-special-2',
      category: ServiceCategory.SPECIAL,
      title: 'Serviço de Babá',
      description: 'Profissionais treinados para cuidar das crianças enquanto os pais aproveitam os demais serviços do hotel.',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 2,
      isActive: true
    },
    {
      id: 'seed-special-3',
      category: ServiceCategory.SPECIAL,
      title: 'Concierge',
      description: 'Assistência personalizada para reservas em restaurantes, passeios turísticos, transfers e outras solicitações especiais.',
      image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 3,
      isActive: true
    },
    {
      id: 'seed-special-4',
      category: ServiceCategory.SPECIAL,
      title: 'Transfers',
      description: 'Serviço de transporte privativo do aeroporto/rodoviária até o hotel e para passeios na região.',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
      features: [],
      order: 4,
      isActive: true
    }
  ];

  for (const item of specialItems) {
    await prisma.serviceItem.upsert({
      where: { id: item.id },
      update: {},
      create: item
    });
  }

  console.log('Special items created');
  console.log('Services page seeded successfully!');
}

// Execute if run directly
if (require.main === module) {
  seedServices()
    .then(() => {
      console.log('Seed completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
