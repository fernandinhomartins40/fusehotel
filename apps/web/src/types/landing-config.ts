// Common configuration fields shared across sections
export interface BaseSectionConfig {
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

// Header Section Configuration
export interface HeaderConfig extends BaseSectionConfig {
  logo?: string;
  textColor?: string;
  hoverColor?: string;
  buttonText?: string;
  buttonBackground?: string;
  buttonHover?: string;
  buttonTextColor?: string;
}

// Hero Section Configuration
export interface HeroConfig extends BaseSectionConfig {
  autoplaySpeed?: number; // seconds
  transitionEffect?: 'fade' | 'slide';
  showNavigationArrows?: boolean;
  showDotsIndicator?: boolean;
}

// Accommodations Section Configuration
export interface AccommodationsConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
}

// Promotions Section Configuration
export interface PromotionsConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
}

// Highlights Section Configuration
export interface HighlightsConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
}

// Gallery Section Configuration
export interface GalleryConfig extends BaseSectionConfig {
  title?: string;
  subtitle?: string;
  description?: string;
}

// Partners Section Configuration
export interface PartnersConfig extends BaseSectionConfig {
  title?: string;
}

// Newsletter Section Configuration
export interface NewsletterConfig extends BaseSectionConfig {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
}

// Footer Section Configuration
export interface FooterConfig extends BaseSectionConfig {
  logo?: string;
  textColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
  aboutText?: string;
  copyright?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

// Default configurations for each section
export const defaultHeaderConfig: HeaderConfig = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  hoverColor: '#0466C8',
  buttonText: 'Reservar Agora',
  buttonBackground: '#0466C8',
  buttonHover: '#0354A8',
  buttonTextColor: '#FFFFFF',
};

export const defaultHeroConfig: HeroConfig = {
  autoplaySpeed: 5,
  transitionEffect: 'slide',
  showNavigationArrows: true,
  showDotsIndicator: true,
};

export const defaultAccommodationsConfig: AccommodationsConfig = {
  title: 'ACOMODAÇÕES',
  subtitle: 'Conforto e Elegância',
  description: 'Descubra nossas acomodações luxuosas e confortáveis, projetadas para proporcionar uma experiência inesquecível.',
  backgroundColor: '#F9F9F9',
  titleColor: '#000000',
  subtitleColor: '#666666',
  buttonText: 'Ver Detalhes',
  buttonColor: '#0466C8',
  buttonHoverColor: '#0354A8',
};

export const defaultPromotionsConfig: PromotionsConfig = {
  title: 'PROMOÇÕES ESPECIAIS',
  description: 'Aproveite nossas ofertas exclusivas e economize em sua próxima estadia.',
  backgroundColor: '#FFFFFF',
  titleColor: '#000000',
  buttonText: 'Ver Promoção',
  buttonColor: '#0466C8',
};

export const defaultHighlightsConfig: HighlightsConfig = {
  title: 'POR QUE ESCOLHER NOSSO HOTEL',
  subtitle: 'Experiência Única',
  description: 'Oferecemos serviços e comodidades que tornarão sua estadia memorável.',
  backgroundColor: '#F5F5F5',
  titleColor: '#000000',
  subtitleColor: '#666666',
};

export const defaultGalleryConfig: GalleryConfig = {
  title: 'GALERIA',
  subtitle: 'Momentos Inesquecíveis',
  description: 'Explore nosso hotel através de imagens que capturam a essência da sua próxima estadia.',
  backgroundColor: '#FFFFFF',
  titleColor: '#000000',
  subtitleColor: '#666666',
};

export const defaultPartnersConfig: PartnersConfig = {
  title: 'NOSSOS PARCEIROS',
  backgroundColor: '#F9F9F9',
  titleColor: '#000000',
};

export const defaultNewsletterConfig: NewsletterConfig = {
  title: 'FIQUE POR DENTRO',
  description: 'Inscreva-se em nossa newsletter e receba ofertas exclusivas e novidades.',
  backgroundColor: '#0466C8',
  titleColor: '#FFFFFF',
  buttonText: 'Inscrever-se',
  buttonColor: '#FFFFFF',
  buttonHoverColor: '#F0F0F0',
};

export const defaultFooterConfig: FooterConfig = {
  backgroundColor: '#1A1A1A',
  textColor: '#FFFFFF',
  linkColor: '#0466C8',
  linkHoverColor: '#0354A8',
  aboutText: 'Oferecemos experiências únicas em hospedagem com conforto, elegância e atendimento personalizado.',
  copyright: '© 2024 FuseHotel. Todos os direitos reservados.',
  address: 'Rua Exemplo, 123 - Cidade, Estado',
  phone: '(11) 1234-5678',
  whatsapp: '(11) 98765-4321',
  email: 'contato@fusehotel.com',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
};
