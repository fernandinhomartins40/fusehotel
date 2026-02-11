import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedLandingPage() {
  console.log('Seeding landing page...');

  const heroSlide = await prisma.heroSlide.upsert({
    where: { id: 'seed-hero-1' },
    update: {},
    create: {
      id: 'seed-hero-1',
      title: 'REFÚGIO DOS SEUS SONHOS',
      subtitle: 'O REFÚGIO PERFEITO PARA SE DESCONECTAR',
      description: 'Desfrute de uma estadia inesquecível em nosso resort à beira-mar, com acomodações de luxo e paisagens deslumbrantes.',
      backgroundType: 'image',
      backgroundValue: '/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png',
      buttonText: 'AGENDAMENTO ONLINE',
      buttonColor: '#0466C8',
      buttonHoverColor: '#0355A6',
      textColor: '#FFFFFF',
      order: 1,
      isActive: true,
      showTitle: true,
      showSubtitle: true,
      showDescription: true,
      showButton: true,
      showRating: true
    }
  });

  console.log('Hero slide created:', heroSlide.id);

  const highlights = [
    {
      id: 'seed-highlight-1',
      title: 'SPA DE LUXO',
      subtitle: 'Relaxamento e Rejuvenescimento',
      image: '/lovable-uploads/bca108a5-820b-418c-bb37-1fdfb497dc24.png',
      order: 1
    },
    {
      id: 'seed-highlight-2',
      title: 'FESTAS INCRÍVEIS',
      subtitle: 'Diversão para toda família',
      image: '/lovable-uploads/1e861110-a179-4f1f-aa1a-caeb85c10609.png',
      order: 2
    },
    {
      id: 'seed-highlight-3',
      title: 'GASTRONOMIA',
      subtitle: 'Experiência culinária internacional',
      image: '/lovable-uploads/a7433b3a-710f-49d8-b286-8066127891b0.png',
      order: 3
    },
    {
      id: 'seed-highlight-4',
      title: 'PÉ NA AREIA',
      subtitle: 'Um mergulho no Paraíso',
      image: '/lovable-uploads/6cff717e-9bcc-4de2-8466-11400c267a66.png',
      order: 4
    }
  ];

  for (const highlight of highlights) {
    await prisma.highlightItem.upsert({
      where: { id: highlight.id },
      update: {},
      create: highlight
    });
  }

  console.log('Highlights created');

  const galleryImages = [
    '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png',
    '/lovable-uploads/c69b73c8-38b5-4604-bfd2-a8757ed39926.png',
    '/lovable-uploads/fded9012-6848-480f-9d6b-4f1d657bc776.png',
    '/lovable-uploads/2b637749-b3cc-4943-8c7b-195634e4be2d.png',
    '/lovable-uploads/9ba14886-b3ce-4365-869f-8a6daaf9f6a7.png'
  ];

  for (let i = 0; i < galleryImages.length; i++) {
    await prisma.galleryImage.upsert({
      where: { id: `seed-gallery-${i + 1}` },
      update: {},
      create: {
        id: `seed-gallery-${i + 1}`,
        url: galleryImages[i],
        alt: `Foto da galeria ${i + 1}`,
        order: i + 1
      }
    });
  }

  console.log('Gallery images created');

  // Newsletter section config
  await prisma.landingPageSettings.upsert({
    where: { section: 'newsletter' },
    update: {},
    create: {
      id: 'seed-newsletter',
      section: 'newsletter',
      config: {
        title: 'NEWSLETTER',
        description: 'Inscreva-se em nossa newsletter e receba ofertas exclusivas e novidades.',
        backgroundColor: '#0466C8',
        titleColor: '#FFFFFF',
        buttonText: 'Enviar',
        buttonColor: '#000000',
        buttonHoverColor: '#333333',
      }
    }
  });

  console.log('Newsletter section created');

  // Footer section config
  await prisma.landingPageSettings.upsert({
    where: { section: 'footer' },
    update: {},
    create: {
      id: 'seed-footer',
      section: 'footer',
      config: {
        backgroundColor: '#1A1A1A',
        textColor: '#9CA3AF',
        headingColor: '#FFFFFF',
        copyrightColor: '#6B7280',
        borderColor: '#1F2937',
        aboutText: 'Bem-vindo ao Hotel Águas Claras, onde conforto e natureza se encontram para proporcionar uma experiência única de hospedagem.',
        copyright: `© ${new Date().getFullYear()} Hotel Águas Claras - TODOS OS DIREITOS RESERVADOS`,
        address: 'Av. das Águas Claras, 1000 - Serra da Mantiqueira, MG',
        phone: '(35) 3456-7890',
        whatsapp: '(35) 98765-4321',
        email: 'contato@hotelaguasclaras.com.br',
        businessHours: 'Recepção 24h\nCheck-in: 14h\nCheck-out: 12h',
        facebookUrl: 'https://facebook.com/hotelaguasclaras',
        instagramUrl: 'https://instagram.com/hotelaguasclaras',
        linkedinUrl: 'https://linkedin.com/company/hotelaguasclaras',
        logo: '/lovable-uploads/91e13e81-bbd9-4aab-b810-d81bb336ecb8.png'
      }
    }
  });

  console.log('Footer section created');
  console.log('Landing page seeded successfully!');
}
