import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class LandingSettingsService {
  static async get(section: string) {
    const settings = await prisma.landingPageSettings.findUnique({
      where: { section }
    });

    if (!settings) {
      return this.getDefaultSettings(section);
    }

    return settings;
  }

  static async getAll() {
    return await prisma.landingPageSettings.findMany({
      where: { isActive: true }
    });
  }

  static async upsert(section: string, config: any) {
    return await prisma.landingPageSettings.upsert({
      where: { section },
      create: {
        section,
        config,
        isActive: true
      },
      update: {
        config
      }
    });
  }

  static async delete(section: string) {
    const settings = await prisma.landingPageSettings.findUnique({
      where: { section }
    });

    if (!settings) {
      throw new NotFoundError('Configuração não encontrada');
    }

    await prisma.landingPageSettings.delete({
      where: { section }
    });
  }

  private static getDefaultSettings(section: string) {
    const defaults: Record<string, any> = {
      header: {
        logo: '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png',
        browserTitle: 'Águas Claras',
        backgroundColor: '#FFFFFF',
        textColor: '#333333',
        hoverColor: '#0466C8',
        buttonText: 'Área do cliente',
        buttonBackground: '#0466C8',
        buttonHover: '#0355A6',
        buttonTextColor: '#FFFFFF'
      },
      accommodations: {
        title: 'ACOMODAÇÕES',
        subtitle: 'CONFORTO, LUXO E SOFISTICAÇÃO',
        description: 'Nossas suites foram projetadas para oferecer o máximo de conforto e privacidade, com vista para o mar.',
        backgroundColor: '#f9f9f9',
        titleColor: '#1D1D1F',
        subtitleColor: '#676C76',
        buttonText: 'VER MAIS',
        buttonColor: '#0466C8',
        buttonHoverColor: '#0355A6'
      },
      promotions: {
        title: 'Pacotes e Promoções',
        description: 'Confira nossas ofertas especiais para tornar sua estadia ainda mais memorável.',
        backgroundColor: '#f9f9f9',
        titleColor: '#1D1D1F',
        buttonText: 'Ver todas as promoções',
        buttonColor: '#0466C8'
      },
      highlights: {
        title: 'DESTAQUES',
        subtitle: 'EXPERIÊNCIAS INCRÍVEIS ESPERAM POR VOCÊ',
        description: 'Descubra as experiências que tornam nosso resort único. De relaxamento absoluto a aventuras emocionantes.',
        backgroundColor: '#ffffff',
        titleColor: '#1D1D1F',
        subtitleColor: '#676C76'
      },
      gallery: {
        title: 'GALERIA DE FOTOS',
        subtitle: 'EXPLORE CADA DETALHE DO NOSSO RESORT',
        description: 'Veja as paisagens deslumbrantes, acomodações luxuosas e experiências incríveis que aguardam você.',
        backgroundColor: '#ffffff',
        titleColor: '#1D1D1F',
        subtitleColor: '#676C76'
      },
      partners: {
        title: 'PARCEIROS',
        backgroundColor: 'linear-gradient(148deg, #05111D 0%, #0C3864 100%)',
        titleColor: '#ffffff'
      },
      newsletter: {
        title: 'NEWSLETTER',
        description: 'Seu email está protegido. Nunca enviaremos SPAM.',
        backgroundColor: '#0466C8',
        titleColor: '#ffffff',
        buttonText: 'Enviar',
        buttonColor: '#000000'
      },
      footer: {
        logo: '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        linkColor: '#9CA3AF',
        linkHoverColor: '#ffffff',
        aboutText: 'Bem-vindo ao Águas Claras, onde conforto e natureza se encontram para proporcionar uma experiência única de hospedagem.',
        copyright: 'ÁGUAS CLARAS 2.0 - TODOS OS DIREITOS RESERVADOS',
        address: 'Rua das Águas, 123, Centro\nÁguas Claras - SP, 12345-678',
        phone: '(11) 5555-5555',
        whatsapp: '(11) 99999-9999',
        email: 'contato@aguasclaras.com',
        socialMedia: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com'
        }
      }
    };

    return {
      section,
      config: defaults[section] || {},
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
