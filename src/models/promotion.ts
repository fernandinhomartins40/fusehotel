
export interface Promotion {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  description: string; // Add this for PromotionCard compatibility
  image: string;
  startDate: string;
  endDate: string;
  validUntil: string; // Add this for PromotionCard compatibility
  originalPrice: number;
  discountedPrice: number;
  maxGuests: number; // Add this for PromotionCard compatibility
  type: 'package' | 'promotion';
  active: boolean;
  featured: boolean;
  features: string[];
  highlights: string[]; // Add this for PromotionCard compatibility
}

export const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Pacote Romântico',
    shortDescription: 'Desfrute de uma escapada romântica com jantar à luz de velas e tratamentos de spa.',
    description: 'Desfrute de uma escapada romântica com jantar à luz de velas e tratamentos de spa.',
    longDescription: `
      Pacote romântico especial para casais que buscam um momento inesquecível.
      
      Inclui:
      - Hospedagem por 2 noites em uma suíte luxuosa
      - Jantar à luz de velas com menu especial
      - Uma sessão de massagem para casal
      - Café da manhã no quarto
      - Espumante de boas-vindas
      - Decoração especial no quarto
    `,
    image: '/lovable-uploads/c33e15e6-8851-4284-98b7-0979c47250df.png',
    startDate: '2025-06-01',
    endDate: '2025-07-30',
    validUntil: '2025-07-30',
    originalPrice: 1500,
    discountedPrice: 1200,
    maxGuests: 2,
    type: 'package',
    active: true,
    featured: true,
    features: ['Hospedagem 2 noites', 'Jantar romântico', 'Massagem para casal', 'Café da manhã no quarto'],
    highlights: ['Jantar romântico', 'Massagem para casal', 'Decoração especial']
  },
  {
    id: '2',
    title: 'Promoção de Férias',
    shortDescription: 'Traga a família e ganhe 30% de desconto em estadias de 5 ou mais diárias.',
    description: 'Traga a família e ganhe 30% de desconto em estadias de 5 ou mais diárias.',
    longDescription: `
      Promoção especial para toda família aproveitar as férias!
      
      Detalhes:
      - 30% de desconto em estadias de 5 ou mais diárias
      - Acesso gratuito a todas as instalações do hotel
      - Crianças até 10 anos não pagam hospedagem
      - Inclui café da manhã completo
      - Uma atividade recreativa gratuita por dia para as crianças
    `,
    image: '/lovable-uploads/c04646a7-93df-4e87-b81e-e131b503402c.png',
    startDate: '2025-06-15',
    endDate: '2025-08-15',
    validUntil: '2025-08-15',
    originalPrice: 3500,
    discountedPrice: 2450,
    maxGuests: 6,
    type: 'promotion',
    active: true,
    featured: true,
    features: ['30% de desconto', 'Crianças não pagam', 'Café da manhã', 'Atividades recreativas'],
    highlights: ['30% desconto', 'Crianças grátis', 'Café da manhã']
  },
  {
    id: '3',
    title: 'Escapada de Fim de Semana',
    shortDescription: 'Escape da rotina com nossa promoção especial para fins de semana.',
    description: 'Escape da rotina com nossa promoção especial para fins de semana.',
    longDescription: `
      Relaxe e recarregue suas energias com nossa escapada de fim de semana.
      
      Inclui:
      - Hospedagem por 2 noites (sexta a domingo)
      - Café da manhã completo
      - Acesso ao spa e instalações de bem-estar
      - Check-out tardio (até às 16h, sujeito à disponibilidade)
      - Welcome drink
    `,
    image: '/lovable-uploads/a8a98421-6373-495b-bd09-09fe23f32aed.png',
    startDate: '2025-05-01',
    endDate: '2025-12-15',
    validUntil: '2025-12-15',
    originalPrice: 1200,
    discountedPrice: 950,
    maxGuests: 2,
    type: 'promotion',
    active: true,
    featured: false,
    features: ['Hospedagem 2 noites', 'Café da manhã', 'Acesso ao spa', 'Check-out tardio'],
    highlights: ['Fim de semana', 'Spa incluso', 'Check-out tardio']
  }
];
