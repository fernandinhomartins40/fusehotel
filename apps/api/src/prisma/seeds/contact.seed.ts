import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';

export async function seedContact() {
  logger.info('🌱 Seeding Contact page...');

  // Create Contact Hero settings
  await prisma.landingPageSettings.upsert({
    where: { section: 'contact-hero' },
    update: {
      config: {
        title: 'Entre em Contato',
        description: 'Estamos à disposição para responder suas dúvidas, receber sugestões ou ajudar com sua reserva.',
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF',
        height: 'auto',
      }
    },
    create: {
      section: 'contact-hero',
      config: {
        title: 'Entre em Contato',
        description: 'Estamos à disposição para responder suas dúvidas, receber sugestões ou ajudar com sua reserva.',
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF',
        height: 'auto',
      },
      isActive: true,
    }
  });

  // Create Contact Cards settings
  await prisma.landingPageSettings.upsert({
    where: { section: 'contact-cards' },
    update: {
      config: {
        backgroundColor: '#F9FAFB',
        phoneTitle: 'Telefone',
        phoneDescription: 'Estamos disponíveis para atendê-lo por telefone em horário comercial.',
        phoneNumber: '(11) 5555-5555',
        whatsappTitle: 'WhatsApp',
        whatsappDescription: 'Envie mensagens pelo WhatsApp para atendimento rápido.',
        whatsappNumber: '(11) 99999-9999',
        emailTitle: 'E-mail',
        emailDescription: 'Envie um e-mail para nossa equipe e responderemos em até 24 horas.',
        emailAddress: 'contato@aguasclaras.com',
        cardIconColor: '#0466C8',
        cardLinkColor: '#0466C8',
      }
    },
    create: {
      section: 'contact-cards',
      config: {
        backgroundColor: '#F9FAFB',
        phoneTitle: 'Telefone',
        phoneDescription: 'Estamos disponíveis para atendê-lo por telefone em horário comercial.',
        phoneNumber: '(11) 5555-5555',
        whatsappTitle: 'WhatsApp',
        whatsappDescription: 'Envie mensagens pelo WhatsApp para atendimento rápido.',
        whatsappNumber: '(11) 99999-9999',
        emailTitle: 'E-mail',
        emailDescription: 'Envie um e-mail para nossa equipe e responderemos em até 24 horas.',
        emailAddress: 'contato@aguasclaras.com',
        cardIconColor: '#0466C8',
        cardLinkColor: '#0466C8',
      },
      isActive: true,
    }
  });

  // Create Contact Form settings
  await prisma.landingPageSettings.upsert({
    where: { section: 'contact-form' },
    update: {
      config: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        formTitle: 'Envie uma Mensagem',
        formDescription: 'Preencha o formulário abaixo com suas informações e entraremos em contato o mais breve possível.',
        mapTitle: 'Nossa Localização',
        mapDescription: 'Visite-nos e conheça pessoalmente toda a estrutura do Hotel Águas Claras.',
        addressLabel: 'Endereço:',
        addressLine1: 'Rua das Águas, 123, Centro',
        addressLine2: 'Águas Claras - SP, 12345-678',
        hoursLabel: 'Horário de Funcionamento:',
        hoursLine1: 'Recepção: 24 horas',
        hoursLine2: 'Atendimento telefônico: 8h às 22h',
        buttonText: 'Enviar Mensagem',
        buttonColor: '#0466C8',
        buttonTextColor: '#FFFFFF',
      }
    },
    create: {
      section: 'contact-form',
      config: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0466C8',
        formTitle: 'Envie uma Mensagem',
        formDescription: 'Preencha o formulário abaixo com suas informações e entraremos em contato o mais breve possível.',
        mapTitle: 'Nossa Localização',
        mapDescription: 'Visite-nos e conheça pessoalmente toda a estrutura do Hotel Águas Claras.',
        addressLabel: 'Endereço:',
        addressLine1: 'Rua das Águas, 123, Centro',
        addressLine2: 'Águas Claras - SP, 12345-678',
        hoursLabel: 'Horário de Funcionamento:',
        hoursLine1: 'Recepção: 24 horas',
        hoursLine2: 'Atendimento telefônico: 8h às 22h',
        buttonText: 'Enviar Mensagem',
        buttonColor: '#0466C8',
        buttonTextColor: '#FFFFFF',
      },
      isActive: true,
    }
  });

  // Create Contact FAQ CTA settings
  await prisma.landingPageSettings.upsert({
    where: { section: 'contact-faq-cta' },
    update: {
      config: {
        title: 'Perguntas Frequentes',
        description: 'Encontre respostas para as perguntas mais comuns sobre nossa hospedagem e serviços.',
        buttonText: 'Ver todas as FAQs',
        buttonUrl: '/faq',
        backgroundColor: '#F9FAFB',
        titleColor: '#000000',
        subtitleColor: '#374151',
        buttonColor: '#0466C8',
        buttonTextColor: '#FFFFFF',
      }
    },
    create: {
      section: 'contact-faq-cta',
      config: {
        title: 'Perguntas Frequentes',
        description: 'Encontre respostas para as perguntas mais comuns sobre nossa hospedagem e serviços.',
        buttonText: 'Ver todas as FAQs',
        buttonUrl: '/faq',
        backgroundColor: '#F9FAFB',
        titleColor: '#000000',
        subtitleColor: '#374151',
        buttonColor: '#0466C8',
        buttonTextColor: '#FFFFFF',
      },
      isActive: true,
    }
  });

  logger.info('✅ Contact page seeded');
}
