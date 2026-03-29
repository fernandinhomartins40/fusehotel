import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAboutPage() {
  console.log('Seeding about page...');

  const sectionsConfig = [
    {
      id: 'seed-about-hero',
      section: 'about-hero',
      config: {
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF',
        title: 'Sobre Nós',
        description:
          'Conheça a história e a equipe por trás do Hotel Águas Claras, onde tradição e hospitalidade se encontram para proporcionar a melhor experiência aos nossos hóspedes.',
        height: '400px',
      },
    },
    {
      id: 'seed-about-history',
      section: 'about-history',
      config: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
        title: 'Nossa História',
        paragraph1:
          'Fundado em 1985, o Hotel Águas Claras começou como um pequeno estabelecimento familiar com apenas 10 quartos. Com o passar dos anos, crescemos e nos transformamos em um dos hotéis mais respeitados da região, mantendo sempre o acolhimento e o atendimento personalizado que nos caracteriza.',
        paragraph2:
          'Localizado em uma área privilegiada, entre montanhas e próximo a nascentes naturais, nosso hotel foi construído com o compromisso de preservar o meio ambiente e oferecer aos nossos hóspedes uma experiência autêntica de contato com a natureza.',
        paragraph3:
          'Hoje, contamos com 45 acomodações de alto padrão, divididas entre apartamentos, chalés e suítes, todas equipadas com infraestrutura moderna e decoração que remete à natureza exuberante da região.',
        image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
        imageAlt: 'Vista do Hotel Águas Claras',
      },
    },
    {
      id: 'seed-about-mvv',
      section: 'about-mission-vision-values',
      config: {
        backgroundColor: '#F9F9F9',
        titleColor: '#0466C8',
        subtitleColor: '#0466C8',
        title: 'Missão, Visão e Valores',
        missionTitle: 'Missão',
        missionText:
          'Proporcionar aos nossos hóspedes uma experiência única de hospedagem, combinando conforto, hospitalidade e contato com a natureza, superando suas expectativas e criando momentos memoráveis.',
        visionTitle: 'Visão',
        visionText:
          'Ser reconhecido como referência em hotelaria sustentável na região, aliando qualidade de serviços, respeito ao meio ambiente e promoção do turismo local.',
        valuesTitle: 'Valores',
        valuesItems: [
          'Excelência no atendimento',
          'Sustentabilidade ambiental',
          'Valorização da cultura local',
          'Inovação e melhoria contínua',
          'Ética e transparência',
          'Trabalho em equipe',
        ],
      },
    },
    {
      id: 'seed-about-team',
      section: 'about-team',
      config: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        subtitleColor: '#0466C8',
        title: 'Nossa Equipe',
        gridColumns: 3,
      },
    },
    {
      id: 'seed-about-awards',
      section: 'about-awards',
      config: {
        backgroundColor: '#F9F9F9',
        titleColor: '#0466C8',
        subtitleColor: '#666666',
        title: 'Reconhecimentos e Prêmios',
        gridColumns: 4,
      },
    },
  ];

  for (const section of sectionsConfig) {
    await prisma.landingPageSettings.upsert({
      where: { section: section.section },
      update: {},
      create: section,
    });
  }

  console.log('About sections config created');

  const teamMembers = [
    {
      id: 'seed-team-1',
      name: 'Ana Oliveira',
      role: 'Diretora Geral',
      description:
        'Com mais de 20 anos de experiência em hotelaria, Ana lidera nossa equipe com dedicação e visão inovadora.',
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVyc29ufHx8fHx8MTY4MzczNzY1MQ&ixlib=rb-4.0.3&q=80&w=300',
      order: 1,
      isActive: true,
    },
    {
      id: 'seed-team-2',
      name: 'Carlos Santos',
      role: 'Chef Executivo',
      description:
        'Formado na França, Carlos traz para nossa cozinha o melhor da gastronomia internacional com toques regionais.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFufHx8fHx8MTY4MzczNzY5NA&ixlib=rb-4.0.3&q=80&w=300',
      order: 2,
      isActive: true,
    },
    {
      id: 'seed-team-3',
      name: 'Mariana Lima',
      role: 'Gerente de Hospitalidade',
      description:
        'Especialista em atendimento ao cliente, Mariana garante que cada hóspede tenha uma experiência memorável.',
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8d29tYW58fHx8fHwxNjgzNzM3NzQy&ixlib=rb-4.0.3&q=80&w=300',
      order: 3,
      isActive: true,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {},
      create: member,
    });
  }

  console.log('Team members created');

  const awards = [
    {
      id: 'seed-award-1',
      title: 'Melhor Hotel Sustentável',
      description: 'Prêmio Verde - 2023',
      icon: 'leaf',
      order: 1,
      isActive: true,
    },
    {
      id: 'seed-award-2',
      title: 'Excelência em Hospitalidade',
      description: 'Guia 5 Estrelas - 2022',
      icon: 'star',
      order: 2,
      isActive: true,
    },
    {
      id: 'seed-award-3',
      title: 'Gastronomia Regional',
      description: 'Festival Sabores - 2021',
      icon: 'utensils-crossed',
      order: 3,
      isActive: true,
    },
    {
      id: 'seed-award-4',
      title: 'Melhor para Eventos',
      description: 'Associação de Turismo - 2020',
      icon: 'briefcase',
      order: 4,
      isActive: true,
    },
  ];

  for (const award of awards) {
    await prisma.award.upsert({
      where: { id: award.id },
      update: {},
      create: award,
    });
  }

  console.log('Awards created');
  console.log('About page seeded successfully!');
}

if (require.main === module) {
  seedAboutPage()
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
