import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';

export async function seedFAQ() {
  logger.info('🌱 Seeding FAQ...');

  // Create FAQ Hero settings
  await prisma.landingPageSettings.upsert({
    where: { section: 'faq-hero' },
    update: {
      config: {
        title: 'Perguntas Frequentes',
        description: 'Encontre respostas para as dúvidas mais comuns sobre hospedagem, serviços e políticas do Hotel Águas Claras.',
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF',
        height: 'auto',
      }
    },
    create: {
      section: 'faq-hero',
      config: {
        title: 'Perguntas Frequentes',
        description: 'Encontre respostas para as dúvidas mais comuns sobre hospedagem, serviços e políticas do Hotel Águas Claras.',
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF',
        height: 'auto',
      },
      isActive: true,
    }
  });

  // Create FAQ Content settings
  await prisma.landingPageSettings.upsert({
    where: { section: 'faq-content' },
    update: {
      config: {
        backgroundColor: '#FFFFFF',
        categoryTitleColor: '#0466C8',
        questionColor: '#000000',
        answerColor: '#374151',
        borderColor: '#E5E7EB',
      }
    },
    create: {
      section: 'faq-content',
      config: {
        backgroundColor: '#FFFFFF',
        categoryTitleColor: '#0466C8',
        questionColor: '#000000',
        answerColor: '#374151',
        borderColor: '#E5E7EB',
      },
      isActive: true,
    }
  });

  // Create FAQ Contact settings
  await prisma.landingPageSettings.upsert({
    where: { section: 'faq-contact' },
    update: {
      config: {
        title: 'Ainda tem dúvidas?',
        description: 'Se não encontrou a resposta que procura, entre em contato conosco diretamente.',
        buttonText: 'Fale Conosco',
        buttonUrl: '/contato',
        backgroundColor: '#F9FAFB',
        titleColor: '#000000',
        subtitleColor: '#374151',
        buttonColor: '#0466C8',
        buttonTextColor: '#FFFFFF',
      }
    },
    create: {
      section: 'faq-contact',
      config: {
        title: 'Ainda tem dúvidas?',
        description: 'Se não encontrou a resposta que procura, entre em contato conosco diretamente.',
        buttonText: 'Fale Conosco',
        buttonUrl: '/contato',
        backgroundColor: '#F9FAFB',
        titleColor: '#000000',
        subtitleColor: '#374151',
        buttonColor: '#0466C8',
        buttonTextColor: '#FFFFFF',
      },
      isActive: true,
    }
  });

  // Create FAQ Categories and Items
  const categories = [
    {
      name: 'Reservas e Check-in',
      order: 1,
      questions: [
        {
          question: 'Como posso fazer uma reserva?',
          answer: 'Você pode fazer reservas através do nosso site, por telefone (11) 5555-5555, por e-mail contato@aguasclaras.com ou através das principais plataformas de reserva online.',
          order: 1
        },
        {
          question: 'Qual é o horário de check-in e check-out?',
          answer: 'Nosso horário de check-in é a partir das 14h e o check-out deve ser realizado até as 12h. Caso precise de horários especiais, entre em contato conosco com antecedência.',
          order: 2
        },
        {
          question: 'Posso fazer check-in antecipado ou check-out tardio?',
          answer: 'Sim, mediante disponibilidade e com possível cobrança adicional. Para check-in antecipado (antes das 14h) ou check-out tardio (após 12h), entre em contato com a recepção.',
          order: 3
        },
        {
          question: 'Quais documentos preciso apresentar no check-in?',
          answer: 'É necessário apresentar um documento oficial com foto (RG, CNH ou passaporte) para todos os hóspedes, incluindo crianças. Estrangeiros devem apresentar passaporte válido.',
          order: 4
        }
      ]
    },
    {
      name: 'Acomodações',
      order: 2,
      questions: [
        {
          question: 'Quais tipos de quartos vocês oferecem?',
          answer: 'Oferecemos diversas categorias de acomodações, desde quartos standard até suítes luxo, além de chalés independentes. Todas as acomodações possuem ar-condicionado, TV, frigobar e Wi-Fi gratuito.',
          order: 1
        },
        {
          question: 'As acomodações possuem ar-condicionado?',
          answer: 'Sim, todas as nossas acomodações são equipadas com ar-condicionado split, garantindo conforto térmico em qualquer estação do ano.',
          order: 2
        },
        {
          question: 'O Wi-Fi é gratuito?',
          answer: 'Sim, oferecemos Wi-Fi gratuito de alta velocidade em todas as áreas do hotel, incluindo quartos, áreas comuns e espaços de lazer.',
          order: 3
        },
        {
          question: 'Os quartos possuem cofre?',
          answer: 'Sim, todas as acomodações são equipadas com cofres individuais para sua segurança e conveniência.',
          order: 4
        }
      ]
    },
    {
      name: 'Serviços e Facilidades',
      order: 3,
      questions: [
        {
          question: 'O hotel oferece café da manhã?',
          answer: 'Sim, o café da manhã está incluso na diária e é servido no restaurante principal das 7h às 10h. Oferecemos um buffet variado com opções regionais e internacionais.',
          order: 1
        },
        {
          question: 'Há estacionamento disponível?',
          answer: 'Sim, dispomos de estacionamento privativo para hóspedes sem custo adicional. O serviço de manobrista está disponível mediante solicitação.',
          order: 2
        },
        {
          question: 'O hotel possui piscina?',
          answer: 'Sim, contamos com duas piscinas: uma ao ar livre com vista panorâmica e uma piscina aquecida coberta. Ambas estão disponíveis para uso dos hóspedes das 8h às 22h.',
          order: 3
        },
        {
          question: 'Quais refeições são servidas no hotel?',
          answer: 'Além do café da manhã incluso, nosso restaurante serve almoço das 12h às 15h e jantar das 19h às 22h30. Também temos um bar que serve petiscos e bebidas ao longo do dia.',
          order: 4
        }
      ]
    },
    {
      name: 'Pagamentos e Políticas',
      order: 4,
      questions: [
        {
          question: 'Quais formas de pagamento são aceitas?',
          answer: 'Aceitamos pagamentos em dinheiro, PIX, cartões de crédito (Visa, Mastercard, American Express) e débito. Para reservas online, é necessário um cartão de crédito para garantia.',
          order: 1
        },
        {
          question: 'Qual é a política de cancelamento?',
          answer: 'Cancelamentos com até 48 horas de antecedência da data de check-in são reembolsáveis. Após este prazo ou em caso de não comparecimento, será cobrada a primeira diária.',
          order: 2
        },
        {
          question: 'Posso parcelar o pagamento?',
          answer: 'Sim, oferecemos parcelamento em até 3x sem juros para pagamentos com cartão de crédito. Para mais parcelas, consulte as condições disponíveis no momento da reserva.',
          order: 3
        },
        {
          question: 'O hotel aceita animais de estimação?',
          answer: 'Sim, somos pet friendly em determinadas acomodações. Animais de pequeno e médio porte são bem-vindos, mediante taxa adicional e seguindo nossas políticas para pets.',
          order: 4
        }
      ]
    },
    {
      name: 'Localização e Transporte',
      order: 5,
      questions: [
        {
          question: 'O hotel oferece serviço de transfer?',
          answer: 'Sim, oferecemos serviço de transfer mediante reserva prévia. O serviço está disponível do aeroporto/rodoviária até o hotel e vice-versa, com custo adicional baseado na distância.',
          order: 1
        },
        {
          question: 'Quais atrações turísticas estão próximas ao hotel?',
          answer: 'Estamos localizados próximos a diversas atrações naturais como trilhas ecológicas, cachoeiras e mirantes. O centro histórico da cidade encontra-se a 3km do hotel.',
          order: 2
        },
        {
          question: 'Como chegar ao hotel usando transporte público?',
          answer: 'A partir da rodoviária central, você pode pegar o ônibus linha 102 que passa em frente ao hotel a cada 30 minutos. Do aeroporto, recomendamos táxi ou nosso serviço de transfer.',
          order: 3
        },
        {
          question: 'Há opções de restaurantes nas proximidades?',
          answer: 'Sim, num raio de 2km do hotel há diversos restaurantes com gastronomia regional e internacional. Nossa recepção pode fornecer recomendações e auxiliar com reservas.',
          order: 4
        }
      ]
    }
  ];

  for (const categoryData of categories) {
    const { questions, ...categoryInfo } = categoryData;

    const category = await prisma.fAQCategory.upsert({
      where: { id: `faq-cat-${categoryInfo.order}` },
      update: categoryInfo,
      create: {
        id: `faq-cat-${categoryInfo.order}`,
        ...categoryInfo,
        isActive: true,
      }
    });

    for (const question of questions) {
      await prisma.fAQItem.upsert({
        where: { id: `faq-item-${categoryInfo.order}-${question.order}` },
        update: {
          ...question,
          categoryId: category.id,
        },
        create: {
          id: `faq-item-${categoryInfo.order}-${question.order}`,
          ...question,
          categoryId: category.id,
          isActive: true,
        }
      });
    }
  }

  logger.info('✅ FAQ seeded');
}
